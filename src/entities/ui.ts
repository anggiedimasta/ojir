// Calendar UI Types
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// Navigation and Menu Types
export interface MenuItem {
  id?: string;
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  children?: MenuItem[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

// Dashboard and Analytics UI Types
export interface StatCard {
  id: string;
  name: string;
  value: string | number;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: ActivityType;
  icon?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
}

export type ActivityType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'completed'
  | 'assigned'
  | 'commented'
  | 'uploaded'
  | 'logged-in'
  | 'logged-out';

export interface QuickAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

// Form and Input UI Types
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
  disabled?: boolean;
  options?: FormFieldOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'datetime'
  | 'file'
  | 'toggle';

export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Table and List UI Types
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T = Record<string, unknown>> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  isVisible?: (record: T) => boolean;
  isDisabled?: (record: T) => boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { value: string | number | boolean; label: string }[];
  defaultValue?: string | number | boolean;
}

// Modal and Dialog UI Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
}

export interface ConfirmDialogProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

// Theme and Styling Types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

// Chart and Visualization Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  category?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  height?: number;
  width?: number;
}