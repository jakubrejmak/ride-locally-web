import {
  Home,
  Calendar,
  BookOpen,
  Info,
  UserRoundKey,
  SunMoon,
} from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Schedules", href: "/schedules", icon: Calendar },
  { label: "Blog", href: "/posts", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
];

export const mobileNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Schedules", href: "/schedules", icon: Calendar },
  { label: "Blog", href: "/posts", icon: BookOpen },
];

export const menuItems = [
  { label: "Log In", href: "/login", icon: UserRoundKey },
  { label: "Switch theme", href: "", icon: SunMoon },
];

export const footerItems = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];