import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Issuance from "./pages/Issuance";
import Verification from "./pages/Verification";
import "./index.css";
export default function App() {
    return (_jsxs("div", { className: "app-container", children: [_jsx("h1", { children: "Kube Credential" }), _jsx("p", { className: "subtitle", children: "Simple credential issuance and verification demo" }), _jsx(Issuance, {}), _jsx(Verification, {}), _jsx("div", { id: "toast-container" })] }));
}
