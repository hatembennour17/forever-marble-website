import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masjid Aisha | Elkton, Maryland",
  description: "Prayer times, iqamah updates, events, and community news from Masjid Aisha in Elkton, Maryland.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
