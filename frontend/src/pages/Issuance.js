import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ISSUANCE_URL = `${import.meta.env.VITE_ISSUANCE_URL}/issue`;
function showToast(message, type) {
    const container = document.getElementById("toast-container");
    if (!container)
        return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
export default function Issuance() {
    const [credential, setCredential] = useState({ id: "", name: "", email: "" });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch(ISSUANCE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credential),
            });
            if (!resp.ok) {
                showToast("Failed to issue credential", "error");
                return;
            }
            const data = await resp.json();
            setResult(data);
            showToast("Credential issued successfully!", "success");
        }
        catch (err) {
            showToast("Network error", "error");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "Issuance" }), _jsxs("form", { onSubmit: submit, children: [_jsx("input", { placeholder: "ID", value: credential.id, onChange: (e) => setCredential({ ...credential, id: e.target.value }), required: true }), _jsx("input", { placeholder: "Name", value: credential.name, onChange: (e) => setCredential({ ...credential, name: e.target.value }), required: true }), _jsx("input", { type: "email", placeholder: "Email", value: credential.email, onChange: (e) => setCredential({ ...credential, email: e.target.value }), required: true }), _jsx("button", { type: "submit", disabled: loading, children: loading ? "Issuing..." : "Issue Credential" })] }), result && _jsx("pre", { children: JSON.stringify(result, null, 2) })] }));
}
