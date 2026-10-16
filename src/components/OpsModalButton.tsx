import type { ButtonHTMLAttributes, ReactNode } from "react";

export type OpsModalButtonAppearance = "primary" | "secondary" | "danger";

export interface OpsModalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-test-id"?: string;
  appearance?: OpsModalButtonAppearance;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  dataTestId?: string;
}

export function OpsModalButton({
  appearance = "secondary",
  startIcon,
  endIcon,
  dataTestId,
  className,
  children,
  "data-test-id": dataTestIdAttribute,
  ...buttonProps
}: Readonly<OpsModalButtonProps>): JSX.Element {
  return (
    <button
      {...buttonProps}
      className={["ops-modal-button", `ops-modal-button--${appearance}`, className]
        .filter(Boolean)
        .join(" ")}
      data-test-id={dataTestId ?? dataTestIdAttribute}
    >
      {startIcon && <span className="ops-modal-button__icon">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="ops-modal-button__icon">{endIcon}</span>}
    </button>
  );
}

export default OpsModalButton;
