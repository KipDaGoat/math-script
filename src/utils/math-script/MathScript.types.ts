export type MathScriptObject = { type: MathScriptObjectType; content: string }

export type MathScriptObjectType =
    | "number"
    | "variable"
    | "number-variable"
    | "set"
    | "symbol"
    | "simple-fraction"
    | "function"
    | "text"
    | "error"
    | "param-seperator"

export type MathScriptSymbol = { mathScript: string; latex: string; isCompact: boolean }

export type MathScriptFunctionDef = { names: string[]; executable: (params: string[][]) => string }
