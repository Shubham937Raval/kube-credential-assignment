import React from "react";
import Issuance from "./pages/Issuance";
import Verification from "./pages/Verification";
import "./index.css";

export default function App() {
  return (
    <div className="app-container">
      <h1>Kube Credential</h1>
      <p className="subtitle">Simple credential issuance and verification demo</p>
      <Issuance />
      <Verification />
    </div>
  );
}
