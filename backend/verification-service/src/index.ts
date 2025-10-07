import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Credential, VerifyResponse } from "@shared/custom_types";

const app = express();
app.use(bodyParser.json());

const PORT = Number(process.env.PORT || 5000);
const WORKER_ID = process.env.WORKER_ID || `worker-${Math.floor(Math.random() * 1000)}`;

const ISSUANCE_BASE_URL = process.env.ISSUANCE_BASE_URL || "http://localhost:4000";

const dbFile = path.join(__dirname, "db.json");

type VerificationLog = {
  id: string;
  attemptedAt: string;
  workerId: string;
  valid: boolean;
};

type VerificationStore = { verifications: VerificationLog[] };

function loadDb(): VerificationStore {
  if (!fs.existsSync(dbFile)) {
    const initial: VerificationStore = { verifications: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const content = fs.readFileSync(dbFile, "utf-8").trim();
    return content ? JSON.parse(content) as VerificationStore : { verifications: [] };
  } catch (err) {
    console.error("Error parsing db.json, resetting store:", err);
    const reset: VerificationStore = { verifications: [] };
    fs.writeFileSync(dbFile, JSON.stringify(reset, null, 2));
    return reset;
  }
}

function saveDb(store: VerificationStore): void {
  fs.writeFileSync(dbFile, JSON.stringify(store, null, 2));
}

app.post("/verify", async (req: Request, res: Response<VerifyResponse>) => {
  const credential: Credential = req.body;

  if (!credential?.id) {
    return res.status(400).json({ valid: false, message: "Invalid payload: id required" });
  }

  try {
    const statusUrl = `${ISSUANCE_BASE_URL}/status/${encodeURIComponent(credential.id)}`;
    const resp = await fetch(statusUrl);
    if (resp.status === 404) {
      const logStore = loadDb();
      logStore.verifications.push({
        id: credential.id,
        attemptedAt: new Date().toISOString(),
        workerId: WORKER_ID,
        valid: false
      });
      saveDb(logStore);

      return res.json({ valid: false, message: "Credential not issued" });
    }
    if (!resp.ok) {
      return res.status(502).json({ valid: false, message: "Upstream issuance service error" });
    }

    const issuedRecord = await resp.json() as Credential;

    const logStore = loadDb();
    logStore.verifications.push({
      id: credential.id,
      attemptedAt: new Date().toISOString(),
      workerId: WORKER_ID,
      valid: true
    });
    saveDb(logStore);

    return res.json({
      valid: true,
      workerId: issuedRecord.workerId,
      timestamp: issuedRecord.issuedAt,
      message: "Credential verified"
    });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ valid: false, message: "Verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Verification service running on port ${PORT} with ${WORKER_ID}`);
  console.log(`Issuance base URL: ${ISSUANCE_BASE_URL}`);
});
