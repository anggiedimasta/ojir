import type { Address, Attachment } from "./common";

export interface Invoice {
  id: string;
  organizationId: string;
  customerId: string;
  projectId?: string;
  number: string;
  status: InvoiceStatus;
  type: InvoiceType;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  description?: string;
  notes?: string;
  terms?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  lineItems: InvoiceLineItem[];
  payments: Payment[];
  taxes: TaxItem[];
  discounts: DiscountItem[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partial"
  | "paid"
  | "overdue"
  | "cancelled"
  | "refunded";

export type InvoiceType =
  | "standard"
  | "recurring"
  | "credit-note"
  | "quote"
  | "estimate";

export interface InvoiceLineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  discountRate?: number;
  category?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  fees?: number;
  notes?: string;
  processedAt: Date;
  createdAt: Date;
}

export type PaymentMethod =
  | "credit-card"
  | "debit-card"
  | "bank-transfer"
  | "paypal"
  | "stripe"
  | "cash"
  | "check"
  | "crypto"
  | "other";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface TaxItem {
  id: string;
  name: string;
  rate: number;
  amount: number;
  jurisdiction?: string;
}

export interface DiscountItem {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  amount: number;
  code?: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string;
  cost?: number;
  inventory?: ProductInventory;
  dimensions?: ProductDimensions;
  images: string[];
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductType = "physical" | "digital" | "service" | "subscription";
export type ProductStatus =
  | "active"
  | "inactive"
  | "discontinued"
  | "coming-soon";

export interface ProductInventory {
  tracked: boolean;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  maxStock: number;
  location?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: "cm" | "in";
  weightUnit: "kg" | "lb";
}

export interface Order {
  id: string;
  organizationId: string;
  customerId: string;
  number: string;
  status: OrderStatus;
  type: OrderType;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  billingAddress: Address;
  shippingAddress?: Address;
  items: OrderItem[];
  payments: Payment[];
  shipping?: ShippingInfo;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderType = "purchase" | "subscription" | "renewal" | "upgrade";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface ShippingInfo {
  carrier: string;
  method: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  cost: number;
}
