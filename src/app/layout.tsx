//Generated by WriteToLayout_tsx - GenerateMainLayoutSidebar
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import "./globals.css";
import { Roboto_Flex } from "next/font/google";
import ClientProviders from "@/components/ClientProviders";
import SessionButton from "@/components/header/SessionButton";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/sidebar/Sidebar";
import DarkLightToggle from "@/components/header/DarkLightToggle";
import { GlobalDialog } from "@/components/GlobalDialog";

const inter = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: "To Do App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} dark`}
    >
      <body className="flex w-full min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <ClientProviders>
            <Sidebar />
            <main className="flex flex-col flex-1 gap-4 pt-4 pl-0 pr-4">
              <div className="flex self-end gap-4">
                {/* <SessionButton /> */}
                <DarkLightToggle />
              </div>
              {children}
              <GlobalDialog />
              <Footer />
            </main>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
