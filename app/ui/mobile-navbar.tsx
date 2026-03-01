import Link from "next/link";
import { Menu } from "lucide-react";
import { mobileNavItems } from "@/app/ui/nav-items";

export default function MobileNavbar() {
  return (
    <div aria-hidden='true' className='sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
      <ul className='flex items-center gap-5 rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg shadow-lg px-5 py-2'>
        {mobileNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              tabIndex={-1}
              className='flex flex-col items-center gap-1 transition-transform duration-150 active:scale-110 active:-translate-y-1'
            >
              <item.icon size={20} />
              <span className='text-[10px]'>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
