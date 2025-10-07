import React, { useState } from "react";
import { Credential, VerifyResponse } from "@shared/custom_types";

const VERIFICATION_URL = `${import.meta.env.VITE_VERIFICATION_URL || ""}/verify`;

export default function Verification() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload: Partial<Credential> = { id };

    try {
      const resp = await fetch(VERIFICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data: VerifyResponse = await resp.json();
      setResult(data);
    } catch (err) {
      setError("Failed to verify credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Verification</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="Credential ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit" disabled={loading || !VERIFICATION_URL}>
          {loading ? "Verifying..." : "Verify credential"}
        </button>
      </form>

      {!VERIFICATION_URL && <p style={{ color: "tomato" }}>Configure VITE_VERIFICATION_URL env.</p>}
      {error && <p style={{ color: "tomato" }}>{error}</p>}
      {result && (
        <pre style={{ background: "#f6f8fa", padding: 12 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
