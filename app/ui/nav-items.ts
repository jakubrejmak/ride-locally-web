import { Home, Calendar, BookOpen, Info } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Schedules", href: "/schedules", icon: Calendar },
  { label: "Blog", href: "/posts", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
];

export const footerItems = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];