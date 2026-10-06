import { useRef } from "react"
import "./MathScriptEditor.css"
import type { MathScriptObject } from "../utils/MathScript.types"
import MathScript from "../utils/MathScript"

type MathScriptEditorProps = {
    script: string
    setScript: React.Dispatch<React.SetStateAction<string>>
} & React.ComponentProps<"textarea">

type MathScriptPrismProps = { mathScriptObj: MathScriptObject; key: string }

const FLOAT_REGEX: Readonly<RegExp> = /-?\d+(?:\.\d+)?/

export default function MathScriptEditor({
    className,
    script,
    setScript,
    ...props
}: MathScriptEditorProps): React.JSX.Element {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const key = crypto.randomUUID()

    return (
        <div className={`c-math-script-editor ${className ?? ""}`}>
            <textarea
                {...props}
                ref={textareaRef}
                className="_textarea"
                value={script}
                onChange={event => setScript(event.target.value)}
                onKeyDown={event => {
                    if (event.key !== "Tab") return

                    event.preventDefault()

                    const textarea = textareaRef.current
                    textarea?.setRangeText("    ", textarea.selectionStart, textarea.selectionEnd, "end")
                }}
                spellCheck={false}
            />
            <div className="_display" aria-hidden>
                {
                    /* {new MathScript(script).compiled.map((line, lineIndex) => (
                    <p key={`${key}-line-${lineIndex}`} className="_line">
                        {line.map((obj, objIndex) => (
                            <MathScriptPrism key={`${key}-line-${lineIndex}-obj-${objIndex}`} mathScriptObj={obj} />
                        ))}
                    </p>
                ))} */
                    script.split("\n").map((line, index) => (
                        <p key={`line-${index}`} className="_line">
                            {line}
                        </p>
                    ))
                }
            </div>
        </div>
    )
}

function MathScriptPrism({ key, mathScriptObj }: MathScriptPrismProps): React.JSX.Element {
    if (mathScriptObj.type === "function") {
        const [fnName, ...fnBody] = mathScriptObj.content.split(";")

        return (
            <span key={key} className="_obj __function">
                {`${fnName}{${fnBody.join(";")}} `}
            </span>
        )
    }

    if (mathScriptObj.type === "number-variable") {
        const number = FLOAT_REGEX.exec(mathScriptObj.content)?.[0] ?? ""
        const variable = mathScriptObj.content.slice(number.length)

        return (
            <>
                <span key={key} className={`_obj __number`}>
                    {number}
                </span>
                <span key={key} className={`_obj __variable`}>
                    {variable + " "}
                </span>
            </>
        )
    }

    if (mathScriptObj.type === "text") {
        return (
            <span key={key} className={`_obj __${mathScriptObj.type}`}>
                {"`" + mathScriptObj.content + "` "}
            </span>
        )
    }

    return (
        <span key={key} className={`_obj __${mathScriptObj.type}`}>
            {mathScriptObj.content + " "}
        </span>
    )
}
