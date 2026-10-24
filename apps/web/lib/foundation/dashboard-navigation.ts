/**
 * Proposed dashboard navigation contract.
 * These are UI section identifiers, NOT permission grants or business config.
 * Labels are localization defaults; API-provided capabilities determine visibility.
 */
export const dashboardSections = [
  { id: "overview", label: "Tổng quan", permission: "reports.view" },
  { id: "branches", label: "Chi nhánh", permission: "branches.view" },
  { id: "employees", label: "Nhân viên", permission: "staff.view" },
  { id: "menu", label: "Menu", permission: "menu.view" },
  { id: "orders", label: "Đơn hàng", permission: "orders.view" },
  { id: "payments", label: "Thanh toán", permission: "payments.view" },
  { id: "cash", label: "Dòng tiền", permission: "cash.view" },
  { id: "customers", label: "Khách hàng", permission: "customers.view" },
  { id: "kds", label: "Bếp / KDS", permission: "kitchen.view" },
  { id: "tables", label: "Bàn ăn", permission: "tables.view" },
  { id: "reports", label: "Báo cáo", permission: "reports.view" },
  { id: "settings", label: "Cài đặt", permission: "settings.view" },
] as const;

export type DashboardSectionId = (typeof dashboardSections)[number]["id"];

export function resolveDashboardSection(hash: string): DashboardSectionId {
  const id = hash.replace(/^#/, "").trim();
  return dashboardSections.find((section) => section.id === id)?.id ?? "overview";
}

/** Convenience filtering only. Backend MUST authorize each action independently. */
export function permittedSections(allowedPermissions: ReadonlySet<string>) {
  return dashboardSections.filter((section) => allowedPermissions.has(section.permission));
}
