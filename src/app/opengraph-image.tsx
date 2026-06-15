import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Maksym Mishchenko — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "#60a5fa",
            marginBottom: 16,
            display: "flex",
          }}
        >
          mmishchenko.dev
        </div>
        <div
          style={{
            fontSize: 64,
            color: "#fafafa",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            display: "flex",
          }}
        >
          Maksym Mishchenko
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          Software Engineer II @ Microsoft Security
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#71717a",
            marginTop: 16,
            display: "flex",
          }}
        >
          Backend · Distributed Systems · Security · Agent Automation
        </div>
      </div>
    ),
    { ...size }
  );
}
