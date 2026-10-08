import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Intercept: Juvenile Services Case Management",
  description: "Demo response to Erie County RFP #2026-052VF. Synthetic data only.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased font-[system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]">
        <StoreProvider>
          <div className="min-h-screen md:flex">
            <Nav />
            <main className="flex-1 min-w-0">
              <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 md:px-8 py-1.5">
                Demo for Erie County RFP #2026-052VF. <strong>All people, providers and records are synthetic.</strong> Data stays in this browser.
              </div>
              <div className="px-4 md:px-8 py-6 max-w-6xl">{children}</div>
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
