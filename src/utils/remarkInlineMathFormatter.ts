import { visit } from "unist-util-visit"
import type { Plugin } from "unified"
import type { Root, Text, PhrasingContent } from "mdast"

const INLINE_MATH_REGEX: Readonly<RegExp> = /\$\$([^=\n]+)\$\$/g

const remarkInlineMathFormatter: Plugin<[], Root> = () => {
    return tree => {
        visit(tree, "text", (node, index, parent) => {
            if (index == null || parent == null) return

            const textNode = node as Text
            const children: PhrasingContent[] = []
            let lastIndex: number = 0
            let match: RegExpExecArray | null

            while ((match = INLINE_MATH_REGEX.exec(textNode.value)) != null) {
                if (match.index > lastIndex)
                    children.push({ type: "text", value: textNode.value.slice(lastIndex, match.index) })

                children.push({
                    type: "emphasis",
                    data: { hName: "mark", hProperties: { className: ["markdown-inline-math"] } },
                    children: [{ type: "text", value: match[1] }]
                })

                lastIndex = INLINE_MATH_REGEX.lastIndex
            }

            if (children.length === 0) return

            if (lastIndex < textNode.value.length)
                children.push({ type: "text", value: textNode.value.slice(lastIndex) })

            parent.children.splice(index, 1, ...children)
        })
    }
}

export default remarkInlineMathFormatter
