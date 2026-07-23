import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "涌城 TIDELINE｜滨水街区数字孪生",
  description: "极端天气下的滨水街区数字孪生推演系统。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
