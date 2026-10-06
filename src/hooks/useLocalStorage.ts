import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import isValidJson from "../utils/isValidJson"

export default function useLocalStorage<T>(key: string, initialValue: T): readonly [T, Dispatch<SetStateAction<T>>] {
    const [data, setData] = useState(() => {
        const item = localStorage.getItem(key)

        if (item == null || !isValidJson(item)) return initialValue
        return JSON.parse(item)
    })

    useEffect(() => localStorage.setItem(key, JSON.stringify(data)), [data, key])

    return [data, setData] as const
}
