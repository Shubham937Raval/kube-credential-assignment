import React from "react";
import Issuance from "./pages/Issuance";
import Verification from "./pages/Verification";

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Kube Credential</h1>
      <p>Simple credential issuance and verification demo</p>
      <hr />
      <Issuance />
      <hr />
      <Verification />
    </div>
  );
}
