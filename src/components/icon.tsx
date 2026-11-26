import {
  Award, BadgeCheck, CalendarCheck, Code2, Globe, Headphones, HeartHandshake, Laptop, LayoutTemplate,
  LifeBuoy, ListChecks, Megaphone, MonitorSmartphone, Palette, PenTool, Rocket, Search, SearchCheck,
  ShieldCheck, ShoppingCart, Sparkles, Timer, Users, Zap, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Award, BadgeCheck, CalendarCheck, Code2, Globe, Headphones, HeartHandshake, Laptop, LayoutTemplate,
  LifeBuoy, ListChecks, Megaphone, MonitorSmartphone, Palette, PenTool, Rocket, Search, SearchCheck,
  ShieldCheck, ShoppingCart, Sparkles, Timer, Users, Zap,
};

export function DynamicIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}

export const iconNames = Object.keys(icons);
