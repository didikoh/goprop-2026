import { type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" ;

export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: ButtonType;
}
