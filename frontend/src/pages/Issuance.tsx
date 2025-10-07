import React, { useState } from "react";
import { Credential, IssueResponse } from "@shared/custom_types";

const ISSUANCE_URL = `${import.meta.env.VITE_ISSUANCE_URL}/issue`;

function showToast(message: string, type: "success" | "error") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

export default function Issuance() {
  const [credential, setCredential] = useState<Credential>({ id: "", name: "", email: "" });
  const [result, setResult] = useState<IssueResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
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
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Issuance</h2>
      <form onSubmit={submit}>
        <input
          placeholder="ID"
          value={credential.id}
          onChange={(e) => setCredential({ ...credential, id: e.target.value })}
          required
        />
        <input
          placeholder="Name"
          value={credential.name}
          onChange={(e) => setCredential({ ...credential, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={credential.email}
          onChange={(e) => setCredential({ ...credential, email: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Issuing..." : "Issue Credential"}
        </button>
      </form>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}
