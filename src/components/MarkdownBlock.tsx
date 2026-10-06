import ReactMardown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import "./MarkdownBlock.css"
import { Prism } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkInlineMathFormatter from "../utils/remarkInlineMathFormatter"
import { BlockMath, InlineMath } from "react-katex"
import MathScript from "../utils/MathScript"
import remarkMathScript from "../utils/remarkMathScript"

type MarkdownBlockProps = { content: string }

type MathScriptElementProps = {
    node: {
        type: "element"
        tagName: "c-mathscript"
        properties: Record<string, unknown>
        children: { type: "text"; value: string }[]
    }
}

const COMPONENTS: Components & { "c-mathscript": (props: MathScriptElementProps) => React.JSX.Element } = {
    "a": ({ href, ...props }) => <a {...props} className="markdown-link" href={href} />,
    "p": props => <p {...props} className="markdown-paragraph" />,
    "em": props => <em {...props} className="markdown-italic" />,
    "strong": props => <strong {...props} className="markdown-bold" />,
    "ol": ({ ...props }) => <ol {...props} className="markdown-ordered-list" />,
    "ul": props => <ul {...props} className="markdown-unordered-list" />,
    "h1": props => <h1 {...props} className="markdown-heading-1" />,
    "h2": props => <h2 {...props} className="markdown-heading-2" />,
    "h3": props => <h3 {...props} className="markdown-heading-3" />,
    "h4": props => <h4 {...props} className="markdown-heading-4" />,
    "h5": props => <h5 {...props} className="markdown-heading-5" />,
    "h6": props => <h6 {...props} className="markdown-heading-6" />,
    "table": props => <table {...props} className="markdown-table" />,
    "code": ({ node, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className ?? "")
        if (match)
            return (
                <Prism style={oneDark} language={className?.split("-").at(-1)} PreTag="div">
                    {String(children).replace(/\n$/, "")}
                </Prism>
            )
        return (
            <code {...props} className={`markdown-code ${className ?? ""}`}>
                {children}
            </code>
        )
    },
    "blockquote": props => <blockquote {...props} className="markdown-blockquote" />,
    "mark": ({ className, children }) => {
        if (className === "markdown-inline-math") return <InlineMath math={new MathScript(children as string).latex} />
    },
    "c-mathscript": ({ node }) => <BlockMath math={new MathScript(node.children[0].value).latex} />
}

export default function MarkdownBlock({ content }: MarkdownBlockProps): React.JSX.Element {
    return (
        <section className="markdown-section">
            <ReactMardown
                remarkPlugins={[remarkGfm, remarkInlineMathFormatter, remarkMathScript]}
                components={COMPONENTS}
            >
                {content}
            </ReactMardown>
        </section>
    )
}
