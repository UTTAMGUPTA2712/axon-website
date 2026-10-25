"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { STORE_URL } from "@/lib/site";

/** `section` links drop out on narrow screens; the rest always show. */
type NavItem = { href: string; label: string; section?: boolean };

/**
 * Reachable without being in the way: present at the top of the page, tucked away only
 * while the reader is moving down the document, and back the moment they move up, point
 * at the top edge, or tab into it. Without JS it is simply always visible, because the
 * tucking is driven entirely by a class this adds.
 */
export function Masthead({ items }: { items: NavItem[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const masthead = ref.current;
    if (!masthead) return;
    const site = masthead.closest<HTMLElement>(".site");

    // Publish the real height so the docked panel and anchor targets clear it.
    const measure = () =>
      site?.style.setProperty("--masthead-h", `${masthead.offsetHeight}px`);
    measure();
    window.addEventListener("resize", measure, { passive: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [() => window.removeEventListener("resize", measure)];

    if (!reduced) {
      // Below SETTLE the masthead always shows: at the top of a document there is
      // nothing to get out of the way of. JITTER ignores trackpad noise; REVEAL_BAND is
      // how close the pointer has to come to the top edge to call it back.
      const SETTLE = 140;
      const JITTER = 6;
      const REVEAL_BAND = 80;
      let lastY = window.scrollY;
      let queued = false;

      const tuck = (on: boolean) => masthead.classList.toggle("is-tucked", on);

      const update = () => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) < JITTER) return;
        lastY = y;
        tuck(y > SETTLE && delta > 0);
      };
      const onScroll = () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(() => {
          queued = false;
          update();
        });
      };
      const onMove = (event: MouseEvent) => {
        if (event.clientY <= REVEAL_BAND) tuck(false);
      };
      const onFocus = () => tuck(false);

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("mousemove", onMove, { passive: true });
      masthead.addEventListener("focusin", onFocus);
      cleanups.push(
        () => window.removeEventListener("scroll", onScroll),
        () => window.removeEventListener("mousemove", onMove),
        () => masthead.removeEventListener("focusin", onFocus),
      );
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <header className="masthead" ref={ref}>
      <Link className="masthead-brand" href="/">
        <span className="masthead-mark" aria-hidden="true">
          A
        </span>
        Axon
      </Link>
      <nav className="masthead-nav">
        {items.map((item) => (
          <Link
            key={item.href}
            className={item.section ? "nav-section" : undefined}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/account">Account</Link>
        <a className="is-install" href={STORE_URL} target="_blank" rel="noopener">
          Add to Chrome
        </a>
      </nav>
    </header>
  );
}
