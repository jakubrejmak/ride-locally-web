import {
  Home,
  Calendar,
  BookOpen,
  Info,
  UserRoundKey,
} from "lucide-react";

export const navLinks = [
  { label: "Strona główna", href: "/", icon: Home },
  { label: "Rozkłady", href: "/schedules", icon: Calendar },
  { label: "Blog", href: "/posts", icon: BookOpen },
  { label: "O nas", href: "/about", icon: Info },
];

export const mobileNavLinks = [
  { label: "Start", href: "/", icon: Home },
  { label: "Rozkłady", href: "/schedules", icon: Calendar },
  { label: "Blog", href: "/posts", icon: BookOpen },
];

export const menuLinks = [
  { label: "Zaloguj się", href: "/login", icon: UserRoundKey },
];

export const footerLinks = [
  { label: "Polityka prywatności", href: "/privacy" },
  { label: "Regulamin", href: "/terms" },
  { label: "Kontakt", href: "/contact" },
];