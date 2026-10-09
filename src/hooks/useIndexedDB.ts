import { useEffect, useReducer } from "react"

type Entry<T> = { id: string; data: T }

type DataReducerArgs<T> =
    | { operation: "add"; newData: T }
    | { operation: "update"; newData: Entry<T> }
    | { operation: "delete"; id: string }
    | { operation: "set"; data: Entry<T>[] }

export default function useIndexedDB<T>(tableName: string = "storage", dbName: string = "app-db") {
    const [data, setData] = useReducer((prev: Entry<T>[], args: DataReducerArgs<T>) => dataReducer<T>(prev, args), [])

    useEffect(() => {
        const request = openDB(dbName, tableName)
        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(tableName, "readwrite")
            const table = transaction.objectStore(tableName)

            const entriesRequest = table.getAll()
            entriesRequest.onsuccess = () => {
                const allEntries: Entry<T>[] = entriesRequest.result
                setData({ operation: "set", data: allEntries })
            }

            transaction.oncomplete = () => db.close()
        }
    }, [])

    useEffect(() => {
        const request = openDB(dbName, tableName)
        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(tableName, "readwrite")
            const table = transaction.objectStore(tableName)

            const entriesRequest = table.getAll()
            entriesRequest.onsuccess = () => {
                const allEntries: Entry<T>[] = entriesRequest.result

                data.forEach(stateEntry => table.put(stateEntry))

                const deletedEntries = allEntries.filter(
                    dbEntry => !data.some(stateEntry => dbEntry.id === stateEntry.id)
                )
                deletedEntries.forEach(entry => table.delete(entry.id))
            }

            transaction.oncomplete = () => db.close()
            console.table(data)
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
