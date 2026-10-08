"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER, useStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/youth", label: "Caseload" },
  { href: "/intake", label: "New intake" },
  { href: "/reports", label: "Ask a report" },
  { href: "/security", label: "Security & compliance" },
];

export function Nav() {
  const path = usePathname();
  const { reset } = useStore();
  return (
    <nav className="bg-brand text-white md:w-60 md:min-h-screen shrink-0 flex md:flex-col">
      <div className="px-5 py-4 md:py-6">
        <div className="font-semibold tracking-tight text-lg">Intercept</div>
        <div className="text-xs text-white/70 hidden md:block">Erie County DOH · Juvenile Substance Use Services Coordination</div>
      </div>
      <ul className="flex md:flex-col overflow-x-auto px-2 gap-1 items-center md:items-stretch">
        {LINKS.map((l) => {
          const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm ${active ? "bg-white/15 font-medium" : "text-white/80 hover:bg-white/10"}`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="hidden md:block mt-auto px-5 py-5 text-xs text-white/70 space-y-2">
        <div>
          Signed in as <span className="text-white">{CURRENT_USER.name}</span>
          <br />
          {CURRENT_USER.role} · via County SSO (simulated)
        </div>
        <button onClick={() => confirm("Reset all demo data to the original synthetic seed?") && reset()} className="underline hover:text-white">
          Reset demo data
        </button>
      </div>
    </nav>
  );
}
