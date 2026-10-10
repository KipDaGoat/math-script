import { cloneElement, useEffect, useRef, type MouseEvent } from "react"
import "./Card.css"

type CardProps = {
    variant?: CardVariant
    size?: CardSize
    cardTitle?: React.JSX.Element | string
    description?: React.JSX.Element | string
    action?: React.JSX.Element
    footer?: React.JSX.Element
    img?: React.JSX.Element
    imgRatio?: `${number}` | `${number} / ${number}`
    shine?: CardShine
} & React.ComponentProps<"div">

type CardVariant = "default" | "gradient" | "outline"

type CardSize = "xs" | "s" | "m" | "l" | "xl" | "auto"

type CardShine = "primary" | "secondary"

export default function Card({
    variant = "default",
    size = "m",
    shine,
    cardTitle,
    description,
    action,
    footer,
    img,
    imgRatio,
    className,
    children,
    ...props
}: CardProps): React.JSX.Element {
    const ref = useRef<HTMLElement>(null)
    const titleId =
        cardTitle != null && typeof cardTitle !== "string" && cardTitle.props?.id != null
            ? (cardTitle.props.id as string)
            : crypto.randomUUID()

    function handleMouseMove(event: MouseEvent) {
        const card = ref.current
        if (card == null) return

        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        requestAnimationFrame(() => {
            card.style.setProperty("--_shine-x", x + "px")
            card.style.setProperty("--_shine-y", y + "px")
        })
    }

    function handleMouseEnter() {
        const card = ref.current
        if (card == null) return

        card.dataset.shineActive = "true"
    }

    function handleMouseLeave() {
        const card = ref.current
        if (card == null) return

        card.dataset.shineActive = "false"
    }

    useEffect(() => {
        if (imgRatio == null) return

        const imgElement = ref.current?.querySelector<HTMLImageElement>("._img")
        if (imgElement == null) return

        imgElement.style.aspectRatio = imgRatio
    })

    const titleElement = getElementFromAttr(cardTitle, "_title", <p key={crypto.randomUUID()} id={titleId} />)
    const descriptionElement = getElementFromAttr(description, "_description", <p key={crypto.randomUUID()} />)
    const actionElement = getElementFromAttr(action, "_action")
    const footerElement = footer == null ? null : <footer className="_footer">{footer}</footer>
    const imgElement = img == null ? null : cloneElement(img, { className: `_img ${img?.props?.className ?? ""}` })

    const headerElement =
        titleElement == null ? null : (
            <header key={crypto.randomUUID()} className="_header">
                <div className="_title-col">{[titleElement, descriptionElement]}</div>
                {actionElement}
            </header>
        )

    return (
        <article
            {...props}
            className={`c-card ${className ?? ""}`}
            ref={ref}
            aria-labelledby={cardTitle != null ? titleId : undefined}
            data-variant={variant}
            data-size={size}
            data-shine={shine ?? "none"}
            onMouseMove={shine == null ? undefined : handleMouseMove}
            onMouseEnter={shine == null ? undefined : handleMouseEnter}
            onMouseLeave={shine == null ? undefined : handleMouseLeave}
        >
            {[imgElement, headerElement]}
            <div className="_content">{children}</div>
            {footerElement}
        </article>
    )
}

function getElementFromAttr(
    attr: React.JSX.Element | undefined | string,
    elementClass: string,
    strWrapper?: React.JSX.Element
): React.JSX.Element | null {
    if (attr == null) return null
    if (typeof attr === "string")
        return strWrapper == null
            ? null
            : cloneElement(strWrapper, {
                  className: `${elementClass} ${strWrapper.props?.className ?? ""}`,
                  children: attr
              })
    return cloneElement(attr, { className: `${elementClass} ${attr.props?.className ?? ""}` })
}
