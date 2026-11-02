import { ImageResponse } from "next/og";

export const alt = "Daniel McGrath, software engineer based in Boston, MA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#0B3A30",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>Daniel McGrath</div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#E2AE4A" }}>
          Software engineer based in Boston, MA
        </div>
      </div>
    ),
    size
  );
}
