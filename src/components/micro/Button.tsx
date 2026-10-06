import React, { cloneElement } from "react"
import "./Button.css"

type ButtonProps =
    | ({
          isLink?: undefined | null
          variant?: ButtonVariant
          size?: ButtonSize
          isIcon?: boolean
          render?: React.JSX.Element
      } & React.ComponentProps<"button">)
    | ({
          isLink: true
          variant?: ButtonVariant
          size?: ButtonSize
          isIcon?: boolean
          render?: React.JSX.Element
      } & React.ComponentProps<"a">)

type ButtonSize = "xs" | "s" | "m" | "l" | "xl"

type ButtonVariant =
    | "default"
    | "ghost"
    | "outline"
    | "secondary"
    | "secondary-outline"
    | "primary"
    | "primary-outline"
    | "weak"
    | "link"
    | "link-primary"
    | "link-secondary"

export default function Button({
    isLink,
    variant = "default",
    size = "m",
    isIcon = false,
    render,
    className,
    type,
    ...props
}: ButtonProps): React.JSX.Element {
    if (render != null)
        return cloneElement(render, {
            "className": `c-button ${render.props?.className ?? ""}`,
            "data-variant": variant,
            "data-size": size,
            "data-is-icon": isIcon,
            ...props
        })
    if (!isLink)
        return (
            <button
                {...(props as React.ComponentProps<"button">)}
                className={`c-button ${className ?? ""}`}
                type={type ?? "button"}
                data-variant={variant}
                data-size={size}
                data-is-icon={isIcon}
            />
        )
    return (
        <a
            {...(props as React.ComponentProps<"a">)}
            className={`c-button ${className ?? ""}`}
            data-variant={variant}
            data-size={size}
            data-is-icon={isIcon}
        />
    )
}
