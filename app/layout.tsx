import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI NOW — 当下 AI 能力现场地图",
  description:
    "面向非技术成年人的可点击 AI 能力地图：真实案例、现场入口、复制即用提示词与离线兜底。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
