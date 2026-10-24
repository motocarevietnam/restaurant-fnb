/**
 * Foundation-only cross-channel contracts. No live service currently imports these.
 * IDs and settings are supplied by the API/database. No fixed branch, shift,
 * station, bank or pricing values belong here.
 */
export type OrderChannel = "SERVICE" | "TABLE_QR" | "WEB" | "KIOSK";
export type ServiceMode = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

export interface RequestScope {
  restaurantId: string;
  branchId: string;
  actorId: string | null;
  shiftId?: string | null;
  permissionKeys: readonly string[];
}

export interface CreateOrderCommand {
  scope: RequestScope;
  channel: OrderChannel;
  serviceMode: ServiceMode;
  clientRequestId: string;
  tableSessionId?: string | null;
  customerId?: string | null;
  items: readonly {
    menuItemId: string;
    quantity: string; // decimal serialized, validated server-side
    modifierIds?: readonly string[];
    note?: string;
  }[];
}

export interface MoneyAmount {
  currency: string; // e.g., configured ISO-4217 code
  minorUnits: string; // signed integer as a string, no JS floating-point money
}

export interface CashHandoverCommand {
  restaurantId: string;
  branchId: string;
  sourceShiftId: string;
  giverEmployeeId: string;
  receiverEmployeeId: string;
  declaredAmount: MoneyAmount;
  clientRequestId: string;
}

export type CashHandoverStatus =
  | "PROPOSED"
  | "RECEIVED"
  | "DISPUTED"
  | "REJECTED"
  | "CANCELLED";
