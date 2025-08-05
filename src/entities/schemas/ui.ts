import { z } from 'zod';

// Calendar UI Schemas
export const CalendarViewSchema = z.enum(['month', 'week', 'day', 'agenda']);

// Activity Type Schemas
export const ActivityTypeSchema = z.enum([
  'created',
  'updated',
  'deleted',
  'completed',
  'assigned',
  'commented',
  'uploaded',
  'logged-in',
  'logged-out'
]);

// Form Field Type Schemas
export const FormFieldTypeSchema = z.enum([
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'multiselect',
  'checkbox',
  'radio',
  'date',
  'datetime',
  'file',
  'toggle'
]);

// Button Variant Schemas
export const ButtonVariantSchema = z.enum([
  'primary',
  'secondary',
  'outline',
  'ghost',
  'destructive'
]);

export const ButtonSizeSchema = z.enum(['sm', 'md', 'lg']);

// Input Type Schemas
export const InputTypeSchema = z.enum([
  'text',
  'email',
  'password',
  'number',
  'tel',
  'url'
]);

export const InputSizeSchema = z.enum(['sm', 'md', 'lg']);

// Modal Size Schemas
export const ModalSizeSchema = z.enum(['small', 'medium', 'large', 'full']);

// Confirm Dialog Variant Schemas
export const ConfirmDialogVariantSchema = z.enum(['danger', 'warning', 'info']);

// Theme Mode Schemas
export const ThemeModeSchema = z.enum(['light', 'dark', 'system']);

export const BorderRadiusSchema = z.enum(['none', 'small', 'medium', 'large']);

export const SpacingSchema = z.enum(['compact', 'comfortable', 'spacious']);

// Chart Type Schemas
export const ChartTypeSchema = z.enum([
  'line',
  'bar',
  'pie',
  'donut',
  'area',
  'scatter'
]);

// Toast Type Schemas
export const ToastTypeSchema = z.enum(['success', 'error', 'warning', 'info']);

// Table Action Variant Schemas
export const TableActionVariantSchema = z.enum(['primary', 'secondary', 'danger']);

// Table Column Alignment Schemas
export const TableColumnAlignSchema = z.enum(['left', 'center', 'right']);

// Filter Option Type Schemas
export const FilterOptionTypeSchema = z.enum(['text', 'select', 'date', 'number', 'boolean']);

// File Upload Status Schemas
export const FileUploadStatusSchema = z.enum(['pending', 'uploading', 'completed', 'error']);

// Animation Type Schemas
export const AnimationTypeSchema = z.enum(['fade', 'slide', 'scale', 'rotate', 'bounce']);

export const AnimationDirectionSchema = z.enum(['in', 'out', 'both']);

export const AnimationFillModeSchema = z.enum(['none', 'forwards', 'backwards', 'both']);

export const AnimationPlayStateSchema = z.enum(['running', 'paused']);

// Breakpoint Schemas
export const BreakpointSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);

// Layout Direction Schemas
export const LayoutDirectionSchema = z.enum(['ltr', 'rtl']);

// Flex Direction Schemas
export const FlexDirectionSchema = z.enum(['row', 'column', 'row-reverse', 'column-reverse']);

// Justify Content Schemas
export const JustifyContentSchema = z.enum([
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly'
]);

// Align Items Schemas
export const AlignItemsSchema = z.enum(['flex-start', 'flex-end', 'center', 'baseline', 'stretch']);

// Position Schemas
export const PositionSchema = z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']);

// Display Schemas
export const DisplaySchema = z.enum(['block', 'inline', 'inline-block', 'flex', 'grid', 'none']);

// Overflow Schemas
export const OverflowSchema = z.enum(['visible', 'hidden', 'scroll', 'auto']);

// Cursor Schemas
export const CursorSchema = z.enum([
  'auto',
  'default',
  'pointer',
  'text',
  'move',
  'not-allowed',
  'wait',
  'help',
  'crosshair',
  'grab',
  'grabbing'
]);

// User Select Schemas
export const UserSelectSchema = z.enum(['auto', 'none', 'text', 'all', 'contain']);

// Text Align Schemas
export const TextAlignSchema = z.enum(['left', 'center', 'right', 'justify']);

// Text Transform Schemas
export const TextTransformSchema = z.enum(['none', 'capitalize', 'uppercase', 'lowercase']);

// Text Decoration Schemas
export const TextDecorationSchema = z.enum(['none', 'underline', 'overline', 'line-through']);

// Border Style Schemas
export const BorderStyleSchema = z.enum(['solid', 'dashed', 'dotted', 'double', 'none']);

// Font Weight Schemas
export const FontWeightSchema = z.enum(['normal', 'bold', 'bolder', 'lighter']);

// Z-Index Schemas
export const ZIndexSchema = z.enum(['auto']);

// Transition Timing Function Schemas
export const TransitionTimingFunctionSchema = z.enum([
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out'
]);

// Navigation and Menu Schemas
export const MenuItemSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  href: z.string(),
  icon: z.any().optional(), // React.ReactNode
  isActive: z.boolean().optional(),
  isDisabled: z.boolean().optional(),
  children: z.array(z.lazy(() => MenuItemSchema)).optional(),
});

export const MenuSectionSchema = z.object({
  title: z.string(),
  items: z.array(MenuItemSchema),
});

export const BreadcrumbSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Dashboard and Analytics Schemas
export const StatCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.union([z.string(), z.number()]),
  icon: z.any().optional(), // React.ReactNode
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  trend: z.object({
    value: z.number(),
    direction: z.enum(['up', 'down', 'neutral']),
    period: z.string(),
  }).optional(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  time: z.string(),
  type: ActivityTypeSchema,
  icon: z.any().optional(), // React.ReactNode
  user: z.object({
    name: z.string(),
    avatar: z.string().optional(),
  }).optional(),
});

export const QuickActionSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.any(), // React.ReactNode
  href: z.string().optional(),
  onClick: z.function().optional(),
  isDisabled: z.boolean().optional(),
});

// Form and Input Schemas
export const FormFieldOptionSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
  disabled: z.boolean().optional(),
  icon: z.any().optional(), // React.ReactNode
});

export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: FormFieldTypeSchema,
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  options: z.array(FormFieldOptionSchema).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
});

// Table and List Schemas
export const TableColumnSchema = z.object({
  key: z.string(),
  title: z.string(),
  width: z.union([z.number(), z.string()]).optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  render: z.function().optional(),
  align: TableColumnAlignSchema.optional(),
});

export const TableActionSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.any().optional(), // React.ReactNode
  onClick: z.function(),
  isVisible: z.function().optional(),
  isDisabled: z.function().optional(),
  variant: TableActionVariantSchema.optional(),
});

export const FilterOptionSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: FilterOptionTypeSchema,
  options: z.array(z.object({
    value: z.union([z.string(), z.number(), z.boolean()]),
    label: z.string(),
  })).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

// Modal and Dialog Schemas
export const ModalPropsSchema = z.object({
  isOpen: z.boolean(),
  onClose: z.function(),
  title: z.string(),
  size: ModalSizeSchema.optional(),
  showCloseButton: z.boolean().optional(),
  closeOnOverlayClick: z.boolean().optional(),
  closeOnEscapeKey: z.boolean().optional(),
});

export const ConfirmDialogPropsSchema = ModalPropsSchema.extend({
  message: z.string(),
  confirmText: z.string().optional(),
  cancelText: z.string().optional(),
  variant: ConfirmDialogVariantSchema.optional(),
  onConfirm: z.function(),
  onCancel: z.function().optional(),
});

// Theme and Styling Schemas
export const ThemeConfigSchema = z.object({
  mode: ThemeModeSchema,
  primaryColor: z.string(),
  fontFamily: z.string(),
  borderRadius: BorderRadiusSchema,
  spacing: SpacingSchema,
});

export const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  success: z.string(),
  warning: z.string(),
  error: z.string(),
  info: z.string(),
  background: z.string(),
  surface: z.string(),
  text: z.string(),
  textSecondary: z.string(),
  border: z.string(),
});

// Chart and Visualization Schemas
export const ChartDataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
  category: z.string().optional(),
});

export const ChartConfigSchema = z.object({
  type: ChartTypeSchema,
  data: z.array(ChartDataPointSchema),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  colors: z.array(z.string()).optional(),
  height: z.number().optional(),
  width: z.number().optional(),
});

// Component Props Schemas
export const ButtonPropsSchema = z.object({
  variant: ButtonVariantSchema.optional(),
  size: ButtonSizeSchema.optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  children: z.any(), // React.ReactNode
  onClick: z.function().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
  className: z.string().optional(),
});

export const InputPropsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  type: InputTypeSchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  value: z.string().optional(),
  onChange: z.function().optional(),
  className: z.string().optional(),
});

export const SelectPropsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.union([z.string(), z.number()]),
    label: z.string(),
  })),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  error: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  onChange: z.function().optional(),
  className: z.string().optional(),
});

// Loading and State Schemas
export const LoadingStateSchema = z.object({
  isLoading: z.boolean(),
  isFetching: z.boolean().optional(),
  error: z.string().nullable().optional(),
  data: z.any().optional(),
});

export const RequestLoadingStateSchema = z.record(z.object({
  isLoading: z.boolean(),
  isFetching: z.boolean().optional(),
  error: z.string().nullable().optional(),
  startTime: z.number().optional(),
}));

// Notification and Toast Schemas
export const ToastPropsSchema = z.object({
  id: z.string(),
  type: ToastTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  action: z.object({
    label: z.string(),
    onClick: z.function(),
  }).optional(),
});

// Pagination Schemas
export const PaginationInfoSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

// Search and Filter Schemas
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// File Upload Schemas
export const FileUploadConfigSchema = z.object({
  maxSize: z.number(), // in bytes
  allowedTypes: z.array(z.string()),
  maxFiles: z.number().optional(),
  autoUpload: z.boolean().optional(),
  chunkSize: z.number().optional(),
});

export const FileUploadProgressSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  progress: z.number(), // 0-100
  status: FileUploadStatusSchema,
  error: z.string().optional(),
});

// Responsive Design Schemas
export const ResponsiveValueSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    base: valueSchema,
    xs: valueSchema.optional(),
    sm: valueSchema.optional(),
    md: valueSchema.optional(),
    lg: valueSchema.optional(),
    xl: valueSchema.optional(),
    '2xl': valueSchema.optional(),
  });

// Animation and Transition Schemas
export const TransitionConfigSchema = z.object({
  type: AnimationTypeSchema,
  duration: z.number(),
  delay: z.number().optional(),
  easing: z.string().optional(),
  direction: AnimationDirectionSchema.optional(),
});

// Accessibility Schemas
export const AriaPropsSchema = z.object({
  'aria-label': z.string().optional(),
  'aria-describedby': z.string().optional(),
  'aria-labelledby': z.string().optional(),
  'aria-hidden': z.boolean().optional(),
  'aria-expanded': z.boolean().optional(),
  'aria-selected': z.boolean().optional(),
  'aria-checked': z.boolean().optional(),
  'aria-disabled': z.boolean().optional(),
  'aria-required': z.boolean().optional(),
  'aria-invalid': z.boolean().optional(),
  role: z.string().optional(),
  tabIndex: z.number().optional(),
});

// Internationalization Schemas
export const LocaleConfigSchema = z.object({
  locale: z.string(),
  currency: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  numberFormat: z.object({
    decimal: z.string(),
    thousands: z.string(),
    precision: z.number(),
  }),
});

// Performance and Optimization Schemas
export const LazyLoadConfigSchema = z.object({
  threshold: z.number(),
  rootMargin: z.string(),
  triggerOnce: z.boolean(),
});

export const VirtualScrollConfigSchema = z.object({
  itemHeight: z.number(),
  overscan: z.number(),
  containerHeight: z.number(),
});

// Error Boundary Schemas
export const ErrorBoundaryStateSchema = z.object({
  hasError: z.boolean(),
  error: z.instanceof(Error).optional(),
  errorInfo: z.any().optional(), // React.ErrorInfo
});

export const ErrorFallbackPropsSchema = z.object({
  error: z.instanceof(Error),
  resetErrorBoundary: z.function(),
});

// Context Schemas
export const ThemeContextTypeSchema = z.object({
  theme: ThemeConfigSchema,
  setTheme: z.function(),
  toggleTheme: z.function(),
});

export const AuthContextTypeSchema = z.object({
  user: z.any().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  login: z.function(),
  logout: z.function(),
  refreshToken: z.function(),
});

// Hook Return Schemas
export const UseLocalStorageReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.tuple([valueSchema, z.function(), z.function()]);

export const UseDebounceReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.tuple([valueSchema, z.function()]);

export const UseIntersectionObserverReturnSchema = z.object({
  ref: z.any(), // React.RefObject<Element>
  isIntersecting: z.boolean(),
  entry: z.any().optional(), // IntersectionObserverEntry
});

export const UseMediaQueryReturnSchema = z.object({
  matches: z.boolean(),
  media: z.string(),
});

// Event Handler Schemas
export const KeyboardEventHandlerSchema = z.function();
export const MouseEventHandlerSchema = z.function();
export const ChangeEventHandlerSchema = z.function();
export const FocusEventHandlerSchema = z.function();
export const FormEventHandlerSchema = z.function();

// Ref Schemas
export const RefCallbackSchema = <T extends z.ZodTypeAny>(instanceSchema: T) =>
  z.function().args(z.union([instanceSchema, z.null()]));

export const RefObjectSchema = <T extends z.ZodTypeAny>(instanceSchema: T) =>
  z.object({
    current: z.union([instanceSchema, z.null()]),
  });

// Children Schemas
export const ReactNodeSchema = z.any(); // React.ReactNode
export const ReactElementSchema = z.any(); // React.ReactElement
export const ReactChildSchema = z.any(); // React.ReactChild
export const ReactChildrenSchema = z.any(); // React.ReactChildren

// CSS and Styling Schemas
export const CSSPropertiesSchema = z.any(); // React.CSSProperties
export const CSSClassNameSchema = z.string();
export const CSSVariableSchema = z.string().regex(/^var\(--.+\)$/);
export const CSSColorSchema = z.union([z.string(), CSSVariableSchema]);
export const CSSSizeSchema = z.union([z.string(), z.number()]);
export const CSSSpacingSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);

// Layout Schemas
export const LayoutDirectionSchema = z.enum(['ltr', 'rtl']);
export const FlexDirectionSchema = z.enum(['row', 'column', 'row-reverse', 'column-reverse']);
export const JustifyContentSchema = z.enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']);
export const AlignItemsSchema = z.enum(['flex-start', 'flex-end', 'center', 'baseline', 'stretch']);
export const PositionSchema = z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']);
export const DisplaySchema = z.enum(['block', 'inline', 'inline-block', 'flex', 'grid', 'none']);

// Grid Schemas
export const GridTemplateSchema = z.union([z.string(), z.number(), ResponsiveValueSchema(z.union([z.string(), z.number()]))]);
export const GridAreaSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const GridGapSchema = CSSSpacingSchema;

// Z-Index Schemas
export const ZIndexSchema = z.union([z.enum(['auto']), z.number(), ResponsiveValueSchema(z.number())]);

// Border Schemas
export const BorderRadiusSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const BorderWidthSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const BorderStyleSchema = z.enum(['solid', 'dashed', 'dotted', 'double', 'none']);
export const BorderColorSchema = z.union([CSSColorSchema, ResponsiveValueSchema(CSSColorSchema)]);

// Shadow Schemas
export const BoxShadowSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const TextShadowSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);

// Typography Schemas
export const FontFamilySchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const FontSizeSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const FontWeightSchema = z.union([z.enum(['normal', 'bold', 'bolder', 'lighter']), z.number(), ResponsiveValueSchema(z.union([z.enum(['normal', 'bold', 'bolder', 'lighter']), z.number()]))]);
export const LineHeightSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const TextAlignSchema = z.union([z.enum(['left', 'center', 'right', 'justify']), ResponsiveValueSchema(z.enum(['left', 'center', 'right', 'justify']))]);
export const TextTransformSchema = z.enum(['none', 'capitalize', 'uppercase', 'lowercase']);
export const TextDecorationSchema = z.enum(['none', 'underline', 'overline', 'line-through']);

// Spacing Schemas
export const MarginSchema = CSSSpacingSchema;
export const PaddingSchema = CSSSpacingSchema;
export const GapSchema = CSSSpacingSchema;

// Sizing Schemas
export const WidthSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const HeightSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const MinWidthSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const MaxWidthSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const MinHeightSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const MaxHeightSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);

// Overflow Schemas
export const OverflowSchema = z.union([z.enum(['visible', 'hidden', 'scroll', 'auto']), ResponsiveValueSchema(z.enum(['visible', 'hidden', 'scroll', 'auto']))]);

// Cursor Schemas
export const CursorSchema = z.enum(['auto', 'default', 'pointer', 'text', 'move', 'not-allowed', 'wait', 'help', 'crosshair', 'grab', 'grabbing']);

// User Select Schemas
export const UserSelectSchema = z.enum(['auto', 'none', 'text', 'all', 'contain']);

// Pointer Events Schemas
export const PointerEventsSchema = z.enum(['auto', 'none', 'fill', 'stroke', 'all', 'visible', 'visibleFill', 'visibleStroke', 'painted', 'fill', 'stroke', 'all']);

// Transform Schemas
export const TransformSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const TransformOriginSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);

// Transition Schemas
export const TransitionPropertySchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const TransitionDurationSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const TransitionTimingFunctionSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const TransitionDelaySchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);

// Animation Schemas
export const AnimationNameSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const AnimationDurationSchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const AnimationTimingFunctionSchema = z.union([z.string(), ResponsiveValueSchema(z.string())]);
export const AnimationDelaySchema = z.union([CSSSizeSchema, ResponsiveValueSchema(CSSSizeSchema)]);
export const AnimationIterationCountSchema = z.union([z.number(), z.enum(['infinite']), ResponsiveValueSchema(z.union([z.number(), z.enum(['infinite'])]))]);
export const AnimationDirectionSchema = z.enum(['normal', 'reverse', 'alternate', 'alternate-reverse']);
export const AnimationFillModeSchema = z.enum(['none', 'forwards', 'backwards', 'both']);
export const AnimationPlayStateSchema = z.enum(['running', 'paused']); 