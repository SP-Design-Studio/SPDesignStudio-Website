"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Preloader from "@/components/shared/Preloader";
import Nav from "@/components/shared/Nav";
import PinnedScroll from "@/components/home/PinnedScroll";
import Footer from "@/components/shared/Footer";
import FontDebug from "@/components/shared/FontDebug";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setHydrated(true);
    if (sessionStorage.getItem("preloaderShown") === "1") {
      setPreloaderDone(true);
    } else {
      setShowPreloader(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (preloaderDone) sessionStorage.setItem("preloaderShown", "1");
  }, [preloaderDone]);

  return (
    <>
      <FontDebug />
      {hydrated && showPreloader && !preloaderDone && (
        <Preloader onCompleteAction={() => setPreloaderDone(true)} />
      )}
      <SmoothScrollProvider>
        <Nav visible={navVisible} />
        <main suppressHydrationWarning style={{ opacity: hydrated && preloaderDone ? 1 : 0, transition: "opacity 0.35s ease" }}>
          <PinnedScroll started={preloaderDone} onNavVisibleAction={setNavVisible} />
          <Footer />
        </main>
      </SmoothScrollProvider>
    </>
  );
}
