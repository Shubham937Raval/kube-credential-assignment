import React, { useState } from "react";
import { Credential, IssueResponse } from "@shared/custom_types";

const ISSUANCE_URL = `${import.meta.env.VITE_ISSUANCE_URL || ""}/issue`;

export default function Issuance() {
  const [credential, setCredential] = useState<Credential>({ id: "", name: "", email: "" });
  const [result, setResult] = useState<IssueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch(ISSUANCE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential)
      });
      const data: IssueResponse = await resp.json();
      setResult(data);
    } catch (err) {
      setError("Failed to issue credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Issuance</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
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
          placeholder="Email"
          type="email"
          value={credential.email}
          onChange={(e) => setCredential({ ...credential, email: e.target.value })}
          required
        />
        <button type="submit" disabled={loading || !ISSUANCE_URL}>
          {loading ? "Issuing..." : "Issue credential"}
        </button>
      </form>

      {!ISSUANCE_URL && <p style={{ color: "tomato" }}>Configure VITE_ISSUANCE_URL env.</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      {result && (
        <pre style={{ background: "#f6f8fa", padding: 12 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
