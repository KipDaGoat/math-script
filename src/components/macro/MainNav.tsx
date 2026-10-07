import { NavLink } from "react-router-dom"
import "./MainNav.css"

export default function MainNav({ className, ...props }: React.ComponentProps<"nav">): React.JSX.Element {
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
        </nav>
    )
}
