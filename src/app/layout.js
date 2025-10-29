import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />

            <main className="pt-20 min-h-screen">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
