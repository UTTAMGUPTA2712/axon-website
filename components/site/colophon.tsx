import Link from "next/link";
import { AUTHOR_URL, SOURCE_URL, STORE_URL } from "@/lib/site";

export function Colophon({ about }: { about: "landing" | "privacy" }) {
  return (
    <footer className="colophon">
      <div className="colophon-inner">
        <p className="byline">
          Axon is built by{" "}
          <b>
            <a href={AUTHOR_URL} target="_blank" rel="noopener">
              Uttam Gupta
            </a>
          </b>
          {about === "landing"
            ? ", a backend and distributed systems engineer."
            : ". Questions about this policy are welcome there."}
        </p>
        <nav>
          {about === "privacy" && <Link href="/">Axon</Link>}
          <a href={STORE_URL} target="_blank" rel="noopener">
            Chrome Web Store
          </a>
          {about === "landing" && (
            <>
              <a href={SOURCE_URL} target="_blank" rel="noopener">
                Source
              </a>
              <Link href="/privacy">Privacy</Link>
            </>
          )}
          <a href={AUTHOR_URL} target="_blank" rel="noopener">
            uttamgupta2712.is-a.dev
          </a>
        </nav>
      </div>
    </footer>
  );
}
