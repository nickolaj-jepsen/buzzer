import type { Metadata } from "next";
import "./globals.css";
import { Notifications } from "@/component/notifications";
import { ConfirmRoot } from "@/component/confirm";
import { Schibsted_Grotesk } from "next/font/google";
import clsx from "clsx";

const schibstedGrotesk = Schibsted_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buzzer",
  description: "A real-time quiz buzzer application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={clsx(
          "antialiased min-h-screen flex flex-col",
          schibstedGrotesk.className,
        )}
      >
        <Notifications />
        <ConfirmRoot />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="w-full py-4 flex justify-center items-center bg-base-100 text-sm text-gray-500">
          <a
            href="https://github.com/nickolaj-jepsen/buzzer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
