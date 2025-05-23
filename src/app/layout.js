import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "./Providers";

const myFont = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--my-font-family",
});

export const metadata = {
  title: "Agendador ATV",
  description: "Powered by UdeA",
  icons: {
    icon: "/favicon.ico", // o "/icon.png"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <Providers>
          {children}
          <ToastContainer position="bottom-left" autoClose={5000} />
        </Providers>
      </body>
    </html>
  );
}
