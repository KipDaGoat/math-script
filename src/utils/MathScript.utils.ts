import MathScript from "./MathScript"
import { FORMATTERS, SYMBOLS } from "./MathScript.consts"
import type {
    CompiledLatex,
    MathScriptObject,
    MathScriptObjectType,
    MathScriptSection
} from "./MathScript.types"
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

export function compileMathScript(mathScript: string): MathScriptSection[] {
    const sections = mathScript.split(`\n${FORMATTERS.MATH_BLOCK_SEPERATOR}\n`)
    const startsWithMath =
        mathScript.slice(0, FORMATTERS.MATH_BLOCK_SEPERATOR.length + 1) ===
        FORMATTERS.MATH_BLOCK_SEPERATOR + "\n"

    return sections.map<MathScriptSection>((section, index) => {
        if (
            (index % 2 === 0 && !startsWithMath) ||
            (index % 2 !== 0 && startsWithMath)
        )
            return { type: "markdown", content: section }

        if (startsWithMath && index === 0)
            section = section.slice(FORMATTERS.MATH_BLOCK_SEPERATOR.length + 1)
        const lines = section.split(FORMATTERS.LINE_BREAK)
        const compiledLines = lines.map<MathScriptObject[]>(line =>
            compileMathScriptLine(line)
        )

        return { type: "mathscript", content: compiledLines }
    })
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
            return (
                SYMBOLS.find(symbol => symbol.mathScript === obj.content)
                    ?.latex ??
                `\\textcolor{red}{${JSON.stringify(obj.content)}}`
            )
        case "text":
            return `\\text{${obj.content}}`
        case "simple-fraction":
            const [numerator, denominator] = obj.content.split("/")
            return `\\frac{${numerator}}{${denominator}}`
        case "function": // NOT DONE!!!
            return MathScript.getLatexFromCommand(obj.content)
        case "param-seperator":
            return ""
        case "error":
            return ""
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
        else if (partIsParamSeperator(contentTemp))
            pushContent("param-seperator")
        else if (partIsSet(contentTemp)) pushContent("set")
        else if (partIsFloat(contentTemp)) pushContent("number")
        else if (partIsVariable(contentTemp)) pushContent("variable")
        else if (partIsFloatVariable(contentTemp))
            pushContent("number-variable")
        else if (partIsSimpleFraction(contentTemp))
            pushContent("simple-fraction")
        else if (partIsFunction(contentTemp)) pushContent("function")
        else pushContent("error")
    }

    return compiledLine
}

export function latexError(msg: string): string {
    return `\\text{${msg}}`
}
