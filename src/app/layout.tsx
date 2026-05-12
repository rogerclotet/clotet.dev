import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Roger Clotet",
  description:
    "I'm a dad and a software engineer based in Girona. I build stuff for the web and distributed systems. I love learning, photography, videogames, and driving",
  icons: [{ rel: "icon", url: "/favicon.png" }],
  alternates: {
    canonical: "https://clotet.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="sr">
      <CSPostHogProvider>
        <body>
          <TooltipProvider>
            <main>{children}</main>
          </TooltipProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
