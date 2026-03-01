"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { menuLinks } from "@/app/ui/nav-items";
import { ThemeSwitcher } from "@/app/ui/theme-switcher";
import Link from "next/link";

export function MenuPopover() {
  return (
    <Popover>
      <PopoverTrigger className='cursor-pointer text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'>
        Menu
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-48'
      >
        <div className='flex flex-col gap-1'>
          {menuLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='rounded-md px-2 py-1.5 text-center text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
            >
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher
            label='Motyw'
            themeLabels={["Jasny", "Ciemny", "System"]}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
