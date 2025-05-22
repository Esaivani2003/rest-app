import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sonner Toaster (Global Notification Provider) */}
      <Toaster position="top-right" richColors />

      {/* Navbar Always on Top */}
      {/* Add your Navbar here if needed */}

      {/* Main Content */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>

      {/* Footer Always at Bottom */}
      {/* Add your Footer here if needed */}
    </div>
  );
}
