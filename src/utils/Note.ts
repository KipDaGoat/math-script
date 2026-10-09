import splitScriptSections from "./splitScriptSections"

const TITLE_REGEX: Readonly<RegExp> = /^\s*#\s+[A-Za-z0-9]+.*$/
const CAPTURE_TITLE_REGEX: Readonly<RegExp> = /^\s*#\s+([A-Za-z0-9].*)$/

export default class Note {
    public constructor(
        public content: string,
        public tagIds: string[],
        public createdAt: Temporal.PlainDateTime,
        public lastEditedAt: Temporal.PlainDateTime
    ) {}

    public get title(): string {
        const sections = splitScriptSections(this.content)
        const markdownSections = sections.filter(section => section.type === "markdown")
        const markdownLines = markdownSections.map(section => section.content.split("\n")).flat()
        const titleLine = markdownLines.find(line => TITLE_REGEX.test(line))

        if (titleLine == null) return "Untitled"

        return titleLine.match(CAPTURE_TITLE_REGEX)![0]
    }
}
