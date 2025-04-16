import { Inter } from "next/font/google";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LanguageSelector } from "./components/LanguageSelector";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VICE - Feature Prioritization",
  description: "Prioritize your features with VICE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          {children}
          <LanguageSelector />
        </LanguageProvider>
      </body>
    </html>
  );
}
