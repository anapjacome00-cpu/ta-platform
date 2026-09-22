export default function Cancel() {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.h1}>tu pago no se completó</h1>
        <p style={styles.p}>
          no te preocupes, no se hizo ningún cargo. tu configuración sigue
          guardada — puedes regresar e intentarlo de nuevo cuando quieras.
        </p>
        <a href="/" style={styles.btn}>
          volver al configurador
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
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 10px 40px rgba(0,0,0,.08)",
    textAlign: "center",
  },
  h1: { fontSize: 19, fontWeight: 500, marginBottom: 10, color: "#111827" },
  p: { fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 22 },
  btn: {
    display: "inline-block",
    background: "#36322C",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
  },
};
