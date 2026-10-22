import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/*
  The same two families as the console. Archivo carries the interface; Plex Mono
  carries anything the reader compares character by character — ids, model names,
  quota figures. Monospace is used where it means something, not as decoration.
*/
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Axon account",
  description: "Your Axon account, plan and connected extension",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-[15px] leading-normal">
        {children}
      </body>
    </html>
  );
}
