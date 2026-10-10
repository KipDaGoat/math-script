import { cloneElement } from "react"
import "./Badge.css"

type BadgeProps = {
    variant?: BadgeVariant
    size?: BadgeSize
    icon?: React.JSX.Element
    iconPosition?: BadgeIconPosition
} & React.ComponentProps<"span">

type BadgeVariant = "default" | "weak" | "primary" | "secondary" | "outline" | "ghost"

type BadgeSize = "s" | "m" | "l"

type BadgeIconPosition = "start" | "end"

export default function Badge({
    variant = "default",
    size = "m",
    icon,
    iconPosition = "start",
    className,
    children,
    ...props
}: BadgeProps): React.JSX.Element {
    const iconElement = icon == null ? null : cloneElement(icon, { className: "_icon" })

    return (
        <span
            {...props}
            className={`c-badge ${className ?? ""}`}
            data-variant={variant}
            data-size={size}
            data-icon-position={iconPosition}
        >
            {iconPosition === "start" ? [iconElement, children] : [children, iconElement]}
        </span>
    )
}
