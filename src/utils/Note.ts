import splitScriptSections from "./splitScriptSections"

export type SimplifiedNote = { createdAt: string; lastEditedAt: string; content: string; tagIds: string[] }

const TITLE_REGEX: Readonly<RegExp> = /^\s*#\s+[A-Za-z0-9]+.*$/
const CAPTURE_TITLE_REGEX: Readonly<RegExp> = /^\s*#\s+([A-Za-z0-9].*)$/
const TEXT_LINE_REGEX: Readonly<RegExp> = /^\s*\p{L}/v

export default class Note {
    public readonly createdAt: Temporal.PlainDateTime
    private lastEditedAt: Temporal.PlainDateTime
    private content: string
    public tagIds: string[]

    public constructor(
        content?: string,
        tagIds?: string[],
        createdAt?: Temporal.PlainDateTime,
        lastEditedAt?: Temporal.PlainDateTime
    ) {
        this.content = content ?? ""
        this.createdAt = createdAt ?? Temporal.Now.plainDateTimeISO()
        this.lastEditedAt = lastEditedAt ?? Temporal.Now.plainDateTimeISO()
        this.tagIds = tagIds ?? []
    }

    public get title(): string {
        const sections = splitScriptSections(this.content)
        const markdownSections = sections.filter(section => section.type === "markdown")
        const markdownLines = markdownSections.map(section => section.content.split("\n")).flat()
        const titleLine = markdownLines.find(line => TITLE_REGEX.test(line))

        if (titleLine == null) return "Untitled"

        return titleLine.match(CAPTURE_TITLE_REGEX)![1]
    }

    public get firstParagraph(): string | null {
        const sections = splitScriptSections(this.content)
        const markdownSections = sections.filter(section => section.type === "markdown")
        const markdownLines = markdownSections.map(section => section.content.split("\n")).flat()

        return markdownLines.find(line => /^\s*[A-Za-z]/.test(line)) ?? null
    }

    public setContent(content: string): void {
        this.content = content
        this.lastEditedAt = Temporal.Now.plainDateTimeISO()
    }

    public getContent(): string {
        return this.content
    }

    public getLastEditedAt(): Temporal.PlainDateTime {
        return this.lastEditedAt
    }

    public simplifyNote(): SimplifiedNote {
        return {
            createdAt: this.createdAt.toString(),
            lastEditedAt: this.lastEditedAt.toString(),
            content: this.content,
            tagIds: this.tagIds
        }
    }

    public static parse({ content, createdAt, lastEditedAt, tagIds }: SimplifiedNote): Note {
        return new Note(
            content,
            tagIds,
            Temporal.PlainDateTime.from(createdAt),
            Temporal.PlainDateTime.from(lastEditedAt)
        )
    }
}
