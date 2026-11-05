import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ریتم | RITM — سامانه تخصصی محاسبات عملکرد دویدن و VDOT",
  description:
    "محاسبه‌گر علمی VDOT جک دانیلز، تعیین سرعت‌های تمرینی، پیش‌بینی رکوردهای ۵K تا ماراتن و ثبت مسیر پیشرفت دونده به زبان فارسی و انگلیسی.",
  keywords: [
    "محاسبه VDOT",
    "محاسبه سرعت دویدن",
    "محاسبه پیس دویدن",
    "تمرین اینتروال",
    "سرعت مناسب دویدن",
    "برنامه تمرینی دویدن",
    "محاسبه زمان ۵ کیلومتر",
    "محاسبه زمان ۱۰ کیلومتر",
    "آستانه لاکتات در دویدن",
    "Jack Daniels VDOT Calculator",
    "Running pace calculator",
  ],
  authors: [{ name: "RITM Sports Science" }],
  openGraph: {
    title: "ریتم | RITM — سامانه تخصصی محاسبات عملکرد دویدن",
    description: "هوشمندتر بدو، بهتر پیشرفت کن. محاسبه‌گر پیشرفته VDOT و سرعت‌های تمرینی دویدن.",
    siteName: "RITM Running Performance",
    locale: "fa_IR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0F14] text-[#F8FAFC]">
        {children}
      </body>
    </html>
  );
}
