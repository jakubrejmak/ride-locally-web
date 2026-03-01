import Link from "next/link";
import { footerItems } from "@/app/ui/nav-items";

export default function Footer() {
  return (
    <footer className="pb-20 sm:pb-0 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
          {footerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
          All schedule data is provided for informational purposes only. We make
          no guarantees regarding accuracy or completeness. Use at your own
          discretion.
        </p>

        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} jade24.pl. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
