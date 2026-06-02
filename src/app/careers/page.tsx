"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import CareersPinnedScroll from "@/components/careers/CareersPinnedScroll";
import { CareersDrawer } from "@/components/careers/CareersDrawer";
import Footer from "@/components/shared/Footer";

export default function CareersPage() {
  const [started, setStarted] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      setNavVisible(true);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <SmoothScrollProvider>
      <Nav visible={navVisible} />
      <main>
        <CareersPinnedScroll started={started} />
        <Footer />
      </main>
      <CareersDrawer />
    </SmoothScrollProvider>
  );
}
