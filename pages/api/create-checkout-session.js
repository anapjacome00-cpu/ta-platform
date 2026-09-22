import Stripe from "stripe";

// la llave secreta nunca se expone al navegador: solo vive aquí, en el servidor.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const DEPOSIT_PERCENT = 0.3; // 30% — ajustable

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error:
        "STRIPE_SECRET_KEY no está configurada. revisa tu archivo .env.local",
    });
  }

  try {
    const {
      mode, // 'deposit' | 'full'
      currency = "mxn",
      totalAmount, // monto total de la configuración, en la moneda indicada (no en centavos)
      config = {},
      customerName,
      customerEmail,
      configSummary,
    } = req.body || {};

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: "monto inválido" });
    }
    if (!customerEmail) {
      return res.status(400).json({ error: "falta el correo del cliente" });
    }
    if (mode !== "deposit" && mode !== "full") {
      return res.status(400).json({ error: "mode debe ser deposit o full" });
    }

    const isDeposit = mode === "deposit";
    const chargeAmount = isDeposit
      ? Math.round(totalAmount * DEPOSIT_PERCENT)
      : Math.round(totalAmount);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const productName = `tä — Librero Módulo·ä${
      configSummary ? ` (${configSummary})` : ""
    }`;

    const description = isDeposit
      ? `Depósito de reserva (${Math.round(
          DEPOSIT_PERCENT * 100
        )}%). Saldo restante se cobra antes de fabricación.`
      : "Pago completo del pedido.";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(chargeAmount * 100), // stripe usa centavos
            product_data: {
              name: productName,
              description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        purchaseMode: mode,
        totalAmount: String(totalAmount),
        chargedAmount: String(chargeAmount),
        currency,
        customerName: customerName || "",
        cols: String(config.cols || ""),
        rows: String(config.rows || ""),
        material: config.material || "",
        finish: config.finish || "",
        back: config.back || "",
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "error interno" });
  }
}
