import { redirect } from "next/navigation";

/**
 * There is no marketing here — that is axon-website. This app is the account, so
 * the root is just the way in: the proxy has already sent anyone without a
 * session to /login by the time this runs.
 */
export default function Home() {
  redirect("/account");
}
