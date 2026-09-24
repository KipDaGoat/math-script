import { useRef } from "react"
import "./MathScriptEditor.css"

type MathScriptEditorProps = {
    script: string
    setScript: React.Dispatch<React.SetStateAction<string>>
} & React.ComponentProps<"textarea">

export default function MathScriptEditor({
    className,
    script,
    setScript,
    ...props
}: MathScriptEditorProps): React.JSX.Element {
    const ref = useRef<HTMLTextAreaElement>(null)
    return (
        <textarea
            ref={ref}
            className={`c-math-script-editor ${className ?? ""}`}
            value={script}
            onChange={event => setScript(event.target.value)}
            onKeyDown={event => {
                if (event.key !== "Tab") return

                event.preventDefault()

                const textarea = ref.current
                textarea?.setRangeText(
                    "    ",
                    textarea.selectionStart,
                    textarea.selectionEnd,
                    "end"
                )
            }}
        />
    )
}
