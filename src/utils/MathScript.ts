import { FUNCTIONS } from "./MathScript.consts"
import type {
    CompiledLatex,
    MathScriptObject,
    MathScriptSection
} from "./MathScript.types"
import {
    compileMathScript,
    compileMathScriptLine,
    getLatex
} from "./MathScript.utils"

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

            const lines = section.content.map<string[]>(line =>
                line.map<string>(part => getLatex(part))
            )

            return {
                type: "latex",
                content: lines.map(line => line.join(" ")).join(" \\\\ ")
            }
        })
    }

    public static getLatexFromCommand(cmdStr: string): string {
        const [name, ...body] = cmdStr.split(";")
        const compiledBody = compileMathScriptLine(body.join(";"))

        const functionDef = FUNCTIONS.find(fn => fn.names.includes(name))
        if (functionDef == null) return `\\text{Unknown function "${name}"}`

        const params: MathScriptObject[][][] = [[[]]]
        for (const obj of compiledBody) {
            if (obj.type === "param-seperator") {
                if (obj.content === "&") params[params.length - 1].push([])
                else if (obj.content === "&&") params.push([[]])
                continue
            }
            params[params.length - 1][params.at(-1)!.length - 1].push(obj)
        }

        return functionDef.executable(
            params.map<string[]>(param =>
                param.map<string>(subparam =>
                    subparam.map<string>(obj => getLatex(obj)).join(" ")
                )
            )
        )
    }

    public static getFromLatex(latex: string): MathScript {}
}
