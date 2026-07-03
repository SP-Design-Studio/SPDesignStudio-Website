"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { CloseButton } from "@/components/shared/CloseButton";
import { CAREERS } from "@/lib/studio";

type Status = "idle" | "sending" | "sent" | "error";

export function CareersDrawer() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{
    portfolio?: { name: string; content: string };
    resume?: { name: string; content: string };
  }>({});
  const [fileError, setFileError] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [roleLocked, setRoleLocked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const panelRef = useRef<HTMLDivElement>(null);

  // Vercel caps the request body at ~4.5 MB and base64 inflates files ~33%,
  // so the combined encoded payload must stay under that ceiling.
  const MAX_FILE = 4 * 1024 * 1024;
  const MAX_TOTAL_B64 = 4_300_000;

  const readPdf = (kind: "portfolio" | "resume", file?: File) => {
    if (!file) {
      setFiles((s) => ({ ...s, [kind]: undefined }));
      return;
    }
    if (file.type !== "application/pdf") {
      setFileError("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_FILE) {
      setFileError(
        "Each file must be under 4 MB. Compress it, or paste a portfolio link below.",
      );
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const content = result.includes(",")
        ? (result.split(",").pop() ?? "")
        : result;
      setFiles((s) => ({ ...s, [kind]: { name: file.name, content } }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const role = (e as CustomEvent).detail?.role as string | undefined;
      setValues(role ? { role } : {});
      setFiles({});
      setPortfolioLink("");
      setFileError("");
      setRoleLocked(!!role);
      setStatus("idle");
      setOpen(true);
    };
    window.addEventListener("open-application", onOpen);
    return () => window.removeEventListener("open-application", onOpen);
  }, []);

  const close = () => {
    document.body.style.overflow = "";
    if (!panelRef.current) {
      setOpen(false);
      return;
    }
    gsap.to(panelRef.current, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: 0.55,
      ease: "expo.inOut",
      onComplete: () => setOpen(false),
    });
  };

  useEffect(() => {
    if (!open || !panelRef.current) return;
    document.body.style.overflow = "hidden";
    gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.to(panelRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.7,
      ease: "expo.inOut",
    });
    gsap.fromTo(
      ".ca-reveal",
      { y: 26, autoAlpha: 0, filter: "blur(5px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.32,
      },
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.resume) {
      setFileError("Please attach your resume (PDF).");
      return;
    }
    if (!files.portfolio && !portfolioLink.trim()) {
      setFileError("Attach your portfolio (PDF) or paste a portfolio link.");
      return;
    }

    const totalB64 =
      (files.portfolio?.content.length ?? 0) +
      (files.resume?.content.length ?? 0);
    if (totalB64 > MAX_TOTAL_B64) {
      setFileError(
        "Your attachments exceed the ~4 MB upload limit. Compress the PDF, or paste a portfolio link and skip the large file.",
      );
      return;
    }

    setFileError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "career",
          ...values,
          portfolioFile: files.portfolio,
          resumeFile: files.resume,
          portfolioLink: portfolioLink.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (body?.error) setFileError(body.error);
        throw new Error("failed");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;
  const cfg = CAREERS.apply;

  const inputCls =
    "w-full bg-transparent border-b border-cream/20 py-3 text-cream text-xl outline-none transition-colors placeholder:text-cream/25 focus:border-gold";

  const fieldMap = Object.fromEntries(cfg.fields.map((f) => [f.name, f]));
  const renderField = (name: string) => {
    const f = fieldMap[name];
    if (!f) return null;
    const locked = f.name === "role" && roleLocked;
    return (
      <label className="ca-reveal flex flex-col gap-2.5">
        <span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
          {f.label}
        </span>
        {f.type === "textarea" ? (
          <textarea
            required={f.required}
            rows={3}
            placeholder={f.placeholder}
            value={values[f.name] ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, [f.name]: e.target.value }))
            }
            className={`${inputCls} resize-none`}
          />
        ) : (
          <input
            type={f.type}
            required={f.required}
            readOnly={locked}
            placeholder={f.placeholder}
            value={values[f.name] ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, [f.name]: e.target.value }))
            }
            className={
              locked ? `${inputCls} cursor-not-allowed text-cream/70` : inputCls
            }
          />
        )}
      </label>
    );
  };

  const fileFieldCls =
    "cursor-pointer text-cream/80 text-sm file:mr-4 file:cursor-pointer file:rounded-sm file:border file:border-gold/40 file:bg-transparent file:px-4 file:py-2 file:font-sans file:uppercase file:tracking-[0.2em] file:text-gold file:text-[0.6rem] hover:file:border-gold";

  return createPortal(
    <div
      ref={panelRef}
      className="fixed inset-0 z-200 overflow-y-auto bg-plum-dark text-cream"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
    >
      <CloseButton
        onClick={close}
        className="ca-reveal fixed right-6 top-6 z-10 md:right-10 md:top-9"
      />

      <div className="mx-auto min-h-full max-w-4xl px-6 py-16 sm:px-10 sm:py-20 md:px-14">
        <header className="ca-reveal mb-8 md:mb-10 md:flex md:items-end md:justify-between md:gap-12">
          <div>
            <div className="font-sans font-normal uppercase tracking-[0.42em] text-gold text-[0.672rem] md:text-sm mb-3 md:mb-4">
              {cfg.eyebrow}
            </div>
            <h2 className="font-bdscript text-cream leading-[0.95] text-4xl sm:text-5xl md:text-6xl">
              {cfg.headline}
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-serif italic font-light text-cream/90 text-base md:text-lg leading-[1.6] md:max-w-xs">
            {cfg.intro}
          </p>
        </header>
        <span className="ca-reveal block h-px w-full bg-gold/20 mb-8 md:mb-10" />

        {status === "sent" ? (
          <div className="ca-reveal">
            <div className="font-bdscript text-gold text-5xl md:text-6xl mb-4">
              {cfg.successTitle}
            </div>
            <p className="font-serif italic font-light text-cream/90 text-xl max-w-md">
              {cfg.successBody}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-6 sm:gap-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7">
              {renderField("name")}
              {renderField("email")}
              {renderField("role")}
              {renderField("phone")}
              <label className="ca-reveal flex flex-col gap-2.5">
                <span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
                  Portfolio (PDF · under 4 MB — or use link below)
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => readPdf("portfolio", e.target.files?.[0])}
                  className={fileFieldCls}
                />
                {files.portfolio && (
                  <span className="font-sans text-cream/70 text-sm">
                    {files.portfolio.name}
                  </span>
                )}
              </label>
              <label className="ca-reveal flex flex-col gap-2.5">
                <span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
                  Resume (PDF · under 4 MB, required)
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => readPdf("resume", e.target.files?.[0])}
                  className={fileFieldCls}
                />
                {files.resume && (
                  <span className="font-sans text-cream/70 text-sm">
                    {files.resume.name}
                  </span>
                )}
              </label>
            </div>

            <label className="ca-reveal flex flex-col gap-2.5">
              <span className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.65rem]">
                Portfolio link (optional)
              </span>
              <input
                type="url"
                placeholder="Google Drive, Behance, WeTransfer…"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className={inputCls}
              />
              <span className="font-sans text-cream/60 text-sm">
                Portfolio over 4 MB? Compress the PDF or share a link here
                instead.
              </span>
            </label>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
              {renderField("message")}
              {renderField("sop")}
            </div>

            {fileError && (
              <p className="ca-reveal font-sans text-base text-gold">
                {fileError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="ca-reveal cta-gold group mt-1 inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-9 py-4 font-sans font-normal uppercase tracking-[0.28em] text-plum-dark text-sm disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit Application"}
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
            {status === "error" && (
              <p className="ca-reveal font-sans text-base text-gold">
                Something went wrong. Please try again or email us directly.
              </p>
            )}
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
