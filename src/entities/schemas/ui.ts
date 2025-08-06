import { z } from "zod";

// Base Schemas
export const ResponsiveValueSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    sm: valueSchema.optional(),
    md: valueSchema.optional(),
    lg: valueSchema.optional(),
    xl: valueSchema.optional(),
    "2xl": valueSchema.optional(),
  });

// React Component Schemas
export const ComponentPropsSchema = z.object({
  className: z.string().optional(),
  style: z.any().optional(), // React.CSSProperties
  children: z.any().optional(), // React.ReactNode
  id: z.string().optional(),
  "data-testid": z.string().optional(),
});

// Button Schemas
export const ButtonVariantSchema = z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']);
export const ButtonSizeSchema = z.enum(['default', 'sm', 'lg', 'icon']);
export const ButtonPropsSchema = ComponentPropsSchema.extend({
  variant: ButtonVariantSchema.optional(),
  size: ButtonSizeSchema.optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  onClick: z.function().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
});

// Input Schemas
export const InputTypeSchema = z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local']);
export const InputPropsSchema = ComponentPropsSchema.extend({
  type: InputTypeSchema.optional(),
  placeholder: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  min: z.union([z.string(), z.number()]).optional(),
  max: z.union([z.string(), z.number()]).optional(),
  step: z.union([z.string(), z.number()]).optional(),
  pattern: z.string().optional(),
  autoComplete: z.string().optional(),
  autoFocus: z.boolean().optional(),
  onChange: z.function().optional(),
  onBlur: z.function().optional(),
  onFocus: z.function().optional(),
});

// Form Schemas
export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  type: InputTypeSchema.optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  validation: z.any().optional(), // Zod schema
  error: z.string().optional(),
  helpText: z.string().optional(),
});

export const FormSchema = z.object({
  fields: z.array(FormFieldSchema),
  onSubmit: z.function().optional(),
  onReset: z.function().optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

// Modal Schemas
export const ModalPropsSchema = ComponentPropsSchema.extend({
  isOpen: z.boolean(),
  onClose: z.function(),
  title: z.string().optional(),
  description: z.string().optional(),
  size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional(),
  closeOnOverlayClick: z.boolean().optional(),
  closeOnEscape: z.boolean().optional(),
  showCloseButton: z.boolean().optional(),
});

// Table Schemas
export const TableColumnSchema = z.object({
  key: z.string(),
  header: z.string(),
  sortable: z.boolean().optional(),
  width: z.union([z.string(), z.number()]).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  render: z.function().optional(),
});

export const TablePropsSchema = ComponentPropsSchema.extend({
  columns: z.array(TableColumnSchema),
  data: z.array(z.any()),
  loading: z.boolean().optional(),
  emptyMessage: z.string().optional(),
  sortable: z.boolean().optional(),
  onSort: z.function().optional(),
  pagination: z.any().optional(), // PaginationProps
});

// Pagination Schemas
export const PaginationPropsSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number().optional(),
  onPageChange: z.function(),
  showFirstLast: z.boolean().optional(),
  showPrevNext: z.boolean().optional(),
  showPageNumbers: z.boolean().optional(),
  maxPageNumbers: z.number().optional(),
});

// Loading Schemas
export const LoadingStateSchema = z.enum(['idle', 'loading', 'success', 'error']);
export const LoadingSpinnerPropsSchema = ComponentPropsSchema.extend({
  size: z.enum(['sm', 'md', 'lg']).optional(),
  color: z.string().optional(),
  thickness: z.number().optional(),
  speed: z.string().optional(),
});

export const LoadingButtonPropsSchema = ButtonPropsSchema.extend({
  loading: z.boolean().optional(),
  loadingText: z.string().optional(),
  loadingSpinner: z.boolean().optional(),
});

export const LoadingOverlayPropsSchema = ComponentPropsSchema.extend({
  loading: z.boolean(),
  text: z.string().optional(),
  backdrop: z.boolean().optional(),
  spinner: z.boolean().optional(),
});

// Navigation and Menu Schemas
export const MenuItemSchema: z.ZodType<any> = z.object({
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
  change: z.number().optional(),
  changeType: z.enum(['increase', 'decrease']).optional(),
  icon: z.any().optional(), // React.ReactNode
  color: z.string().optional(),
});

export const ChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(z.object({
    label: z.string(),
    data: z.array(z.number()),
    backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
    borderColor: z.union([z.string(), z.array(z.string())]).optional(),
    borderWidth: z.number().optional(),
  })),
});

export const ChartPropsSchema = ComponentPropsSchema.extend({
  data: ChartDataSchema,
  type: z.enum(['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea']).optional(),
  options: z.any().optional(), // Chart.js options
  height: z.union([z.string(), z.number()]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
});

// Toast and Notification Schemas
export const ToastTypeSchema = z.enum(['success', 'error', 'warning', 'info']);
export const ToastPropsSchema = z.object({
  id: z.string(),
  type: ToastTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  action: z.any().optional(), // React.ReactNode
  onClose: z.function().optional(),
});

// Tooltip Schemas
export const TooltipPropsSchema = ComponentPropsSchema.extend({
  content: z.string(),
  placement: z.enum(['top', 'bottom', 'left', 'right']).optional(),
  trigger: z.enum(['hover', 'click', 'focus']).optional(),
  delay: z.number().optional(),
  disabled: z.boolean().optional(),
});

// Dropdown Schemas
export const DropdownItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.any().optional(), // React.ReactNode
  disabled: z.boolean().optional(),
  onClick: z.function().optional(),
  divider: z.boolean().optional(),
});

export const DropdownPropsSchema = ComponentPropsSchema.extend({
  items: z.array(DropdownItemSchema),
  trigger: z.any(), // React.ReactNode
  placement: z.enum(['top', 'bottom', 'left', 'right']).optional(),
  disabled: z.boolean().optional(),
});

// Tabs Schemas
export const TabItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  content: z.any(), // React.ReactNode
  disabled: z.boolean().optional(),
  icon: z.any().optional(), // React.ReactNode
});

export const TabsPropsSchema = ComponentPropsSchema.extend({
  items: z.array(TabItemSchema),
  defaultActiveKey: z.string().optional(),
  activeKey: z.string().optional(),
  onChange: z.function().optional(),
  variant: z.enum(['default', 'pills', 'underline']).optional(),
});

// Accordion Schemas
export const AccordionItemSchema = z.object({
  key: z.string(),
  title: z.string(),
  content: z.any(), // React.ReactNode
  disabled: z.boolean().optional(),
  icon: z.any().optional(), // React.ReactNode
});

export const AccordionPropsSchema = ComponentPropsSchema.extend({
  items: z.array(AccordionItemSchema),
  defaultOpenKeys: z.array(z.string()).optional(),
  openKeys: z.array(z.string()).optional(),
  onChange: z.function().optional(),
  multiple: z.boolean().optional(),
});

// Card Schemas
export const CardPropsSchema = ComponentPropsSchema.extend({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  header: z.any().optional(), // React.ReactNode
  footer: z.any().optional(), // React.ReactNode
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  variant: z.enum(['default', 'outlined', 'elevated']).optional(),
  padding: z.union([z.string(), z.number()]).optional(),
});

// Badge Schemas
export const BadgeVariantSchema = z.enum(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']);
export const BadgeSizeSchema = z.enum(['sm', 'md', 'lg']);
export const BadgePropsSchema = ComponentPropsSchema.extend({
  variant: BadgeVariantSchema.optional(),
  size: BadgeSizeSchema.optional(),
  content: z.union([z.string(), z.number()]),
  max: z.number().optional(),
  dot: z.boolean().optional(),
});

// Avatar Schemas
export const AvatarSizeSchema = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);
export const AvatarPropsSchema = ComponentPropsSchema.extend({
  src: z.string().optional(),
  alt: z.string().optional(),
  size: AvatarSizeSchema.optional(),
  fallback: z.string().optional(),
  shape: z.enum(['circle', 'square']).optional(),
});

// Progress Schemas
export const ProgressPropsSchema = ComponentPropsSchema.extend({
  value: z.number(),
  max: z.number().optional(),
  min: z.number().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  variant: z.enum(['default', 'success', 'warning', 'error']).optional(),
  showValue: z.boolean().optional(),
  animated: z.boolean().optional(),
});

// Switch Schemas
export const SwitchPropsSchema = ComponentPropsSchema.extend({
  checked: z.boolean(),
  onChange: z.function(),
  disabled: z.boolean().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
});

// Checkbox Schemas
export const CheckboxPropsSchema = ComponentPropsSchema.extend({
  checked: z.boolean(),
  onChange: z.function(),
  disabled: z.boolean().optional(),
  indeterminate: z.boolean().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
});

// Radio Schemas
export const RadioPropsSchema = ComponentPropsSchema.extend({
  checked: z.boolean(),
  onChange: z.function(),
  disabled: z.boolean().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  value: z.any(),
});

// Select Schemas
export const SelectOptionSchema = z.object({
  value: z.any(),
  label: z.string(),
  disabled: z.boolean().optional(),
  icon: z.any().optional(), // React.ReactNode
});

export const SelectPropsSchema = ComponentPropsSchema.extend({
  options: z.array(SelectOptionSchema),
  value: z.any().optional(),
  onChange: z.function().optional(),
  placeholder: z.string().optional(),
  disabled: z.boolean().optional(),
  multiple: z.boolean().optional(),
  searchable: z.boolean().optional(),
  clearable: z.boolean().optional(),
});

// Textarea Schemas
export const TextareaPropsSchema = ComponentPropsSchema.extend({
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  rows: z.number().optional(),
  cols: z.number().optional(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  autoResize: z.boolean().optional(),
  onChange: z.function().optional(),
  onBlur: z.function().optional(),
  onFocus: z.function().optional(),
});

// File Input Schemas
export const FileInputPropsSchema = ComponentPropsSchema.extend({
  accept: z.string().optional(),
  multiple: z.boolean().optional(),
  maxSize: z.number().optional(),
  onFileSelect: z.function().optional(),
  dragAndDrop: z.boolean().optional(),
  preview: z.boolean().optional(),
});

// Date Picker Schemas
export const DatePickerPropsSchema = ComponentPropsSchema.extend({
  value: z.date().optional(),
  onChange: z.function().optional(),
  placeholder: z.string().optional(),
  format: z.string().optional(),
  disabled: z.boolean().optional(),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  range: z.boolean().optional(),
});

// Time Picker Schemas
export const TimePickerPropsSchema = ComponentPropsSchema.extend({
  value: z.string().optional(),
  onChange: z.function().optional(),
  placeholder: z.string().optional(),
  format: z.enum(['12h', '24h']).optional(),
  disabled: z.boolean().optional(),
  minTime: z.string().optional(),
  maxTime: z.string().optional(),
});

// Color Picker Schemas
export const ColorPickerPropsSchema = ComponentPropsSchema.extend({
  value: z.string().optional(),
  onChange: z.function().optional(),
  presetColors: z.array(z.string()).optional(),
  format: z.enum(['hex', 'rgb', 'hsl']).optional(),
  disabled: z.boolean().optional(),
});

// Slider Schemas
export const SliderPropsSchema = ComponentPropsSchema.extend({
  value: z.union([z.number(), z.array(z.number())]),
  onChange: z.function().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  disabled: z.boolean().optional(),
  range: z.boolean().optional(),
  marks: z.array(z.object({
    value: z.number(),
    label: z.string(),
  })).optional(),
});

// Rating Schemas
export const RatingPropsSchema = ComponentPropsSchema.extend({
  value: z.number(),
  onChange: z.function().optional(),
  max: z.number().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  character: z.any().optional(), // React.ReactNode
});

// Tree Schemas
export const TreeNodeSchema: z.ZodType<any> = z.object({
  key: z.string(),
  title: z.string(),
  children: z.array(z.lazy(() => TreeNodeSchema)).optional(),
  disabled: z.boolean().optional(),
  icon: z.any().optional(), // React.ReactNode
});

export const TreePropsSchema = ComponentPropsSchema.extend({
  data: z.array(TreeNodeSchema),
  defaultExpandedKeys: z.array(z.string()).optional(),
  expandedKeys: z.array(z.string()).optional(),
  onExpand: z.function().optional(),
  onSelect: z.function().optional(),
  checkable: z.boolean().optional(),
  selectable: z.boolean().optional(),
});

// Transfer Schemas
export const TransferItemSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  disabled: z.boolean().optional(),
});

export const TransferPropsSchema = ComponentPropsSchema.extend({
  dataSource: z.array(TransferItemSchema),
  targetKeys: z.array(z.string()),
  onChange: z.function().optional(),
  titles: z.array(z.string()).optional(),
  disabled: z.boolean().optional(),
  showSearch: z.boolean().optional(),
  showSelectAll: z.boolean().optional(),
});

// Upload Schemas
export const UploadFileSchema = z.object({
  uid: z.string(),
  name: z.string(),
  status: z.enum(['uploading', 'done', 'error', 'removed']).optional(),
  url: z.string().optional(),
  thumbUrl: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
});

export const UploadPropsSchema = ComponentPropsSchema.extend({
  fileList: z.array(UploadFileSchema).optional(),
  onChange: z.function().optional(),
  beforeUpload: z.function().optional(),
  customRequest: z.function().optional(),
  accept: z.string().optional(),
  multiple: z.boolean().optional(),
  maxCount: z.number().optional(),
  disabled: z.boolean().optional(),
  dragAndDrop: z.boolean().optional(),
});

// Calendar Schemas
export const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const CalendarPropsSchema = ComponentPropsSchema.extend({
  events: z.array(CalendarEventSchema).optional(),
  onEventClick: z.function().optional(),
  onDateClick: z.function().optional(),
  view: z.enum(['month', 'week', 'day']).optional(),
  defaultDate: z.date().optional(),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
  editable: z.boolean().optional(),
  selectable: z.boolean().optional(),
});

// Timeline Schemas
export const TimelineItemSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  time: z.string().optional(),
  icon: z.any().optional(), // React.ReactNode
  color: z.string().optional(),
  status: z.enum(['pending', 'processing', 'success', 'error']).optional(),
});

export const TimelinePropsSchema = ComponentPropsSchema.extend({
  items: z.array(TimelineItemSchema),
  mode: z.enum(['left', 'right', 'alternate']).optional(),
  pending: z.any().optional(), // React.ReactNode
});

// Steps Schemas
export const StepItemSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.any().optional(), // React.ReactNode
  status: z.enum(['wait', 'process', 'finish', 'error']).optional(),
  disabled: z.boolean().optional(),
});

export const StepsPropsSchema = ComponentPropsSchema.extend({
  items: z.array(StepItemSchema),
  current: z.number().optional(),
  onChange: z.function().optional(),
  direction: z.enum(['horizontal', 'vertical']).optional(),
  size: z.enum(['default', 'small']).optional(),
  status: z.enum(['wait', 'process', 'finish', 'error']).optional(),
});

// Divider Schemas
export const DividerPropsSchema = ComponentPropsSchema.extend({
  type: z.enum(['horizontal', 'vertical']).optional(),
  orientation: z.enum(['left', 'right', 'center']).optional(),
  dashed: z.boolean().optional(),
  plain: z.boolean().optional(),
});

// Space Schemas
export const SpacePropsSchema = ComponentPropsSchema.extend({
  direction: z.enum(['horizontal', 'vertical']).optional(),
  size: z.union([z.number(), z.enum(['small', 'middle', 'large'])]).optional(),
  align: z.enum(['start', 'end', 'center', 'baseline']).optional(),
  wrap: z.boolean().optional(),
});

// Grid Schemas
export const GridColPropsSchema = ComponentPropsSchema.extend({
  span: z.number().optional(),
  offset: z.number().optional(),
  order: z.number().optional(),
  push: z.number().optional(),
  pull: z.number().optional(),
  xs: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
  sm: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
  md: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
  lg: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
  xl: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
  xxl: z.union([z.number(), z.object({ span: z.number(), offset: z.number().optional() })]).optional(),
});

export const GridRowPropsSchema = ComponentPropsSchema.extend({
  gutter: z.union([z.number(), z.array(z.number())]).optional(),
  justify: z.enum(['start', 'end', 'center', 'space-around', 'space-between']).optional(),
  align: z.enum(['top', 'middle', 'bottom']).optional(),
  wrap: z.boolean().optional(),
});

// Layout Schemas
export const LayoutPropsSchema = ComponentPropsSchema.extend({
  hasSider: z.boolean().optional(),
});

export const LayoutHeaderPropsSchema = ComponentPropsSchema.extend({
  height: z.union([z.string(), z.number()]).optional(),
  fixed: z.boolean().optional(),
});

export const LayoutSiderPropsSchema = ComponentPropsSchema.extend({
  width: z.union([z.string(), z.number()]).optional(),
  collapsed: z.boolean().optional(),
  onCollapse: z.function().optional(),
  trigger: z.any().optional(), // React.ReactNode
  breakpoint: z.enum(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']).optional(),
});

export const LayoutContentPropsSchema = ComponentPropsSchema.extend({
  padding: z.union([z.string(), z.number()]).optional(),
});

export const LayoutFooterPropsSchema = ComponentPropsSchema.extend({
  height: z.union([z.string(), z.number()]).optional(),
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

// Hook Return Type Schemas
export const UseStateReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.tuple([valueSchema, z.function().args(valueSchema).returns(z.void())]);

export const UseEffectReturnSchema = z.undefined();

export const UseCallbackReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.function().returns(valueSchema);

export const UseMemoReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  valueSchema;

export const UseRefReturnSchema = <T extends z.ZodTypeAny>(instanceSchema: T) =>
  z.object({
    current: z.union([instanceSchema, z.null()]),
  });

export const UseLocalStorageReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.tuple([valueSchema, z.function(), z.function()]);

export const UseDebounceReturnSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.tuple([valueSchema, z.function()]);

export const UseIntersectionObserverReturnSchema = z.object({
  ref: z.function(),
  inView: z.boolean(),
  entry: z.any().optional(), // IntersectionObserverEntry
});

export const UseClickOutsideReturnSchema = z.object({
  ref: z.function(),
});

export const UseHoverReturnSchema = z.tuple([z.boolean(), z.object({
  onMouseEnter: z.function(),
  onMouseLeave: z.function(),
})]);

export const UseKeyPressReturnSchema = z.boolean();

// Ref Schemas
export const RefCallbackSchema = <T extends z.ZodTypeAny>(instanceSchema: T) =>
  z.function().args(z.union([instanceSchema, z.null()]));

export const RefObjectSchema = <T extends z.ZodTypeAny>(instanceSchema: T) =>
  z.object({
    current: z.union([instanceSchema, z.null()]),
  }); 