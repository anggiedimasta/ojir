import type { PaginatedInput, FilterInput, DateRangeInput } from './common';

// Financial API Response types
export interface InvoiceResponse {
  id: string;
  organizationId: string;
  customerId: string;
  projectId?: string;
  number: string;
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  type: 'standard' | 'recurring' | 'credit-note' | 'quote' | 'estimate';
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
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentResponse {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  reference?: string;
  gateway?: string;
  gatewayTransactionId?: string;
  processedAt: Date;
  createdAt: Date;
}

export interface ProductResponse {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  type: 'physical' | 'digital' | 'service' | 'subscription';
  status: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  price: number;
  currency: string;
  cost?: number;
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  id: string;
  organizationId: string;
  customerId: string;
  number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  type: 'purchase' | 'subscription' | 'renewal' | 'upgrade';
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Financial API Input types
export interface CreateInvoiceInput {
  organizationId: string;
  customerId: string;
  projectId?: string;
  type?: 'standard' | 'recurring' | 'credit-note' | 'quote' | 'estimate';
  currency: string;
  dueDate: Date;
  description?: string;
  notes?: string;
  terms?: string;
  lineItems: {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discountRate?: number;
  }[];
}

export interface UpdateInvoiceInput {
  id: string;
  status?: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  dueDate?: Date;
  description?: string;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  method: 'credit-card' | 'debit-card' | 'bank-transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'crypto' | 'other';
  reference?: string;
  gateway?: string;
  notes?: string;
}

export interface CreateProductInput {
  organizationId: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  type: 'physical' | 'digital' | 'service' | 'subscription';
  price: number;
  currency: string;
  cost?: number;
  tags?: string[];
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'discontinued' | 'coming-soon';
  price?: number;
  cost?: number;
  tags?: string[];
}

export interface CreateOrderInput {
  organizationId: string;
  customerId: string;
  type?: 'purchase' | 'subscription' | 'renewal' | 'upgrade';
  currency: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface GetInvoicesInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  customerId?: string;
  projectId?: string;
  status?: string;
  type?: string;
  issueDateRange?: DateRangeInput;
  dueDateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetPaymentsInput extends PaginatedInput, FilterInput {
  invoiceId?: string;
  method?: string;
  status?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetProductsInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  category?: string;
  type?: string;
  status?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface GetOrdersInput extends PaginatedInput, FilterInput {
  organizationId?: string;
  customerId?: string;
  status?: string;
  type?: string;
  dateRange?: DateRangeInput;
  amountRange?: {
    min?: number;
    max?: number;
  };
}