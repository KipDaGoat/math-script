type FeedbackBtnProps = {
    defaultText: string
    successText: string
    errorText: string
    onClick: () => boolean
} & Omit<React.ComponentProps<"button">, "children" | "onClick">

export default function FeedbackBtn({
    defaultText,
    successText,
    errorText,
    className,
    type,
    onClick,
    ...props
}: FeedbackBtnProps) {
    return (
        <button
            {...props}
            className={`c-feedback-btn ${className ?? ""}`}
            type={type ?? "button"}
            onClick={event => {
                const text = onClick() ? successText : errorText
                const btnElement = event.currentTarget
                btnElement.innerText = text
                setTimeout(() => (btnElement.innerText = defaultText), 1_500)
            }}
        >
            {defaultText}
        </button>
    )
}
