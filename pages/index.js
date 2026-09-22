// sirve la landing page completa (public/landing.html) como html crudo en "/".
// así los botones de stripe checkout de esa página llaman directo a
// /api/create-checkout-session y /api/lead en el mismo dominio, sin iframe
// y sin problemas de cors.
import fs from "fs";
import path from "path";

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), "public", "landing.html");
  const html = fs.readFileSync(filePath, "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write(html);
  res.end();
  return { props: {} };
}

// nunca se renderiza (getServerSideProps ya cerró la respuesta), pero
// next.js requiere un componente default en cada página.
export default function Home() {
  return null;
}
