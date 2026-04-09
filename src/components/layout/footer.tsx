import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Find Services", href: "/search" },
    { label: "For Professionals", href: "/professional" },
    { label: "Pricing", href: "/pricing" },
    { label: "How it Works", href: "/how-it-works" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: "X" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Facebook", href: "https://facebook.com", icon: "fb" },
];

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--surface]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[--primary] flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[--text-primary] font-[family-name:var(--font-heading)]">
                Vitalia
              </span>
            </Link>
            <p className="mt-4 text-sm text-[--text-secondary]">
              Your health without borders. Connect with medical professionals worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text-primary]">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--text-secondary] hover:text-[--primary]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text-primary]">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--text-secondary] hover:text-[--primary]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[--text-primary]">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--text-secondary] hover:text-[--primary]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[--border] pt-8 sm:flex-row">
          <p className="text-sm text-[--text-muted]">
            © {new Date().getFullYear()} Vitalia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--text-muted] hover:text-[--primary]"
              >
                <span className="sr-only">{social.label}</span>
                <div className="h-8 w-8 rounded-full border border-[--border] flex items-center justify-center text-xs font-medium">
                  {social.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
