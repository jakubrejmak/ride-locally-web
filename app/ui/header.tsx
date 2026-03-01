import Link from "next/link";
import { Honk } from "next/font/google";
import { navLinks } from "@/app/ui/nav-items";
import { MenuPopover } from "@/app/ui/menu-popover";

const honk = Honk({ subsets: ["latin"] });

export default function Header() {
  return (
    <header className='border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'>
      <div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-4'>
        <Link
          href='/'
          className={`text-4xl tracking-tight text-zinc-900 dark:text-zinc-50 ${honk.className}`}
        >
          jade24.pl
        </Link>

        <nav
          className='hidden sm:block'
          aria-label='Main navigation'
        >
          <ul
            className='flex items-center gap-6'
            role='list'
          >
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className='text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <MenuPopover />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
