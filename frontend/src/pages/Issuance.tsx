import React, { useState } from "react";
import { Credential, IssueResponse } from "@shared/custom_types";

const ISSUANCE_URL = `${import.meta.env.VITE_ISSUANCE_URL || ""}/issue`;

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
      setResult(await resp.json());
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

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
