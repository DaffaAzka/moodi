import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const PIXEL_ICON_NAMES = [
  // Core Wellbeing & Check-in
  "sleep",
  "energy",
  "mood",
  "stress",
  "breathe",
  "calm",
  "sun",
  "moon",
  "theme",

  // Navigation & Core App
  "home",
  "book",
  "timer",
  "chart",
  "support",
  "user",
  "logout",

  // Actions & States
  "check",
  "check-circle",
  "close",
  "search",
  "edit",
  "trash",
  "copy",
  "refresh",
  "plus",
  "minus",
  "save",

  // Arrows & Direction
  "arrow-right",
  "arrow-left",
  "arrow-up",
  "arrow-down",
  "chevron-right",
  "chevron-left",
  "chevron-down",
  "chevron-up",

  // Feedback & Information
  "info",
  "warning",
  "bulb",
  "sparkle",
  "target",
  "thought",
  "sprout",
  "heart",
  "phone",
  "pin",
  "trending",
  "link",
  "external-link",

  // Editor Blocks & Tools
  "list",
  "list-ordered",
  "list-check",
  "quote",
  "code",
  "table",
  "heading-1",
  "heading-2",
  "heading-3",
  "collapse",
  "expand",
  "paragraph",
  "divider",

  // Sensory Grounding
  "eye",
  "hand",
  "ear",
  "nose",
  "taste",
] as const;

export type PixelIconName = (typeof PIXEL_ICON_NAMES)[number];

const ICON_CLASS_MAP: Record<
  PixelIconName,
  { regular: string; solid?: string }
> = {
  // Wellbeing
  sleep: { regular: "hn-moon", solid: "hn-moon-solid" },
  energy: { regular: "hn-bolt", solid: "hn-bolt-solid" },
  mood: { regular: "hn-face-grin", solid: "hn-face-grin-solid" },
  stress: { regular: "hn-face-thinking", solid: "hn-face-thinking-solid" },
  breathe: { regular: "hn-circle-notch", solid: "hn-circle-notch-solid" },
  calm: { regular: "hn-seedlings", solid: "hn-seedlings-solid" },
  sun: { regular: "hn-sun", solid: "hn-sun-solid" },
  moon: { regular: "hn-moon", solid: "hn-moon-solid" },
  theme: { regular: "hn-themes", solid: "hn-themes-solid" },

  // Navigation
  home: { regular: "hn-home", solid: "hn-home-solid" },
  book: { regular: "hn-book", solid: "hn-book-solid" },
  timer: { regular: "hn-clock", solid: "hn-clock-solid" },
  chart: { regular: "hn-chart-line", solid: "hn-chart-line-solid" },
  support: { regular: "hn-heart", solid: "hn-heart-solid" },
  user: { regular: "hn-user", solid: "hn-user-solid" },
  logout: { regular: "hn-logout", solid: "hn-logout-solid" },

  // Actions
  check: { regular: "hn-check", solid: "hn-check-solid" },
  "check-circle": { regular: "hn-check-circle", solid: "hn-check-circle-solid" },
  close: { regular: "hn-times", solid: "hn-times-solid" },
  search: { regular: "hn-search", solid: "hn-search-solid" },
  edit: { regular: "hn-pencil", solid: "hn-pencil-solid" },
  trash: { regular: "hn-trash", solid: "hn-trash-solid" },
  copy: { regular: "hn-copy", solid: "hn-copy-solid" },
  refresh: { regular: "hn-refresh", solid: "hn-refresh-solid" },
  plus: { regular: "hn-plus", solid: "hn-plus-solid" },
  minus: { regular: "hn-minus", solid: "hn-minus-solid" },
  save: { regular: "hn-save", solid: "hn-save-solid" },

  // Arrows
  "arrow-right": { regular: "hn-arrow-right", solid: "hn-arrow-right-solid" },
  "arrow-left": { regular: "hn-arrow-left", solid: "hn-arrow-left-solid" },
  "arrow-up": { regular: "hn-arrow-up", solid: "hn-arrow-up-solid" },
  "arrow-down": { regular: "hn-arrow-down", solid: "hn-arrow-down-solid" },
  "chevron-right": { regular: "hn-angle-right", solid: "hn-angle-right-solid" },
  "chevron-left": { regular: "hn-angle-left", solid: "hn-angle-left-solid" },
  "chevron-down": { regular: "hn-chevron-down", solid: "hn-chevron-down-solid" },
  "chevron-up": { regular: "hn-chevron-up", solid: "hn-chevron-up-solid" },

  // Feedback & Info
  info: { regular: "hn-info-circle", solid: "hn-info-circle-solid" },
  warning: { regular: "hn-exclamation-triangle", solid: "hn-exclamation-triangle-solid" },
  bulb: { regular: "hn-lightbulb", solid: "hn-lightbulb-solid" },
  sparkle: { regular: "hn-sparkles", solid: "hn-sparkles-solid" },
  target: { regular: "hn-badge-check", solid: "hn-badge-check-solid" },
  thought: { regular: "hn-face-thinking", solid: "hn-face-thinking-solid" },
  sprout: { regular: "hn-seedlings", solid: "hn-seedlings-solid" },
  heart: { regular: "hn-heart", solid: "hn-heart-solid" },
  phone: { regular: "hn-phone-ringing-high", solid: "hn-phone-ringing-high-solid" },
  pin: { regular: "hn-location-pin", solid: "hn-location-pin-solid" },
  trending: { regular: "hn-trending", solid: "hn-trending-solid" },
  link: { regular: "hn-link", solid: "hn-link-solid" },
  "external-link": { regular: "hn-external-link", solid: "hn-external-link-solid" },

  // Editor Blocks
  list: { regular: "hn-bullet-list", solid: "hn-bullet-list-solid" },
  "list-ordered": { regular: "hn-numbered-list", solid: "hn-numbered-list-solid" },
  "list-check": { regular: "hn-check-list", solid: "hn-check-list-solid" },
  quote: { regular: "hn-quote-left", solid: "hn-quote-left-solid" },
  code: { regular: "hn-code-block", solid: "hn-code-block-solid" },
  table: { regular: "hn-table", solid: "hn-table-solid" },
  "heading-1": { regular: "hn-h1", solid: "hn-heading-1-solid" },
  "heading-2": { regular: "hn-h2", solid: "hn-heading-2-solid" },
  "heading-3": { regular: "hn-h3", solid: "hn-heading-3-solid" },
  collapse: { regular: "hn-collapse", solid: "hn-collapse-solid" },
  expand: { regular: "hn-expand", solid: "hn-expand-solid" },
  paragraph: { regular: "hn-paragraph", solid: "hn-paragraph-solid" },
  divider: { regular: "hn-divider", solid: "hn-divider-solid" },

  // Sensory Grounding
  eye: { regular: "hn-eye", solid: "hn-eye-solid" },
  hand: { regular: "hn-handshake", solid: "hn-handshake-solid" },
  ear: { regular: "hn-headphones", solid: "hn-headphones-solid" },
  nose: { regular: "hn-cloud-fog", solid: "hn-cloud-fog-solid" },
  taste: { regular: "hn-box-heart", solid: "hn-box-heart-solid" },
};

export type PixelIconSize =
  | 10
  | 12
  | 14
  | 16
  | 18
  | 20
  | 22
  | 24
  | 32
  | 48
  | (number & {});

export interface PixelIconProps {
  name: PixelIconName;
  variant?: "regular" | "solid";
  size?: PixelIconSize;
  className?: string;
  ariaLabel?: string;
}

export const PixelIcon = forwardRef<HTMLElement, PixelIconProps>(
  function PixelIcon(
    { name, variant = "regular", size = 24, className, ariaLabel },
    ref,
  ) {
    const iconMeta = ICON_CLASS_MAP[name];
    const iconClass =
      variant === "solid" && iconMeta.solid
        ? iconMeta.solid
        : iconMeta.regular;

    const sizeClasses: Record<number, string> = {
      10: "text-[10px] leading-[10px] size-2.5",
      12: "text-[12px] leading-[12px] size-3",
      14: "text-[14px] leading-[14px] size-3.5",
      16: "text-[16px] leading-[16px] size-4",
      18: "text-[18px] leading-[18px] size-[18px]",
      20: "text-[20px] leading-[20px] size-5",
      22: "text-[22px] leading-[22px] size-[22px]",
      24: "text-[24px] leading-[24px] size-6",
      32: "text-[32px] leading-[32px] size-8",
      48: "text-[48px] leading-[48px] size-12",
    };

    const isDecorative = !ariaLabel;

    return (
      <i
        aria-hidden={isDecorative ? "true" : undefined}
        aria-label={ariaLabel}
        className={cn(
          "hn inline-flex items-center justify-center shrink-0 align-middle select-none",
          iconClass,
          sizeClasses[size] ?? sizeClasses[24],
          className,
        )}
        ref={ref}
        role={isDecorative ? undefined : "img"}
      />
    );
  },
);
