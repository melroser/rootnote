import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0410",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: 999,
            border: "2px solid #ff2d8e",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 13,
              fontWeight: 800,
              color: "#22e0e8",
              letterSpacing: -0.5,
              marginTop: 1,
            }}
          >
            R
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
