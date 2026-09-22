// endpoint mínimo para capturar leads de "solo cotización, sin pagar".
// hoy solo lo registra en el log del servidor — antes de producción, conecta
// esto a una base de datos real o a un servicio de correo (ver README).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { name, email, config, estimatedTotalMXN, currency } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "falta nombre o correo" });
  }

  // TODO: reemplazar este console.log por guardar en una base de datos
  // (supabase, postgres, airtable, etc.) o enviar un correo/notificación.
  console.log("nuevo lead (solo cotización):", {
    name,
    email,
    config,
    estimatedTotalMXN,
    currency,
    receivedAt: new Date().toISOString(),
  });

  return res.status(200).json({ ok: true });
}
