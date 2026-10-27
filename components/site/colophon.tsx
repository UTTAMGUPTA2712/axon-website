import Link from "next/link";
import { PAGES, AUTHOR_URL, SOURCE_URL, STORE_URL } from "@/lib/site";

export function Colophon() {
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
          , a backend and distributed systems engineer.
        </p>
        <nav>
          {PAGES.filter((page) => page.path !== "/").map((page) => (
            <Link key={page.path} href={page.path}>
              {page.label}
            </Link>
          ))}
          <a href={STORE_URL} target="_blank" rel="noopener">
            Chrome Web Store
          </a>
          <a href={SOURCE_URL} target="_blank" rel="noopener">
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
