"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import ContactPinnedScroll from "@/components/contact/ContactPinnedScroll";
import { ContactDrawer } from "@/components/contact/ContactDrawer";
import Footer from "@/components/shared/Footer";

export default function ContactPage() {
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
        <ContactPinnedScroll started={started} />
        <Footer />
      </main>
      <ContactDrawer />
    </SmoothScrollProvider>
  );
}
