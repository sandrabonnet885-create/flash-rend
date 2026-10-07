// Rendu image par image dans Chromium sans écran.
//   node video/hero/render.mjs preview 0,45,90          -> out/preview/f0000.png ...
//   node video/hero/render.mjs all [workers] [début] [fin] -> out/frames/0000.jpg ...
// Variables : FORMAT=v (vertical 9:16), VERSION=60 (démo 60 s), ENTRY (page HTML, défaut index.html), FRAMES, PREVIEW.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const { TL } = require("./timeline.js");

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(ROOT, "../../public");
const ENTRY = process.env.ENTRY || "index.html";
const VERTICAL = process.env.FORMAT === "v";
const VERSION = process.env.VERSION || "30";
const SUFFIX = (VERSION === "30" ? "" : `-${VERSION}`) + (VERTICAL ? "-v" : "");
const QUERY = [VERTICAL ? "f=v" : "", VERSION === "30" ? "" : `v=${VERSION}`].filter(Boolean).join("&");
const FRAMES = process.env.FRAMES || path.join(ROOT, `out/frames${SUFFIX}`);
const PREVIEW = process.env.PREVIEW || path.join(ROOT, `out/preview${SUFFIX}`);
const VIEWPORT = VERTICAL ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };

const TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".jpg": "image/jpeg",
};

// Serveur HTTP local : jamais file://, sinon le canvas est « tainted ».
function serve() {
    const server = http.createServer((req, res) => {
        const url = decodeURIComponent(req.url.split("?")[0]);
        const file = url.startsWith("/public/")
            ? path.join(PUBLIC, url.slice(8))
            : path.join(ROOT, url === "/" ? ENTRY : url);
        if (!file.startsWith(ROOT) && !file.startsWith(PUBLIC)) return res.writeHead(403).end();
        fs.readFile(file, (err, data) => {
            if (err) return res.writeHead(404).end();
            res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
            res.end(data);
        });
    });
    return new Promise((res) => server.listen(0, "127.0.0.1", () => res(server)));
}

async function openPage(browser, port) {
    const page = await browser.newPage({ viewport: VIEWPORT });
    page.on("pageerror", (e) => console.error("[page]", e.message));
    await page.goto(`http://127.0.0.1:${port}/${QUERY ? "?" + QUERY : ""}`);
    await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
    return page;
}

async function renderTo(page, f, type, out) {
    const url = await page.evaluate(([fr, ty]) => window.renderFrame(fr, ty), [f, type]);
    fs.writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
}

const [mode = "all", a1, a2, a3] = process.argv.slice(2);
const server = await serve();
const port = server.address().port;
const browser = await chromium.launch();

try {
    if (mode === "preview") {
        fs.mkdirSync(PREVIEW, { recursive: true });
        const page = await openPage(browser, port);
        const list = (a1 || "0").split(",").map(Number);
        for (const f of list) {
            await renderTo(page, f, "png", path.join(PREVIEW, `f${String(f).padStart(4, "0")}.png`));
        }
        console.log(`preview ${list.length} image(s) -> ${PREVIEW}`);
    } else {
        fs.mkdirSync(FRAMES, { recursive: true });
        const workers = Number(a1 || 2);
        const start = Number(a2 || 0);
        const end = Number(a3 ?? TL.FRAMES - 1);
        const total = end - start + 1;
        let next = start;
        let done = 0;
        const t0 = Date.now();
        await Promise.all(
            Array.from({ length: workers }, async () => {
                const page = await openPage(browser, port);
                while (next <= end) {
                    const f = next++;
                    await renderTo(page, f, "jpeg", path.join(FRAMES, `${String(f).padStart(4, "0")}.jpg`));
                    done++;
                    if (done % 30 === 0 || done === total) {
                        const s = ((Date.now() - t0) / 1000).toFixed(0);
                        console.log(`${done}/${total} (${s} s)`);
                    }
                }
            }),
        );
    }
} finally {
    await browser.close();
    server.close();
}
