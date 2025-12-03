import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Seatly | Event Booking Platform",
  description: "Create events, draw seat maps, and book tickets in real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-gray-100`}>
        <Providers>
          <Navbar />
          
          {/* Background pattern */}
          <div className="fixed inset-0 bg-grid-white/[0.02] bg-grid-16 -z-10" />
          
          <main className="relative min-h-[calc(100vh-4rem)]">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Animated background elements */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
              
              {/* Main content wrapper */}
              <div className="relative">
                {children}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Seatly
                  </div>
                  <span className="text-xs text-gray-400">Event Ticketing</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">
                    Contact
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">
                    Support
                  </a>
                </div>
                
                <div className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Seatly. All rights reserved.
                </div>
              </div>
              
              {/* Copyright note */}
              <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
                <p>Create amazing events with our powerful booking platform.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}