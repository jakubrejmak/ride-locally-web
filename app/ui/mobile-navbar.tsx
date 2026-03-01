import Link from "next/link";
import { navItems } from "@/app/ui/nav-items";

export default function MobileNavbar() {
  return (
    <nav className='sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
      <ul className='flex items-center gap-5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg shadow-lg px-5 py-2'>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className='flex flex-col items-center gap-1'
            >
              <item.icon size={20} />
              <span className='text-[10px]'>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
