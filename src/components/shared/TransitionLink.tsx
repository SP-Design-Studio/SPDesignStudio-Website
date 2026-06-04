"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { getLenis } from "@/lib/smoothScroll";

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: React.ReactNode;
};

const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, children, onClick, ...rest },
  ref
) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : "";

  const isHash    = target.startsWith("#");
  const isMailto  = target.startsWith("mailto:");
  const isTel     = target.startsWith("tel:");
  const isSamePage = target === pathname;
  const isExternal = /^https?:\/\//.test(target);

  const skip = isHash || isMailto || isTel || isExternal;

  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        if (isSamePage) {
          e.preventDefault();
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0, { duration: 1.2 });
          else window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (skip) return;
        e.preventDefault();
        document.dispatchEvent(
          new CustomEvent("page-transition-cover", { detail: { href: target } })
        );
      }}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default TransitionLink;
