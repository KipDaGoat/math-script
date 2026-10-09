import { NavLink } from "react-router-dom"
import "./MainNav.css"
import { useEffect, useState } from "react"
import round from "../../utils/round"

type StorageInfo = { used: number; quota: number; remaining: number }

export default function MainNav({ className, ...props }: React.ComponentProps<"nav">): React.JSX.Element {
    const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null)

    useEffect(() => {
        const loadStorageInfo = async () => setStorageInfo(await getStorageInfo())

        loadStorageInfo()
    }, [])

    return (
        <nav {...props} className={`c-main-nav ${className ?? ""}`} aria-label="Main navigation">
            <ul className="_list">
                <li className="_item">
                    <NavLink className="_link" to="/">
                        Notes
                    </NavLink>
                </li>
                <li className="_item">
                    <NavLink className="_link" to="/documentation">
                        Documentation
                    </NavLink>
                </li>
            </ul>
            <p>
                {storageInfo == null
                    ? "???"
                    : `${formatStorageNumber(storageInfo.used)} of ${formatStorageNumber(storageInfo.quota)} MB used`}
            </p>
        </nav>
    )
}

async function getStorageInfo(): Promise<StorageInfo> {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()

    return { used: usage, quota, remaining: quota - usage }
}

function formatStorageNumber(storageNumber: number): string {
    const numberFormatter = Intl.NumberFormat("en")

    const storageInMB = storageNumber / 1_000_000
    const roundedMB = round(storageInMB, 2)

    return numberFormatter.format(roundedMB)
}
