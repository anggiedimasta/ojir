// Calendar UI Types
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// Navigation and Menu Types
export type MenuItem = {
  id?: string;
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  children?: MenuItem[];
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export type Breadcrumb = {
  label: string;
  href?: string;
  isActive?: boolean;
};

// Dashboard and Analytics UI Types
export type StatCard = {
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
};

export type Activity = {
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
};

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

export type QuickAction = {
  id: string;
  name: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isDisabled?: boolean;
};

// Form and Input UI Types
export type FormField = {
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
};

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

export type FormFieldOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

// Table and List UI Types
export type TableColumn<T = Record<string, unknown>> = {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
};

export type TableAction<T = Record<string, unknown>> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  isVisible?: (record: T) => boolean;
  isDisabled?: (record: T) => boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export type FilterOption = {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: { value: string | number | boolean; label: string }[];
  defaultValue?: string | number | boolean;
};

// Modal and Dialog UI Types
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscapeKey?: boolean;
};

export type ConfirmDialogProps = ModalProps & {
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
};

// Theme and Styling Types
export type ThemeConfig = {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  spacing: 'compact' | 'comfortable' | 'spacious';
};

export type ColorPalette = {
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
};

// Chart and Visualization Types
export type ChartDataPoint = {
  label: string;
  value: number;
  color?: string;
  category?: string;
};

export type ChartConfig = {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  height?: number;
  width?: number;
};

// Component Props Types
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export type InputProps = {
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
};

export type SelectProps = {
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
};

// Loading and State Types
export type LoadingState = {
  isLoading: boolean;
  isFetching?: boolean;
  error?: string | null;
  data?: any;
};

export type RequestLoadingState = {
  [requestId: string]: {
    isLoading: boolean;
    isFetching?: boolean;
    error?: string | null;
    startTime?: number;
  };
};

// Notification and Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastProps = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

// Pagination Types
export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Search and Filter Types
export type SearchFilters = {
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
};

// File Upload Types
export type FileUploadConfig = {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles?: number;
  autoUpload?: boolean;
  chunkSize?: number;
};

export type FileUploadProgress = {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
};

// Responsive Design Types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ResponsiveValue<T> = {
  [K in Breakpoint]?: T;
} & {
  base: T;
};

// Animation and Transition Types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce';

export type TransitionConfig = {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
  direction?: 'in' | 'out' | 'both';
};

// Accessibility Types
export type AriaProps = {
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
};

// Internationalization Types
export type LocaleConfig = {
  locale: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    precision: number;
  };
};

// Performance and Optimization Types
export type LazyLoadConfig = {
  threshold: number;
  rootMargin: string;
  triggerOnce: boolean;
};

export type VirtualScrollConfig = {
  itemHeight: number;
  overscan: number;
  containerHeight: number;
};

// Error Boundary Types
export type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

// Context Types
export type ThemeContextType = {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  toggleTheme: () => void;
};

export type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

// Hook Return Types
export type UseLocalStorageReturn<T> = [T, (value: T) => void, () => void];

export type UseDebounceReturn<T> = [T, (value: T) => void];

export type UseIntersectionObserverReturn = {
  ref: React.RefObject<Element>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export type UseMediaQueryReturn = {
  matches: boolean;
  media: string;
};

// Event Handler Types
export type KeyboardEventHandler = (event: React.KeyboardEvent) => void;

export type MouseEventHandler = (event: React.MouseEvent) => void;

export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

export type FocusEventHandler = (event: React.FocusEvent) => void;

export type FormEventHandler = (event: React.FormEvent) => void;

// Ref Types
export type RefCallback<T> = (instance: T | null) => void;

export type RefObject<T> = {
  current: T | null;
};

// Children Types
export type ReactNode = React.ReactNode;

export type ReactElement = React.ReactElement;

export type ReactChild = React.ReactChild;

export type ReactChildren = React.ReactChildren;

// CSS and Styling Types
export type CSSProperties = React.CSSProperties;

export type CSSClassName = string;

export type CSSVariable = `var(--${string})`;

export type CSSColor = string | CSSVariable;

export type CSSSize = string | number;

export type CSSSpacing = CSSSize | ResponsiveValue<CSSSize>;

// Layout Types
export type LayoutDirection = 'ltr' | 'rtl';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

export type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';

// Grid Types
export type GridTemplate = string | number | ResponsiveValue<string | number>;

export type GridArea = string | ResponsiveValue<string>;

export type GridGap = CSSSpacing;

// Z-Index Types
export type ZIndex = 'auto' | number | ResponsiveValue<number>;

// Border Types
export type BorderRadius = CSSSize | ResponsiveValue<CSSSize>;

export type BorderWidth = CSSSize | ResponsiveValue<CSSSize>;

export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

export type BorderColor = CSSColor | ResponsiveValue<CSSColor>;

// Shadow Types
export type BoxShadow = string | ResponsiveValue<string>;

export type TextShadow = string | ResponsiveValue<string>;

// Typography Types
export type FontFamily = string | ResponsiveValue<string>;

export type FontSize = CSSSize | ResponsiveValue<CSSSize>;

export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number | ResponsiveValue<number>;

export type LineHeight = CSSSize | ResponsiveValue<CSSSize>;

export type TextAlign = 'left' | 'center' | 'right' | 'justify' | ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;

export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

export type TextDecoration = 'none' | 'underline' | 'overline' | 'line-through';

// Spacing Types
export type Margin = CSSSpacing;

export type Padding = CSSSpacing;

export type Gap = CSSSpacing;

// Sizing Types
export type Width = CSSSize | ResponsiveValue<CSSSize>;

export type Height = CSSSize | ResponsiveValue<CSSSize>;

export type MinWidth = CSSSize | ResponsiveValue<CSSSize>;

export type MaxWidth = CSSSize | ResponsiveValue<CSSSize>;

export type MinHeight = CSSSize | ResponsiveValue<CSSSize>;

export type MaxHeight = CSSSize | ResponsiveValue<CSSSize>;

// Overflow Types
export type Overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;

// Cursor Types
export type Cursor = 'auto' | 'default' | 'pointer' | 'text' | 'move' | 'not-allowed' | 'wait' | 'help' | 'crosshair' | 'grab' | 'grabbing';

// User Select Types
export type UserSelect = 'auto' | 'none' | 'text' | 'all' | 'contain';

// Pointer Events Types
export type PointerEvents = 'auto' | 'none' | 'fill' | 'stroke' | 'all' | 'visible' | 'visibleFill' | 'visibleStroke' | 'painted' | 'fill' | 'stroke' | 'all';

// Transform Types
export type Transform = string | ResponsiveValue<string>;

export type TransformOrigin = string | ResponsiveValue<string>;

// Transition Types
export type TransitionProperty = string | ResponsiveValue<string>;

export type TransitionDuration = CSSSize | ResponsiveValue<CSSSize>;

export type TransitionTimingFunction = string | ResponsiveValue<string>;

export type TransitionDelay = CSSSize | ResponsiveValue<CSSSize>;

// Animation Types
export type AnimationName = string | ResponsiveValue<string>;

export type AnimationDuration = CSSSize | ResponsiveValue<CSSSize>;

export type AnimationTimingFunction = string | ResponsiveValue<string>;

export type AnimationDelay = CSSSize | ResponsiveValue<CSSSize>;

export type AnimationIterationCount = number | 'infinite' | ResponsiveValue<number | 'infinite'>;

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export type AnimationPlayState = 'running' | 'paused'; 