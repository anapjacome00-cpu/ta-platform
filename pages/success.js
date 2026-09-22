import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function getServerSideProps({ query }) {
  const { session_id } = query;
  if (!session_id) {
    return { props: { session: null } };
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return {
      props: {
        session: {
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_email,
          payment_status: session.payment_status,
          metadata: session.metadata || {},
        },
      },
    };
  } catch (err) {
    return { props: { session: null } };
  }
}

export default function Success({ session }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.dot} />
        <h1 style={styles.h1}>
          {session ? "¡Gracias por tu pedido!" : "Pago recibido"}
        </h1>
        {session ? (
          <>
            <p style={styles.p}>
              Confirmamos tu{" "}
              {session.metadata.purchaseMode === "deposit"
                ? "depósito"
                : "pago completo"}{" "}
              de{" "}
              <strong>
                {(session.amount_total / 100).toLocaleString(
                  session.currency === "usd" ? "en-US" : "es-MX"
                )}{" "}
                {session.currency?.toUpperCase()}
              </strong>
              .
            </p>
            <p style={styles.p}>
              Te vamos a escribir a <strong>{session.customer_email}</strong>{" "}
              con los siguientes pasos y el contacto de tu maker asignado.
            </p>
            <div style={styles.summary}>
              {session.metadata.cols}×{session.metadata.rows} módulos ·{" "}
              {session.metadata.material} · {session.metadata.finish}
            </div>
          </>
        ) : (
          <p style={styles.p}>
            Tu pago se procesó correctamente. Te contactaremos por correo con
            los detalles.
          </p>
        )}
        <a href="/" style={styles.btn}>
          Volver al configurador
        </a>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FAFAF8",
    fontFamily: "'DM Sans', sans-serif",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "36px 32px",
    maxWidth: 440,
    width: "100%",
    boxShadow: "0 10px 40px rgba(0,0,0,.08)",
    textAlign: "center",
  },
  dot: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#4B8568",
    margin: "0 auto 18px",
  },
  h1: { fontSize: 20, fontWeight: 500, marginBottom: 10, color: "#111827" },
  p: { fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 10 },
  summary: {
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    color: "#6B7280",
    background: "#F4F1EE",
    borderRadius: 8,
    padding: "8px 12px",
    marginTop: 8,
    marginBottom: 20,
  },
  btn: {
    display: "inline-block",
    marginTop: 8,
    background: "#36322C",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
  },
};
