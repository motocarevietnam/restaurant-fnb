import { CalendarPlus, ChefHat, LayoutGrid, ShoppingCart, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { href: "/pos", label: "New order", icon: ShoppingCart },
  { href: "/tables", label: "Tables", icon: LayoutGrid },
  { href: "/reservations", label: "New reservation", icon: CalendarPlus },
  { href: "/kds", label: "Kitchen display", icon: ChefHat },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
];

// One-tap jumps into the flows staff reach for most during service — sits
// right under the header so it's the first thing visible, not buried below
// the stat cards.
export function QuickActions() {
  const { locale } = useI18n();
  const names: Record<string,string> = {"/pos": "Tạo đơn mới", "/tables": "Bàn", "/reservations": "Đặt bàn mới", "/kds": "Màn hình bếp", "/menu": "Thực đơn"};
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map((action) => (
        <Button key={action.href} variant="outline" size="sm" render={<Link href={action.href} />}>
          <action.icon className="h-4 w-4" />
          {locale === "vi" ? names[action.href] : action.label}
        </Button>
      ))}
    </div>
  );
}
