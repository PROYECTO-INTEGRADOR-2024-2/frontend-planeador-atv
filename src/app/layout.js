import "./globals.css";
import { Roboto } from "next/font/google";

const myFont = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--my-font-family",
});

export const metadata = {
  title: "Agendador ATV",
  description: "Powered by UdeA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
