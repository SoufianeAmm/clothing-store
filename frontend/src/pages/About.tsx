import Reveal from "../components/Reveal";

export default function About() {
  return (
    <div className="container section">
      <div className="about-hero hero-anim hero-anim-1">
        <h1>About AURELIA</h1>
        <p>
          AURELIA was founded on a simple idea: clothing should be well made, honestly priced,
          and built to outlast the trend cycle. We design in small batches, favor durable
          natural fabrics, and keep our collection tight — every piece earns its place.
        </p>
      </div>

      <Reveal
        className="product-detail-image"
        style={{
          aspectRatio: "16 / 7",
          marginBottom: 56,
          background: "radial-gradient(circle at 30% 40%, #3a3530 0%, #17171a 60%, #0c0c0d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "4rem", fontWeight: 800, letterSpacing: "0.1em" }}>
          AURELIA
        </span>
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-value" delay={0}>
          <h3>Thoughtful Design</h3>
          <p>
            Every silhouette is refined over multiple seasons before it earns a permanent spot in
            the collection. We'd rather do fewer things well.
          </p>
        </Reveal>
        <Reveal className="about-value" delay={80}>
          <h3>Durable Materials</h3>
          <p>
            We work with mills that prioritize longevity — heavyweight cottons, brushed fleece,
            and denim that softens without falling apart.
          </p>
        </Reveal>
        <Reveal className="about-value" delay={160}>
          <h3>Honest Pricing</h3>
          <p>
            No inflated markups, no constant discount cycles. The price you see reflects what the
            product is actually worth.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
