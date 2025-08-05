import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Vision Hub - Where Vision Becomes Reality",
  description: "A personal and evolving digital platform that brings together creative, scientific, and visionary work across multiple domains.",
  keywords: ["AI", "Medicine", "Design", "Ethics", "Future", "Projects", "Blog"],
  authors: [{ name: "Vision Hub" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} vision-bg min-h-screen`}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
} 