import { FUNCTIONS, SYMBOLS } from "./MathScript.consts"
import type { MathScriptObject, MathScriptObjectType } from "./MathScript.types"
import {
    partIsFloat,
    partIsFloatVariable,
    partIsFunction,
    partIsParamSeperator,
    partIsSet,
    partIsSimpleFraction,
    partIsSymbol,
    partIsVariable
} from "./MathScript.validators"

export function compileMathScript(mathScript: string): MathScriptObject[][] {
    const lines = mathScript.split("\n")
    return lines.map<MathScriptObject[]>(line => compileMathScriptLine(line))
}

export function getLatex(obj: MathScriptObject): string {
    switch (obj.type) {
        case "number":
        case "number-variable":
            return obj.content
        case "variable":
            return obj.content[0] === "$" ? obj.content.slice(1) : obj.content
        case "set":
            return `\\mathbb{${obj.content.slice(1)}}`
        case "symbol":
            return SYMBOLS.find(symbol => symbol.mathScript === obj.content)?.latex ?? latexError(obj.content)
        case "text":
            return `\\text{${obj.content}}`
        case "simple-fraction":
            const [numerator, denominator] = obj.content.split("/")
            return `\\frac{${numerator}}{${denominator}}`
        case "function":
            return getLatexFromCommand(obj.content)
        case "param-seperator":
            return ""
        case "error":
            return latexError(obj.content)
        default:
            throw new Error(`Unexpected case "${obj.type satisfies never}"`)
    }
}

export function compileMathScriptLine(lineStr: string): MathScriptObject[] {
    const compiledLine: MathScriptObject[] = []

    let modeTemp: "math" | "text" | "function" = "math"
    let functionDepth: number = 0
    let contentTemp: string = ""
    const pushContent = (type: MathScriptObjectType) => {
        compiledLine.push({ type, content: contentTemp })
        contentTemp = ""
    }

    for (let index = 0; index < lineStr.length; index++) {
        const char = lineStr[index]
        const prevChar = lineStr[index - 1]
        const nextChar = lineStr[index + 1]

        if (char === "`" && prevChar !== "\\") {
            modeTemp = modeTemp === "math" ? "text" : "math"

            if (modeTemp === "math") pushContent("text")

            continue
        }
        if (modeTemp === "text") {
            if (char !== "\\" || nextChar !== "`") contentTemp += char
            continue
        }
        if (char === "{" && prevChar !== "\\" && ++functionDepth === 1) {
            modeTemp = "function"
            contentTemp += ";"
            continue
        }
        if (char === "}" && prevChar !== "\\" && --functionDepth === 0) {
            modeTemp = "math"
            pushContent("function")
            continue
        }
        if (modeTemp === "function") {
            if (char !== "\\" || nextChar !== "}") contentTemp += char
            continue
        }
        // modeTemp === "math"
        if (char !== " ") {
            contentTemp += char
            if (index !== lineStr.length - 1) continue
        }

        if (contentTemp === "") continue

        if (partIsSymbol(contentTemp)) pushContent("symbol")
        else if (partIsParamSeperator(contentTemp)) pushContent("param-seperator")
        else if (partIsSet(contentTemp)) pushContent("set")
        else if (partIsFloat(contentTemp)) pushContent("number")
        else if (partIsVariable(contentTemp)) pushContent("variable")
        else if (partIsFloatVariable(contentTemp)) pushContent("number-variable")
        else if (partIsSimpleFraction(contentTemp)) pushContent("simple-fraction")
        else if (partIsFunction(contentTemp)) pushContent("function")
        else pushContent("error")
    }

    return compiledLine
}

export function latexError(msg: string): string {
    return `\\textcolor{red}{\\text{${msg}}}`
}

function getLatexFromCommand(cmdStr: string): string {
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
            param.map<string>(subparam => subparam.map<string>(obj => getLatex(obj)).join(" "))
        )
    )
}
