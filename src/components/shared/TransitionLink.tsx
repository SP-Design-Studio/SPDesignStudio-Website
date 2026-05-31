"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

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

  const skip = isHash || isMailto || isTel || isSamePage || isExternal;

  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (skip || e.defaultPrevented) return;
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
