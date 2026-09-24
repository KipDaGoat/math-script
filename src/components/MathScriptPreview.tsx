import { BlockMath } from "react-katex"
import MathScript from "../utils/MathScript"
import MarkdownBlock from "./MarkdownBlock"
import "./MathScriptPreview.css"

type MathScriptPreviewProps = {
    script: string
} & React.ComponentProps<"article">

export default function MathScriptPreview({
    script,
    className,
    ...props
}: MathScriptPreviewProps): React.JSX.Element {
    const key = crypto.randomUUID()

    return (
        <article
            {...props}
            className={`c-math-script-preview ${className ?? ""}`}>
            {new MathScript(script).latex.map((section, index) => {
                if (section.type === "markdown")
                    return (
                        <MarkdownBlock
                            key={`${key}-${index}`}
                            content={section.content}
                        />
                    )
                return (
                    <BlockMath
                        key={`${key}-${index}`}
                        math={`\\begin{align*}${section.content}\\end{align*}`}
                    />
                )
            })}
        </article>
    )
}
