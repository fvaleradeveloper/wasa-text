export interface TransactionItem {
  id: string;
  date: string;
  customerName: string;
  contact: string;
  details: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  status: "Pagado" | "Pendiente" | "Cancelado";
  originalText: string;
}

export interface ParseSummary {
  totalRevenue: number;
  totalOrders: number;
  paidCount: number;
  pendingCount: number;
  topProducts: string[];
}

export interface ParseResult {
  summary: ParseSummary;
  items: TransactionItem[];
}

export interface WaitlistItem {
  email: string;
  timestamp: string;
}

export interface DemoConfig {
  id: string;
  title: string;
  owner: string;
  avatar: string;
  category: string;
  badge: string;
  chatText: string;
  description: string;
  demoResult?: ParseResult;
}
