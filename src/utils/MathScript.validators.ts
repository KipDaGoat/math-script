import { SYMBOLS } from "./MathScript.consts"

const FLOAT_REGEX: Readonly<RegExp> = /^-?\d+(?:\.\d+)?$/
const FLOAT_VARIABLE_REGEX: Readonly<RegExp> = /^-?\d+(?:\.\d+)?[a-zA-Z]+$/
const FUNCTION_REGEX: Readonly<RegExp> = /^[a-zA-Z]+\{.*\}$/
const LETTER_REGEX: Readonly<RegExp> = /^[a-zA-Z]+$/

export function partIsSymbol(part: string): boolean {
    return SYMBOLS.some(symbol => symbol.mathScript === part)
}

export function partIsSet(part: string): boolean {
    return part[0] === "@" && LETTER_REGEX.test(part.slice(1))
}

export function partIsFunction(part: string): boolean {
    return FUNCTION_REGEX.test(part)
}

export function partIsVariable(part: string): boolean {
    return (
        (LETTER_REGEX.test(part) && part.length === 1) ||
        (part.length >= 2 &&
            part[0] === "$" &&
            LETTER_REGEX.test(part.slice(1))) ||
        (part.length >= 2 &&
            part[0] === "-" &&
            LETTER_REGEX.test(part.slice(1)))
    )
}

export function partIsFloat(part: string): boolean {
    return FLOAT_REGEX.test(part)
}

export function partIsFloatVariable(part: string): boolean {
    return FLOAT_VARIABLE_REGEX.test(part)
}

export function partIsSimpleFraction(part: string): boolean {
    const splitPart = part.split("/")
    return (
        splitPart.length === 2 &&
        (partIsFloat(splitPart[0]) ||
            partIsVariable(splitPart[0]) ||
            partIsFloatVariable(splitPart[0])) &&
        (partIsFloat(splitPart[1]) ||
            partIsVariable(splitPart[1]) ||
            partIsFloatVariable(splitPart[1]))
    )
}

export function partIsParamSeperator(part: string): boolean {
    return part === "&" || part === "&&"
}
