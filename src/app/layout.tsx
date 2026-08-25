import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "AI Pipeline Studio — Interactive Node Canvas",
  description: "High-performance interactive node-based canvas & workflow builder built with Next.js, React Flow, Framer Motion, and Zustand.",
};

const themeScript = `
  (function() {
    try {
      var storedTheme = localStorage.getItem('theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = storedTheme || (systemDark ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-[#090A0E] dark:bg-[#090A0E] light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-800 selection:bg-indigo-500/30 selection:text-indigo-200"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
