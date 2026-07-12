import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const fontVariables = `${playfair.variable} ${cormorant.variable} ${inter.variable}`;
