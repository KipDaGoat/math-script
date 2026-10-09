import { useEffect, useReducer, useRef } from "react"

export type Entry<T> = { id: string; data: T }

export type DataReducerArgs<T> =
    | { operation: "add"; newData: T }
    | { operation: "update"; newData: Entry<T> }
    | { operation: "delete"; id: string }
    | { operation: "set"; data: Entry<T>[] }

export default function useIndexedDB<T>(tableName: string = "storage", dbName: string = "app-db") {
    const [data, setData] = useReducer((prev: Entry<T>[], args: DataReducerArgs<T>) => dataReducer<T>(prev, args), [])
    const isFirstRender = useRef(true)

    useEffect(() => {
        const request = openDB(dbName, tableName)
        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(tableName, "readwrite")
            const table = transaction.objectStore(tableName)

            const entriesRequest = table.getAll()
            entriesRequest.onsuccess = () => setData({ operation: "set", data: entriesRequest.result })

            transaction.oncomplete = () => db.close()
        }
    }, [])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        const request = openDB(dbName, tableName)
        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(tableName, "readwrite")
            const table = transaction.objectStore(tableName)

            const entriesRequest = table.getAll()
            entriesRequest.onsuccess = () => {
                if (data.length === 0) return

                const allEntries: Entry<T>[] = entriesRequest.result

                data.forEach(stateEntry => {
                    if (!allEntries.some(dbEntry => dbEntry.id === stateEntry.id)) table.add(stateEntry)
                    else table.put(stateEntry)
                })

                const deletedEntries = allEntries.filter(
                    dbEntry => !data.some(stateEntry => dbEntry.id === stateEntry.id)
                )
                deletedEntries.forEach(entry => table.delete(entry.id))
            }

            transaction.oncomplete = () => db.close()
        }
    }, [data])

    return [data, setData] as const
}

function dataReducer<T>(prevData: Entry<T>[], args: DataReducerArgs<T>): Entry<T>[] {
    const generateId = () => {
        const ids = prevData.map(entry => entry.id)

        while (true) {
            const id = crypto.randomUUID()
            if (!ids.includes(id)) return id
        }
    }

    switch (args.operation) {
        case "add":
            return [...prevData, { id: generateId(), data: args.newData }]
        case "delete":
            return prevData.filter(entry => entry.id !== args.id)
        case "update":
            const currentEntry = prevData.find(entry => entry.id === args.newData.id)
            if (currentEntry != null) currentEntry.data = args.newData.data
            return [...prevData]
        case "set":
            return [...args.data]
        default:
            throw new Error(`Unknown operation ${args satisfies never}`)
    }
}

function openDB(dbName: string, tableName: string): IDBOpenDBRequest {
    const request = indexedDB.open(dbName, 1)

    request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(tableName)) db.createObjectStore(tableName, { keyPath: "id" })
    }

    return request
}
