import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import ClientWrapper from "@/components/common/ClientWrapper";
const nunito = Nunito_Sans({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
