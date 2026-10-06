import { visit } from "unist-util-visit"
import type { Root, Paragraph } from "mdast"

export type MathScriptNode = { type: "mathscript"; value: string; data?: { hName: "c-mathscript" } }

declare module "mdast" {
    interface BlockContentMap {
        mathscript: MathScriptNode
    }
}

const MATH_BLOCK_REGEX: Readonly<RegExp> = /\$\$\$(?:\r?\n)*([\s\S]*?)(?:\r?\n)*\$\$\$/g

export default function remarkMathScript(): (tree: Root) => void {
    return (tree: Root): void => {
        visit(tree, "paragraph", (node: Paragraph, index, parent) => {
            if (parent == null || index == null) return

            const text = node.children
                ?.filter(child => child.type === "text")
                .map(child => child.value)
                .join("")

            if (text === "") return

            const match = text.match(MATH_BLOCK_REGEX)

            if (match == null) return

            parent.children[index] = {
                type: "mathscript",
                value: match[0].slice(3, -3),
                data: { hName: "c-mathscript" }
            }
        })
    }
}
