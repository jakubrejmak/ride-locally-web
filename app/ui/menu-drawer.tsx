"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactNode } from "react";
import { menuLinks } from "@/app/ui/nav-items";
import Link from "next/link";
import { ThemeSwitcher } from "@/app/ui/theme-switcher";

export default function MenuDrawer({ children }: { children: ReactNode }) {
  return (
    <Drawer onOpenChange={(open) => { if (open) (document.activeElement as HTMLElement)?.blur(); }}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerTitle className='text-center pt-2'>Menu</DrawerTitle>
          <DrawerDescription className='sr-only'>Menu nawigacji</DrawerDescription>
          <ul
            className='p-4 flex flex-col items-center gap-3'
            role='list'
          >
            {menuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className='text-base font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className='w-full'>
              <ThemeSwitcher
                label='Motyw'
                themeLabels={["Jasny", "Ciemny", "System"]}
              />
            </li>
          </ul>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant='outline'>Zamknij</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
