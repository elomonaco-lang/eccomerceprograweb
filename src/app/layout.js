import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Origen | Capsulas de cafe",
  description:
    "Origen es una tienda online de capsulas de cafe compatibles. Cafe de origen, en cada capsula. Proyecto academico desarrollado con Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
