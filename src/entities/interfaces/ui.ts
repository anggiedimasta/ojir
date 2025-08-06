import type { BaseEntity } from './common';

// Calendar UI Interfaces
export interface CalendarView {
  view: 'month' | 'week' | 'day' | 'agenda';
}

// Navigation and Menu Interfaces
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

// Dashboard and Analytics UI Interfaces
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

// Form and Input UI Interfaces
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

// Table and List UI Interfaces
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

// Modal and Dialog UI Interfaces
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

// Theme and Styling Interfaces
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

// Chart and Visualization Interfaces
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

// Component Props Interfaces
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
}

// Loading and State Interfaces
export interface LoadingState {
  isLoading: boolean;
  isFetching?: boolean;
  error?: string | null;
  data?: any;
}

export interface RequestLoadingState {
  [requestId: string]: {
    isLoading: boolean;
    isFetching?: boolean;
    error?: string | null;
    startTime?: number;
  };
}

// Notification and Toast Interfaces
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Pagination Interfaces
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Search and Filter Interfaces
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// File Upload Interfaces
export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles?: number;
  autoUpload?: boolean;
  chunkSize?: number;
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Responsive Design Interfaces
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Animation and Transition Interfaces
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';

export interface TransitionConfig {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
  direction?: 'in' | 'out' | 'both';
}

// Accessibility Interfaces
export interface AriaProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Internationalization Interfaces
export interface LocaleConfig {
  locale: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    precision: number;
  };
}

// Performance and Optimization Interfaces
export interface LazyLoadConfig {
  threshold: number;
  rootMargin: string;
  triggerOnce: boolean;
}

export interface VirtualScrollConfig {
  itemHeight: number;
  overscan: number;
  containerHeight: number;
}

// Error Boundary Interfaces
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Context Interfaces
export interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// Hook Return Interfaces
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  setValue: (value: T) => void;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

export interface UseMediaQueryReturn {
  matches: boolean;
  media: string;
}

// Event Handler Interfaces
export interface KeyboardEventHandler {
  (event: React.KeyboardEvent): void;
}

export interface MouseEventHandler {
  (event: React.MouseEvent): void;
}

export interface ChangeEventHandler {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface FocusEventHandler {
  (event: React.FocusEvent): void;
}

export interface FormEventHandler {
  (event: React.FormEvent): void;
}

// Ref Interfaces
export interface RefCallback<T> {
  (instance: T | null): void;
}

export interface RefObject<T> {
  current: T | null;
}

// Children Interfaces
export interface ReactNode {
  children?: React.ReactNode;
}

export interface ReactElement {
  element: React.ReactElement;
}

export interface ReactChild {
  child: any; // React.ReactChild
}

export interface ReactChildren {
  children: any; // React.ReactChildren
}

// CSS and Styling Interfaces
export interface CSSProperties {
  properties: React.CSSProperties;
}

export interface CSSClassName {
  className: string;
}

export interface CSSVariable {
  variable: `var(--${string})`;
}

export interface CSSColor {
  color: string | CSSVariable;
}

export interface CSSSize {
  size: string | number;
}

export interface CSSSpacing {
  spacing: CSSSize | ResponsiveValue<CSSSize>;
}

// Layout Interfaces
export interface LayoutDirection {
  direction: 'ltr' | 'rtl';
}

export interface FlexDirection {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

export interface JustifyContent {
  justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export interface AlignItems {
  align: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export interface Position {
  position: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
}

export interface Display {
  display: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
}

// Grid Interfaces
export interface GridTemplate {
  template: string | number | ResponsiveValue<string | number>;
}

export interface GridArea {
  area: string | ResponsiveValue<string>;
}

export interface GridGap {
  gap: CSSSpacing;
}

// Z-Index Interfaces
export interface ZIndex {
  zIndex: 'auto' | number | ResponsiveValue<number>;
}

// Border Interfaces
export interface BorderRadius {
  radius: CSSSize | ResponsiveValue<CSSSize>;
}

export interface BorderWidth {
  width: CSSSize | ResponsiveValue<CSSSize>;
}

export interface BorderStyle {
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
}

export interface BorderColor {
  color: CSSColor | ResponsiveValue<CSSColor>;
}

// Shadow Interfaces
export interface BoxShadow {
  shadow: string | ResponsiveValue<string>;
}

export interface TextShadow {
  shadow: string | ResponsiveValue<string>;
}

// Typography Interfaces
export interface FontFamily {
  family: string | ResponsiveValue<string>;
}

export interface FontSize {
  size: CSSSize | ResponsiveValue<CSSSize>;
}

export interface FontWeight {
  weight: 'normal' | 'bold' | 'bolder' | 'lighter' | number | ResponsiveValue<number>;
}

export interface LineHeight {
  height: CSSSize | ResponsiveValue<CSSSize>;
}

export interface TextAlign {
  align: 'left' | 'center' | 'right' | 'justify' | ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
}

export interface TextTransform {
  transform: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

export interface TextDecoration {
  decoration: 'none' | 'underline' | 'overline' | 'line-through';
}

// Spacing Interfaces
export interface Margin {
  margin: CSSSpacing;
}

export interface Padding {
  padding: CSSSpacing;
}

export interface Gap {
  gap: CSSSpacing;
}

// Sizing Interfaces
export interface Width {
  width: CSSSize | ResponsiveValue<CSSSize>;
}

export interface Height {
  height: CSSSize | ResponsiveValue<CSSSize>;
}

export interface MinWidth {
  minWidth: CSSSize | ResponsiveValue<CSSSize>;
}

export interface MaxWidth {
  maxWidth: CSSSize | ResponsiveValue<CSSSize>;
}

export interface MinHeight {
  minHeight: CSSSize | ResponsiveValue<CSSSize>;
}

export interface MaxHeight {
  maxHeight: CSSSize | ResponsiveValue<CSSSize>;
}

// Overflow Interfaces
export interface Overflow {
  overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;
}

// Cursor Interfaces
export interface Cursor {
  cursor: 'auto' | 'default' | 'pointer' | 'text' | 'move' | 'not-allowed' | 'wait' | 'help' | 'crosshair' | 'grab' | 'grabbing';
}

// User Select Interfaces
export interface UserSelect {
  select: 'auto' | 'none' | 'text' | 'all' | 'contain';
}

// Pointer Events Interfaces
export interface PointerEvents {
  events: 'auto' | 'none' | 'fill' | 'stroke' | 'all' | 'visible' | 'visibleFill' | 'visibleStroke' | 'painted' | 'fill' | 'stroke' | 'all';
}

// Transform Interfaces
export interface Transform {
  transform: string | ResponsiveValue<string>;
}

export interface TransformOrigin {
  origin: string | ResponsiveValue<string>;
}

// Transition Interfaces
export interface TransitionProperty {
  property: string | ResponsiveValue<string>;
}

export interface TransitionDuration {
  duration: CSSSize | ResponsiveValue<CSSSize>;
}

export interface TransitionTimingFunction {
  function: string | ResponsiveValue<string>;
}

export interface TransitionDelay {
  delay: CSSSize | ResponsiveValue<CSSSize>;
}

// Animation Interfaces
export interface AnimationName {
  name: string | ResponsiveValue<string>;
}

export interface AnimationDuration {
  duration: CSSSize | ResponsiveValue<CSSSize>;
}

export interface AnimationTimingFunction {
  function: string | ResponsiveValue<string>;
}

export interface AnimationDelay {
  delay: CSSSize | ResponsiveValue<CSSSize>;
}

export interface AnimationIterationCount {
  count: number | 'infinite' | ResponsiveValue<number | 'infinite'>;
}

export interface AnimationDirection {
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface AnimationFillMode {
  mode: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface AnimationPlayState {
  state: 'running' | 'paused';
} 