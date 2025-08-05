// Calendar UI Enums
export enum CalendarView {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  AGENDA = 'agenda'
}

// Activity Type Enums
export enum ActivityType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  COMPLETED = 'completed',
  ASSIGNED = 'assigned',
  COMMENTED = 'commented',
  UPLOADED = 'uploaded',
  LOGGED_IN = 'logged-in',
  LOGGED_OUT = 'logged-out'
}

// Form Field Type Enums
export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DATE = 'date',
  DATETIME = 'datetime',
  FILE = 'file',
  TOGGLE = 'toggle'
}

// Button Variant Enums
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  DESTRUCTIVE = 'destructive'
}

export enum ButtonSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg'
}

// Input Type Enums
export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEL = 'tel',
  URL = 'url'
}

export enum InputSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg'
}

// Modal Size Enums
export enum ModalSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  FULL = 'full'
}

// Confirm Dialog Variant Enums
export enum ConfirmDialogVariant {
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info'
}

// Theme Mode Enums
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum BorderRadius {
  NONE = 'none',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum Spacing {
  COMPACT = 'compact',
  COMFORTABLE = 'comfortable',
  SPACIOUS = 'spacious'
}

// Chart Type Enums
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DONUT = 'donut',
  AREA = 'area',
  SCATTER = 'scatter'
}

// Toast Type Enums
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Table Action Variant Enums
export enum TableActionVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger'
}

// Table Column Alignment Enums
export enum TableColumnAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

// Filter Option Type Enums
export enum FilterOptionType {
  TEXT = 'text',
  SELECT = 'select',
  DATE = 'date',
  NUMBER = 'number',
  BOOLEAN = 'boolean'
}

// File Upload Status Enums
export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  ERROR = 'error'
}

// Animation Type Enums
export enum AnimationType {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale',
  ROTATE = 'rotate',
  BOUNCE = 'bounce'
}

export enum AnimationDirection {
  IN = 'in',
  OUT = 'out',
  BOTH = 'both'
}

export enum AnimationFillMode {
  NONE = 'none',
  FORWARDS = 'forwards',
  BACKWARDS = 'backwards',
  BOTH = 'both'
}

export enum AnimationPlayState {
  RUNNING = 'running',
  PAUSED = 'paused'
}

// Breakpoint Enums
export enum Breakpoint {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl'
}

// Layout Direction Enums
export enum LayoutDirection {
  LTR = 'ltr',
  RTL = 'rtl'
}

// Flex Direction Enums
export enum FlexDirection {
  ROW = 'row',
  COLUMN = 'column',
  ROW_REVERSE = 'row-reverse',
  COLUMN_REVERSE = 'column-reverse'
}

// Justify Content Enums
export enum JustifyContent {
  FLEX_START = 'flex-start',
  FLEX_END = 'flex-end',
  CENTER = 'center',
  SPACE_BETWEEN = 'space-between',
  SPACE_AROUND = 'space-around',
  SPACE_EVENLY = 'space-evenly'
}

// Align Items Enums
export enum AlignItems {
  FLEX_START = 'flex-start',
  FLEX_END = 'flex-end',
  CENTER = 'center',
  BASELINE = 'baseline',
  STRETCH = 'stretch'
}

// Position Enums
export enum Position {
  STATIC = 'static',
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
  FIXED = 'fixed',
  STICKY = 'sticky'
}

// Display Enums
export enum Display {
  BLOCK = 'block',
  INLINE = 'inline',
  INLINE_BLOCK = 'inline-block',
  FLEX = 'flex',
  GRID = 'grid',
  NONE = 'none'
}

// Overflow Enums
export enum Overflow {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  SCROLL = 'scroll',
  AUTO = 'auto'
}

// Cursor Enums
export enum Cursor {
  AUTO = 'auto',
  DEFAULT = 'default',
  POINTER = 'pointer',
  TEXT = 'text',
  MOVE = 'move',
  NOT_ALLOWED = 'not-allowed',
  WAIT = 'wait',
  HELP = 'help',
  CROSSHAIR = 'crosshair',
  GRAB = 'grab',
  GRABBING = 'grabbing'
}

// User Select Enums
export enum UserSelect {
  AUTO = 'auto',
  NONE = 'none',
  TEXT = 'text',
  ALL = 'all',
  CONTAIN = 'contain'
}

// Text Align Enums
export enum TextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFY = 'justify'
}

// Text Transform Enums
export enum TextTransform {
  NONE = 'none',
  CAPITALIZE = 'capitalize',
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase'
}

// Text Decoration Enums
export enum TextDecoration {
  NONE = 'none',
  UNDERLINE = 'underline',
  OVERLINE = 'overline',
  LINE_THROUGH = 'line-through'
}

// Border Style Enums
export enum BorderStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
  NONE = 'none'
}

// Font Weight Enums
export enum FontWeight {
  NORMAL = 'normal',
  BOLD = 'bold',
  BOLDER = 'bolder',
  LIGHTER = 'lighter'
}

// Z-Index Enums
export enum ZIndex {
  AUTO = 'auto'
}

// Transition Timing Function Enums
export enum TransitionTimingFunction {
  EASE = 'ease',
  LINEAR = 'linear',
  EASE_IN = 'ease-in',
  EASE_OUT = 'ease-out',
  EASE_IN_OUT = 'ease-in-out'
} 