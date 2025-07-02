import type { Metadata } from "next";
import "./globals.css";
import { Notifications } from "@/component/notifications";
import { ConfirmRoot } from "@/component/confirm";

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
      <body className={"antialiased"}>
        <Notifications />
        <ConfirmRoot />
        {children}
      </body>
    </html>
  );
}
