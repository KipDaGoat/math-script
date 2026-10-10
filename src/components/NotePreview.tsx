import { Link } from "react-router-dom"
import type Note from "../utils/Note"
import Card from "./macro/Card"
import Badge from "./micro/Badge"
import Button from "./micro/Button"
import "./NotePreview.css"

type NotePreviewProps = { note: Note; id: string }

export default function NotePreview({ note, id }: NotePreviewProps): React.JSX.Element {
    return (
        <Card
            className="c-note-preview"
            variant="outline"
            cardTitle={note.title}
            description={`Last edited ${getLastEditedMsg(note.getLastEditedAt())}`}
            size="s"
            action={
                <Button variant="link-primary" size="s" isLink render={<Link to={`/notes/${id}/edit`} />}>
                    Edit
                </Button>
            }
            footer={
                note.tagIds.length !== 0 ? (
                    <>
                        {note.tagIds.map(tag => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </>
                ) : undefined
            }
        >
            <p className="_truncate">{note.firstParagraph ?? undefined}</p>
        </Card>
    )
}

function getLastEditedMsg(lastEditedAt: Temporal.PlainDateTime): string {
    const timeFormatter = new Intl.DateTimeFormat("en-US", { timeStyle: "short" })
    const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })
    const relativeTimeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" })

    const sinceLastEdited = lastEditedAt.until(Temporal.Now.plainDateTimeISO())

    if (sinceLastEdited.days <= 7 && sinceLastEdited.days >= 1)
        return relativeTimeFormatter.format(sinceLastEdited.days, "days")
    if (sinceLastEdited.days > 7) return dateFormatter.format(lastEditedAt)
    return timeFormatter.format(lastEditedAt)
}
