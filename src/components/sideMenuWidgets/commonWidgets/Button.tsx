import type { ButtonProps } from "./Button.types";

const Button = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) => {
  const baseClass = "btn2";
  const variantClass = `btn2--${variant}`;
  const disabledClass = disabled ? "btn2--disabled" : "";

  const classes = [baseClass, variantClass, disabledClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
