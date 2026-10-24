import Link from "next/link";
import { machines, nav, site } from "@/data/site";
import SignupForm from "./SignupForm";

export default function Footer() {
  return (
    <footer className="footer wrap">
      <div className="inner footer-grid">
        <div className="footer-brand">
          <Link href="/" className="wordmark wordmark-lg">
            HeavyTech
          </Link>
          <p className="lede">Hybrid and electric off-highway machines. Designed and built in {site.location}.</p>
          <SignupForm />
        </div>
        <div className="footer-col">
          <span className="label">Machines</span>
          <ul>
            {machines.map((m) => (
              <li key={m.slug}>
                <Link href={`/machines/${m.slug}/`}>
                  {m.code} / {m.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <span className="label">Company</span>
          <ul>
            {nav
              .filter((n) => n.id !== "top" && n.id !== "machines")
              .map((n) => (
                <li key={n.id}>
                  <Link href={`/#${n.id}`}>{n.label}</Link>
                </li>
              ))}
            <li>
              <Link href="/#news">News</Link>
            </li>
            <li>
              <Link href="/reserve/">Reserve</Link>
            </li>
            <li>
              <a href={site.investorPortal} target="_blank" rel="noopener">
                Investor portal ↗
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <span className="label">Contact</span>
          <ul>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.location}</li>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="inner footer-base">
        <span className="label">© {new Date().getFullYear()} HeavyTech, Inc.</span>
        <span className="label">Made in Fort Wayne, Indiana</span>
      </div>
    </footer>
  );
}
