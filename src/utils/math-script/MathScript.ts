import type { MathScriptObject } from "./MathScript.types"
import { compileMathScript, getLatex } from "./MathScript.utils"

export default class MathScript {
    public mathScript: string
    public readonly compiled: MathScriptObject[][]

    public constructor(mathScript: string) {
        this.mathScript = mathScript
        this.compiled = compileMathScript(mathScript)
    }

    public get latex(): string {
        return this.compiled
            .map<string>(line => {
                const latexParts = line.map<string>(part => getLatex(part))

                return latexParts.join(" ")
            })
            .join(" \\\\ ")
    }

    public static getFromLatex(latex: string): MathScript {}
}
