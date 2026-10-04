import type { CompiledLatex, MathScriptSection } from "./MathScript.types"
import { compileMathScript, getLatex } from "./MathScript.utils"

export default class MathScript {
    public mathScript: string
    public compiled: MathScriptSection[]

    public constructor(mathScript: string) {
        this.mathScript = mathScript
        this.compiled = compileMathScript(mathScript)
    }

    public get latex(): CompiledLatex[] {
        return this.compiled.map<CompiledLatex>(section => {
            if (section.type === "markdown") return section

            const lines = section.content.map<string[]>(line => line.map<string>(part => getLatex(part)))

            return { type: "latex", content: lines.map(line => line.join(" ")).join(" \\\\ ") }
        })
    }

    public static getFromLatex(latex: string): MathScript {}
}
