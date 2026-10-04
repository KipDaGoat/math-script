import type { MathScriptFunctionDef, MathScriptSymbol } from "./MathScript.types"
import DATA_SYMBOLS from "../data/symbols.json"
import { latexError } from "./MathScript.utils"

export const FORMATTERS = { MATH_BLOCK_SEPERATOR: "$$$", LINE_BREAK: "\n" } as const

export const SYMBOLS: readonly MathScriptSymbol[] = DATA_SYMBOLS

export const FUNCTIONS: readonly MathScriptFunctionDef[] = [
    {
        names: ["f", "frac", "fraction"],
        executable: params => {
            if (params.length !== 1) return ""
            if (params[0].length > 2) return latexError('"f" function must have 2 parameters')

            const [numerator, denominator] = params[0]
            return `\\frac{${numerator ?? ""}}{${denominator ?? ""}}`
        }
    },
    {
        names: ["sqrt"],
        executable: params => {
            if (params.length !== 1) return ""
            if (params[0].length > 1) return latexError('"sqrt" function must have 1 parameter')

            return `\\sqrt{${params[0][0]}}`
        }
    },
    {
        names: ["v", "vec", "vector"],
        executable: params => {
            if (params.length > 1 || params[0].length > 1) return latexError('"v" command must have one parameter')
            return `\\vec{${params[0][0]}}`
        }
    },
    {
        names: ["m", "matrix"],
        executable: params => {
            return `\\begin{pmatrix} ${params.map(row => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`
        }
    },
    {
        names: ["s", "sum"],
        executable: params => {
            if (params.length > 1 || params[0].length > 2) return latexError('"sum" command must have one parameter')
            return `\\sum _ {${params[0][0] ?? ""}} ^ {${params[0][1] ?? ""}}`
        }
    }
]
