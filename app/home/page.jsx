import AnimatedBackground from "@/components/AnimatedBackground";
import WallpaperGallery from "@/components/WallpaperGallery";

export const metadata = {
  title: "Wallpaper Hub — Premium 4K Wallpapers",
  description: "Discover and download stunning 4K wallpapers powered by Wallhaven.",
};

export default function Homepage() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            W
          </div>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 14, letterSpacing: -0.3 }}>
            Wallpaper Hub
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 12, color: "#475569" }} className="hidden sm:block">
            Powered by Wallhaven
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#60a5fa",
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 99,
              padding: "2px 10px",
            }}
          >
            Free
          </span>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24">

        {/* Hero */}
        <div style={{ marginBottom: 48, maxWidth: 640 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 99,
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.22)",
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              color: "#60a5fa",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#60a5fa",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Live wallpaper stream
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: -1,
              color: "#f1f5f9",
              marginBottom: 16,
            }}
          >
            Your next{" "}
            <span className="grad-text">perfect background</span>
            {" "}is here.
          </h1>
          <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.7 }}>
            Browse thousands of curated 4K wallpapers. Search by style, vibe, or
            color — download in one click.
          </p>
        </div>

        {/* Gallery Card */}
        <div className="glass rounded-3xl glow-blue" style={{ padding: "32px 40px" }}>
          <WallpaperGallery />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "28px 0",
          textAlign: "center",
          fontSize: 12,
          color: "#334155",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        © 2026 Wallpaper Hub · Images sourced from{" "}
        <a
          href="https://wallhaven.cc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#475569", textDecoration: "underline" }}
        >
          Wallhaven
        </a>
      </footer>
    </main>
  );
}
