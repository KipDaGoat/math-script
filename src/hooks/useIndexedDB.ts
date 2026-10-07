import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

export default function useIndexedDB<T>(
    key: string,
    initialValue: T,
    objectStoreName: string = "storage",
    dbName: string = "app-db"
): readonly [T, Dispatch<SetStateAction<T>>] {
    const [data, setData] = useState<T>(initialValue)

    useEffect(() => {
        const request = indexedDB.open(dbName, 1)

        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(objectStoreName, "readonly")
            const store = transaction.objectStore(objectStoreName)

            const getRequest = store.get(key)
            getRequest.onsuccess = () => {
                if (getRequest.result != null) setData(getRequest.result)
            }

            transaction.oncomplete = () => db.close()
        }
    }, [key])

    useEffect(() => {
        const request = indexedDB.open(dbName, 1)

        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(objectStoreName)) db.createObjectStore(objectStoreName)
        }

        request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(objectStoreName, "readwrite")
            const store = transaction.objectStore(objectStoreName)

            store.put(data, key)
            transaction.oncomplete = () => db.close()
        }
    }, [data, key])

    return [data, setData] as const
}
