import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

export const metadata = {
  title: "Breadit",
  description:
    "A modern FullStack Reddit clone built with Nextjs, App Router, TypeScript, and TailwindCSS.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QF0QX0HEQH"></Script>
        <Script id="google_analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QF0QX0HEQH');
      `}
        </Script>
      </head>
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <NavBar />
        <div className="container max-w-7xl mx-auto h-full pt-12">
          {children}
        </div>

        <Toaster />
      </body>
    </html>
  );
}
