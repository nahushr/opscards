import type { ReactNode } from "react";
import {
  OpsModal,
  OpsModalActions,
  OpsModalContent,
} from "./OpsModal";

export interface OpsModalDialogClassNames {
  paper?: string;
  header?: string;
  title?: string;
  subtitle?: string;
  closeButton?: string;
  content?: string;
  actions?: string;
}

export interface OpsModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
  closeButtonLabel?: string;
  closeButtonTestId?: string;
  disableCloseButton?: boolean;
  dataTestId?: string;
  classNames?: OpsModalDialogClassNames;
}

/** Opinionated OpsCards dialog shell for forms, previews, and confirmations. */
export function OpsModalDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  closeButtonLabel = "Close dialog",
  closeButtonTestId,
  disableCloseButton = false,
  dataTestId,
  classNames = {},
}: Readonly<OpsModalDialogProps>): JSX.Element {
  return (
    <OpsModal
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      title={title}
      subtitle={subtitle}
      closeButtonLabel={closeButtonLabel}
      closeButtonTestId={closeButtonTestId}
      hideCloseButton={disableCloseButton}
      surfaceClassName={classNames.paper}
      headerClassName={classNames.header}
      titleClassName={classNames.title}
      subtitleClassName={classNames.subtitle}
      closeButtonClassName={classNames.closeButton}
      data-test-id={dataTestId}
    >
      <OpsModalContent className={classNames.content}>{children}</OpsModalContent>
      {actions != null && (
        <OpsModalActions className={classNames.actions}>{actions}</OpsModalActions>
      )}
    </OpsModal>
  );
}

export default OpsModalDialog;
