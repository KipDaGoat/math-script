import { BlockMath } from "react-katex"
import splitScriptSections from "../utils/splitScriptSections"
import MarkdownBlock from "./MarkdownBlock"
import "./MathScriptPreview.css"
import MathScript from "../utils/math-script/MathScript"

type MathScriptPreviewProps = { script: string } & React.ComponentProps<"article">

export default function MathScriptPreview({ script, className, ...props }: MathScriptPreviewProps): React.JSX.Element {
    return (
        <article {...props} className={`c-math-script-preview ${className ?? ""}`}>
            {splitScriptSections(script).map((section, index) => {
                if (section.type === "markdown")
                    return <MarkdownBlock key={`script-section-${index}`} content={section.content} />
                return <BlockMath key={`script-section-${index}`} math={new MathScript(section.content).latex} />
            })}
        </article>
    )
}
