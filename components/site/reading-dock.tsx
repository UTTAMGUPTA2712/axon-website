"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE_URL } from "@/lib/site";

const chip = (text: string) => <span className="chip">{text}</span>;
const meta = (text: string) => <div className="meta">{text}</div>;

/**
 * One exchange per chapter. The answers describe the chapter beside them, so the panel
 * is always demonstrably reading the page rather than replaying a script.
 */
const TRANSCRIPT: Record<string, { q: string; a: ReactNode }> = {
  intro: {
    q: "What is this page about?",
    a: (
      <>
        <p>
          It introduces <b>Axon</b>, a Chrome extension that reads the page you have
          open and answers questions about it.
        </p>
        <p>
          The page says it can summarize long pages, describe what is on screen, and
          fill forms from details you have saved.
        </p>
        {meta("read 412 words · chat · llama-3.3-70b")}
      </>
    ),
  },
  does: {
    q: "What are the three things it does?",
    a: (
      <>
        <p>Reading the current page, filling forms, and remembering details you tell it.</p>
        <p>
          On forms it matches by meaning rather than by field name, so a field labelled{" "}
          {chip("Mobile number")} is filled from a fact saved as {chip("Phone")}.
        </p>
        {meta("read this section · chat · llama-3.3-70b")}
      </>
    ),
  },
  keys: {
    q: "Where does my API key actually go?",
    a: (
      <>
        <p>
          Into {chip("chrome.storage.sync")} in your own browser, and from there only to
          the provider you configured.
        </p>
        <p>
          This section says that signed out there is no Axon server in the request path,
          that signing in changes that, and that there are no analytics or third-party
          scripts.
        </p>
        {meta("read this section · chat · llama-3.3-70b")}
      </>
    ),
  },
  setup: {
    q: "How long does setup take?",
    a: (
      <>
        <p>About a minute: install, paste a key, optionally pick models.</p>
        <p>
          Gemini is suggested first because it has a free tier. If you would rather
          nothing left your machine, the custom provider points at Ollama or LM Studio.
        </p>
        {meta("read this section · chat · llama-3.3-70b")}
      </>
    ),
  },
  plans: {
    q: "Do I have to pay for anything?",
    a: (
      <>
        <p>
          No. The page says a key of your own costs nothing and is the default; an
          account is the optional alternative, and it sends your prompts through Axon&apos;s server.
        </p>
        <p>
          The plans beside this answer are read from the Axon API when it is reachable,
          so what you see is what the service actually offers today.
        </p>
        {meta("read this section · chat · llama-3.3-70b")}
      </>
    ),
  },
  questions: {
    q: "Does it track my browsing?",
    a: (
      <>
        <p>
          No. By this page&apos;s account Axon reads a page only when you invoke it, and
          asks for no browsing-history permission.
        </p>
        <p>
          Chrome grants it access to a page for that visit only, and takes the access
          back when you navigate.
        </p>
        {meta("read 4 answers · chat · llama-3.3-70b")}
      </>
    ),
  },
};

/**
 * The page is the demo: the docked panel answers a question about whichever chapter the
 * reader is currently in, and the sentence it drew that answer from is marked in the
 * document. That link between the two columns is the only piece of motion on the page,
 * because it is the only one that carries information.
 *
 * Everything here is an enhancement. The document is fully readable, and the panel shows
 * its first exchange, before this runs or if it never does.
 */
export function ReadingDock() {
  const [key, setKey] = useState("intro");
  const [swapping, setSwapping] = useState(false);
  const shown = useRef("intro");

  useEffect(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(".chapter[data-turn]"),
    );
    if (!chapters.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = "intro";
    let timer: number | undefined;

    const show = (next: string) => {
      if (next === current) return;
      current = next;
      chapters.forEach((c) => c.classList.toggle("is-current", c.dataset.turn === next));
      if (reduced) {
        shown.current = next;
        setKey(next);
        return;
      }
      // Crossfade, so the two columns visibly belong to one another.
      setSwapping(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        shown.current = next;
        setKey(next);
        setSwapping(false);
      }, 180);
    };

    // Which chapter is the reader on? The last one whose start has crossed a reading
    // line a little above the middle of the viewport. This reads live geometry on each
    // frame rather than an IntersectionObserver entry, whose rect is a stale snapshot:
    // the very tall opening chapter would otherwise win every comparison.
    const pick = () => {
      const line = window.innerHeight * 0.38;
      let active = chapters[0];
      for (const chapter of chapters) {
        if (chapter.getBoundingClientRect().top <= line) active = chapter;
      }
      show(active.dataset.turn ?? "intro");
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        pick();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    pick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  const entry = TRANSCRIPT[key];
  const host = new URL(SITE_URL).host;

  return (
    <aside className="dock" aria-label="Axon, reading this page">
      <div className="panel-frame">
        <div className="panel-head">
          <span className="panel-title">
            <span className="panel-mark" aria-hidden="true">
              A
            </span>
            Axon <span className="panel-ver">v3.0</span>
          </span>
          <span className="panel-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="panel-tab">
          <span />
          <span>{host}</span>
        </div>
        <div className="panel-body">
          <div className={`turn${swapping ? " is-swapping" : ""}`} id="turn">
            <div className="turn-user">{entry.q}</div>
            <div className="turn-bot">{entry.a}</div>
          </div>
        </div>
        <div className="panel-actions" aria-hidden="true">
          <button type="button" tabIndex={-1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span>Screenshot</span>
          </button>
          <button type="button" tabIndex={-1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 6H3" />
              <path d="M21 12H3" />
              <path d="M15 18H3" />
            </svg>
            <span>Summarize</span>
          </button>
          <button type="button" tabIndex={-1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="8" height="4" x="8" y="2" rx="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 11h4" />
              <path d="M12 16h4" />
              <path d="M8 11h.01" />
              <path d="M8 16h.01" />
            </svg>
            <span>Fill form</span>
          </button>
        </div>
        <div className="panel-compose" aria-hidden="true">
          <span>Ask about this page…</span>
          <b>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </b>
        </div>
      </div>
      <p className="panel-caption">
        This is the extension&apos;s own interface, reading the section you are on.
      </p>
    </aside>
  );
}
