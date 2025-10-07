import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const VERIFICATION_URL = `${import.meta.env.VITE_VERIFICATION_URL}/verify`;
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
export default function Verification() {
    const [id, setId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch(VERIFICATION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!resp.ok) {
                showToast("Verification failed", "error");
                return;
            }
            const data = await resp.json();
            setResult(data);
            showToast("Credential verified successfully!", "success");
        }
        catch (err) {
            showToast("Network error", "error");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("section", { children: [_jsx("h2", { children: "Verification" }), _jsxs("form", { onSubmit: submit, children: [_jsx("input", { placeholder: "Credential ID", value: id, onChange: (e) => setId(e.target.value), required: true }), _jsx("button", { type: "submit", disabled: loading, children: loading ? "Verifying..." : "Verify Credential" })] }), result && _jsx("pre", { children: JSON.stringify(result, null, 2) })] }));
}
