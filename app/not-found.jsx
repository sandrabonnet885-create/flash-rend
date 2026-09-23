import { headers } from "next/headers";

function randomId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `cdg1::${s}-${Date.now()}-${Math.random().toString(16).slice(2, 14)}`;
}

const mono = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  background: "#1a1a1a",
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 13,
};

export default async function NotFound() {
  const h = await headers();
  const id = h.get("x-vercel-id") || randomId();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 24px" }}>
          404: NOT_FOUND
        </h1>
        <p style={{ margin: "0 0 10px", fontSize: 14, color: "#a1a1a1" }}>
          Code: <code style={mono}>DEPLOYMENT_NOT_FOUND</code>
        </p>
        <p style={{ margin: "0 0 28px", fontSize: 14, color: "#a1a1a1", wordBreak: "break-all" }}>
          ID: <code style={mono}>{id}</code>
        </p>
        <a
          href="https://vercel.com/docs/errors/DEPLOYMENT_NOT_FOUND"
          style={{ color: "#52a8ff", fontSize: 14, textDecoration: "none" }}
        >
          Read our documentation to learn more about this error.
        </a>
      </div>
    </main>
  );
}
