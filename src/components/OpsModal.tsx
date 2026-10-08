import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type OpsModalCloseReason = "backdropClick" | "escapeKeyDown" | "closeButtonClick";
export type OpsModalMaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | false;

export interface OpsModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClose" | "title"> {
  open: boolean;
  onClose?: (event: {}, reason: OpsModalCloseReason) => void;
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  closeButtonLabel?: string;
  maxWidth?: OpsModalMaxWidth;
  fullWidth?: boolean;
  fullScreen?: boolean;
  closeOnBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  disablePortal?: boolean;
  surfaceClassName?: string;
  backdropClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
  PaperProps?: HTMLAttributes<HTMLDivElement>;
}

export interface OpsModalSectionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  dividers?: boolean;
  disableSpacing?: boolean;
}

const joinClasses = (...classes: Array<string | undefined | false>): string =>
  classes.filter(Boolean).join(" ");

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let activeModalCount = 0;
let bodyOverflowBeforeModal = "";

export const OpsModal = forwardRef<HTMLDivElement, OpsModalProps>(
  function OpsModal(
    {
      open,
      onClose,
      children,
      title,
      subtitle,
      closeButtonLabel = "Close dialog",
      maxWidth = "md",
      fullWidth = false,
      fullScreen = false,
      closeOnBackdropClick = true,
      disableEscapeKeyDown = false,
      hideBackdrop = false,
      keepMounted = false,
      disablePortal = false,
      className,
      surfaceClassName,
      backdropClassName,
      headerClassName,
      titleClassName,
      closeButtonClassName,
      PaperProps,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      onKeyDown,
      ...rootProps
    },
    forwardedRef,
  ): JSX.Element | null {
    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const titleId = useId();
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const surfaceClasses = joinClasses(
      "ops-modal__surface",
      "MuiDialog-paper",
      PaperProps?.className,
      surfaceClassName,
    );
    const labelledBy = ariaLabelledBy ?? (title != null ? titleId : undefined);

    useEffect(() => {
      if (!open || typeof document === "undefined") return undefined;

      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      if (activeModalCount === 0) {
        bodyOverflowBeforeModal = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
      activeModalCount += 1;

      const focusTarget = surfaceRef.current?.querySelector<HTMLElement>(
        "[data-ops-modal-autofocus], input[autofocus], textarea[autofocus], select[autofocus], button[autofocus]",
      ) ?? surfaceRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? surfaceRef.current;
      focusTarget?.focus({ preventScroll: true });

      return () => {
        activeModalCount = Math.max(0, activeModalCount - 1);
        if (activeModalCount === 0) document.body.style.overflow = bodyOverflowBeforeModal;
        previousFocusRef.current?.focus({ preventScroll: true });
      };
    }, [open]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        if (!disableEscapeKeyDown && onClose) {
          event.preventDefault();
          onClose(event, "escapeKeyDown");
        }
        return;
      }

      if (event.key !== "Tab" || !surfaceRef.current) return;
      const focusableItems = Array.from(
        surfaceRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);
      if (focusableItems.length === 0) {
        event.preventDefault();
        surfaceRef.current.focus();
        return;
      }

      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    if ((!open && !keepMounted) || typeof document === "undefined") return null;

    const modal = (
      <div
        {...rootProps}
        ref={forwardedRef}
        className={joinClasses("ops-modal", "MuiDialog-root", className)}
        hidden={!open}
        aria-hidden={!open || undefined}
        data-open={open ? "true" : "false"}
        data-hide-backdrop={hideBackdrop ? "true" : undefined}
        onClick={(event) => {
          if (event.target === event.currentTarget && closeOnBackdropClick && onClose) {
            onClose(event, "backdropClick");
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <div
          className={joinClasses("ops-modal__backdrop", "MuiBackdrop-root", backdropClassName)}
          aria-hidden="true"
        />
        <div
          {...PaperProps}
          ref={(element) => {
            surfaceRef.current = element;
          }}
          className={surfaceClasses}
          style={PaperProps?.style}
          data-max-width={maxWidth === false ? "none" : maxWidth}
          data-full-width={fullWidth ? "true" : undefined}
          data-full-screen={fullScreen ? "true" : undefined}
          role="dialog"
          aria-modal={open ? "true" : undefined}
          aria-label={ariaLabel ?? (labelledBy ? undefined : "Dialog")}
          aria-labelledby={labelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={-1}
        >
          {title != null && (
            <OpsModalHeader id={titleId} className={headerClassName}>
              <div className="ops-modal__heading">
                <h2 className={titleClassName}>{title}</h2>
                {subtitle != null && <p>{subtitle}</p>}
              </div>
              {onClose && (
                <button
                  type="button"
                  className={joinClasses("ops-modal__close", closeButtonClassName)}
                  aria-label={closeButtonLabel}
                  onClick={(event) => onClose(event, "closeButtonClick")}
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </OpsModalHeader>
          )}
          {children}
        </div>
      </div>
    );

    return disablePortal ? modal : createPortal(modal, document.body);
  },
);

export const OpsModalHeader = forwardRef<HTMLDivElement, OpsModalSectionProps>(
  function OpsModalHeader({ className, children, ...props }, ref): JSX.Element {
    return (
      <div
        {...props}
        ref={ref}
        className={joinClasses("ops-modal__header", "MuiDialogTitle-root", className)}
      >
        {children}
      </div>
    );
  },
);

export const OpsModalContent = forwardRef<HTMLDivElement, OpsModalSectionProps>(
  function OpsModalContent({ className, dividers, children, ...props }, ref): JSX.Element {
    return (
      <div
        {...props}
        ref={ref}
        className={joinClasses(
          "ops-modal__body",
          "MuiDialogContent-root",
          dividers && "ops-modal__body--dividers",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export const OpsModalActions = forwardRef<HTMLDivElement, OpsModalSectionProps>(
  function OpsModalActions({ className, disableSpacing, children, ...props }, ref): JSX.Element {
    return (
      <div
        {...props}
        ref={ref}
        className={joinClasses(
          "ops-modal__footer",
          "MuiDialogActions-root",
          disableSpacing && "ops-modal__footer--compact",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export const OpsModalContentText = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function OpsModalContentText({ className, ...props }, ref): JSX.Element {
    return (
      <p
        {...props}
        ref={ref}
        className={joinClasses("ops-modal__content-text", "MuiDialogContentText-root", className)}
      />
    );
  },
);

OpsModal.displayName = "OpsModal";
OpsModalHeader.displayName = "OpsModalHeader";
OpsModalContent.displayName = "OpsModalContent";
OpsModalActions.displayName = "OpsModalActions";
OpsModalContentText.displayName = "OpsModalContentText";
