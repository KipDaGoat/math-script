type ScriptSection = { type: "markdown" | "mathscript"; content: string }

export default function splitScriptSections(script: string): ScriptSection[] {
    const lines = script.split("\n")
    const sections: ScriptSection[] = [{ type: "markdown", content: "" }]

    let isMarkdown: boolean = true
    let content: string[] = []
    for (const line of lines) {
        if (line !== "$$$") {
            content.push(line)
            sections[sections.length - 1].content = content.join("\n")
            continue
        }

        isMarkdown = !isMarkdown
        sections.push({ type: isMarkdown ? "markdown" : "mathscript", content: "" })
        content = []
    }

    return sections
}
