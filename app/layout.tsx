import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minh Đức — Nhân lực và cơ hội việc làm",
  description: "Giải pháp nhân lực và cổng thông tin tuyển dụng Minh Đức.",
  icons: {
    icon: "/assets/logo-icon.png",
    shortcut: "/assets/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
