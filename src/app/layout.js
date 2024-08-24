import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen justify-between">
          <Sidebar />
          <div className="w-full">
            <div className="box-border dark:bg-neutral-950">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
