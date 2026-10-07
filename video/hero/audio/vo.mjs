// Voix off ElevenLabs, ligne par ligne, placée sur la timeline (TL.vo).
//   node video/hero/audio/vo.mjs voices      -> voix françaises féminines disponibles
//   VOICE_ID=... node video/hero/audio/vo.mjs  -> out/vo/line-N.mp3 puis out/vo.wav
//   REUSE=1 VOICE_ID=... node video/hero/audio/vo.mjs -> replace sans régénérer
//   VERSION=60 ... -> version 60 s (out/vo60/, out/vo60.wav)
// Chaque ligne est accompagnée de l'horodatage de ses mots (line-N.json), pour caler l'animation.
// Clé : variable d'environnement ELEVENLABS_API_KEY (jamais écrite dans le dépôt).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { TL } = require("../timeline.js");

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../out");
const SUFFIX = TL.VERSION === "30" ? "" : TL.VERSION;
const VO_DIR = path.join(OUT, `vo${SUFFIX}`);
const VO_WAV = path.join(OUT, `vo${SUFFIX}.wav`);
const KEY = process.env.ELEVENLABS_API_KEY;
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FFPROBE = process.env.FFPROBE || FFMPEG.replace(/ffmpeg(\.exe)?$/, "ffprobe$1");
const API = "https://api.elevenlabs.io";

if (!KEY) {
    console.error("ELEVENLABS_API_KEY manquante.");
    process.exit(1);
}

async function api(p, opts = {}) {
    const res = await fetch(API + p, { ...opts, headers: { "xi-api-key": KEY, ...(opts.headers || {}) } });
    if (!res.ok) throw new Error(`${res.status} ${p} : ${await res.text()}`);
    return res;
}

async function listVoices() {
    const mine = await (await api("/v1/voices")).json();
    console.log("Voix du compte :");
    for (const v of mine.voices) {
        const l = v.labels || {};
        console.log(`${v.voice_id}  ${v.name}  [${l.gender || "?"}, ${l.accent || l.language || "?"}, ${l.description || l.descriptive || ""}]`);
    }
    const shared = await (await api("/v1/shared-voices?language=fr&gender=female&page_size=15&sort=usage_character_count_1y")).json();
    console.log("\nBibliothèque partagée, voix françaises féminines :");
    for (const v of shared.voices) {
        console.log(`${v.voice_id}  ${v.name}  owner=${v.public_owner_id}  [${v.accent || ""}, ${v.age || ""}, ${v.descriptive || ""}, ${v.use_case || ""}]`);
    }
}

function duration(file) {
    return parseFloat(
        execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString(),
    );
}

async function generate(voice) {
    fs.mkdirSync(VO_DIR, { recursive: true });
    const files = [];
    for (let i = 0; i < TL.vo.length; i++) {
        const [start, text] = TL.vo[i];
        const file = path.join(VO_DIR, `line-${i + 1}.mp3`);
        // REUSE=1 : replace les fichiers déjà générés sans rappeler l'API (pas de quota consommé).
        if (process.env.REUSE && fs.existsSync(file)) {
            const slot = (TL.vo[i + 1]?.[0] ?? TL.DUR) - start - 0.15;
            files.push([file, start, duration(file), slot]);
            continue;
        }
        const res = await api(`/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                previous_text: i ? TL.vo[i - 1][1] : undefined,
                next_text: TL.vo[i + 1]?.[1],
                voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true },
            }),
        });
        const json = await res.json();
        fs.writeFileSync(file, Buffer.from(json.audio_base64, "base64"));
        fs.writeFileSync(file.replace(/\.mp3$/, ".json"), JSON.stringify(json.alignment));
        const slot = (TL.vo[i + 1]?.[0] ?? TL.DUR) - start - 0.15;
        const d = duration(file);
        console.log(`${d <= slot ? "ok " : "LONG"} ${d.toFixed(2)} s / ${slot.toFixed(2)} s  « ${text} »`);
        files.push([file, start, d, slot]);
    }

    // Placement sur la timeline ; une ligne trop longue est accélérée (au plus ×1,12).
    const args = ["-v", "error", "-y"];
    files.forEach(([f]) => args.push("-i", f));
    const chains = files.map(([, start, d, slot], i) => {
        const tempo = d > slot ? Math.min(1.12, d / slot) : 1;
        const ms = Math.round(start * 1000);
        return `[${i}:a]aresample=44100,atempo=${tempo.toFixed(3)},adelay=${ms}|${ms},apad[v${i}]`;
    });
    const mix = files.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${files.length}:normalize=0,atrim=0:${TL.DUR}[out]`;
    args.push("-filter_complex", [...chains, mix].join(";"), "-map", "[out]", "-ac", "2", VO_WAV);
    execFileSync(FFMPEG, args);
    console.log(`voix off -> ${VO_WAV}`);

    // Début de chaque mot en temps absolu, pour caler les animations sur la voix.
    files.forEach(([file, start, d, slot]) => {
        const al = file.replace(/\.mp3$/, ".json");
        if (!fs.existsSync(al)) return;
        const { characters, character_start_times_seconds: ts } = JSON.parse(fs.readFileSync(al, "utf8"));
        const tempo = d > slot ? Math.min(1.12, d / slot) : 1;
        const words = [];
        let cur = "";
        let t0 = null;
        characters.forEach((ch, k) => {
            if (/\s/.test(ch)) {
                if (cur) words.push(`${(start + t0 / tempo).toFixed(2)} ${cur}`);
                cur = "";
                t0 = null;
            } else {
                if (t0 === null) t0 = ts[k];
                cur += ch;
            }
        });
        if (cur) words.push(`${(start + t0 / tempo).toFixed(2)} ${cur}`);
        console.log(words.join(" | "));
    });
}

if (process.argv[2] === "voices") await listVoices();
else {
    if (!process.env.VOICE_ID) {
        console.error("VOICE_ID manquant (voir : node vo.mjs voices).");
        process.exit(1);
    }
    await generate(process.env.VOICE_ID);
}
