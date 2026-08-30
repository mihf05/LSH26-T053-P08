import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Radio_Canada_Big,
  Source_Serif_4,
} from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from "@/lib/themes";
import "./globals.css";

// The result processing screens use Geist; the landing page uses the three
// families the Figma design specifies.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400"],
});
const radioCanadaBig = Radio_Canada_Big({
  variable: "--font-radio-canada-big",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "School Result Processing and GPA Engine",
  description:
    "Grade points, GPAs, per student calculation traces and the office checking lists for two classes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The next/font variables go on <html> so they resolve at :root, where
  // Tailwind's @theme declares the families that reference them.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${radioCanadaBig.variable}`}
    >
      <head>
        {/* Applies the remembered theme before the first paint, so switching
            themes does not flash the default one on every navigation. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t)document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-base-200/50 bg-grid-pattern antialiased text-base-content`}
      >
        <Navbar />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
