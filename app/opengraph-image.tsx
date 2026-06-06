import { ImageResponse } from "next/og";

export const alt =
  "Rootnote — Guided radio that traces music to its roots";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const eqHeights = [48, 72, 56, 88, 64, 80, 52, 92, 68, 96, 58, 84, 62, 76];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0410",
          color: "#fdf3f7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 28,
              fontWeight: 700,
              color: "#b89cc7",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#ff2d8e",
              }}
            />
            <span>On air</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#ff2d8e" }}>Root</span>
            <span style={{ color: "#22e0e8" }}>note</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: "#fdf3f7",
              maxWidth: 900,
              fontWeight: 600,
            }}
          >
            Guided radio that traces music to its roots
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              height: 96,
            }}
          >
            {eqHeights.map((height, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  width: 14,
                  height,
                  borderRadius: 6,
                  background: index % 2 === 0 ? "#ff2d8e" : "#22e0e8",
                  opacity: 0.82,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 24,
              color: "#b89cc7",
              textAlign: "right",
              lineHeight: 1.45,
              maxWidth: 420,
            }}
          >
            <span>College radio host · YouTube episodes</span>
            <span>Trace samples, scenes &amp; influences</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
