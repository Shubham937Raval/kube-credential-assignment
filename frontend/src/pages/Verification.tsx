import React, { useState } from "react";
import { VerifyResponse } from "@shared/custom_types";

const VERIFICATION_URL = `${import.meta.env.VITE_VERIFICATION_URL || ""}/verify`;

export default function Verification() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(VERIFICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setResult(await resp.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Verification</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Credential ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Credential"}
        </button>
      </form>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
