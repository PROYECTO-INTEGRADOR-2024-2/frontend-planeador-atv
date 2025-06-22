"use client";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import HeroN from "@/components/HeroN";
import { Providers } from "./Providers";

export default function Home() {
  return (
    <div>
      <main></main>
      <Navbar />
      <HeroN />
      <Footer></Footer>
    </div>
  );
}
