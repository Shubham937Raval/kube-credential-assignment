import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { Credential, IssueResponse } from "@shared/custom_types";

const app = express();
app.use(bodyParser.json());

const PORT = Number(process.env.PORT || 4000);
const WORKER_ID = process.env.WORKER_ID || `worker-${Math.floor(Math.random() * 1000)}`;

const dbFile = path.join(__dirname, "db.json");

type IssuanceStore = { issued: Credential[] };

function loadDb(): IssuanceStore {
  if (!fs.existsSync(dbFile)) {
    const initial: IssuanceStore = { issued: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const content = fs.readFileSync(dbFile, "utf-8").trim();
    return content ? JSON.parse(content) as IssuanceStore : { issued: [] };
  } catch (err) {
    console.error("Error parsing db.json, resetting store:", err);
    const reset: IssuanceStore = { issued: [] };
    fs.writeFileSync(dbFile, JSON.stringify(reset, null, 2));
    return reset;
  }
}

function saveDb(store: IssuanceStore): void {
  fs.writeFileSync(dbFile, JSON.stringify(store, null, 2));
}

app.post("/issue", (req: Request, res: Response<IssueResponse>) => {
  const credential: Credential = req.body;

  if (!credential?.id || !credential?.name || !credential?.email) {
    return res.status(400).json({ message: "Invalid credential payload: id, name, email required" });
  }

  const db = loadDb();
  const exists = db.issued.find((c) => c.id === credential.id);

  if (exists) {
    return res.json({ message: "Credential already issued", credential: exists });
  }

  const record: Credential = {
    ...credential,
    workerId: WORKER_ID,
    issuedAt: new Date().toISOString()
  };

  db.issued.push(record);
  saveDb(db);

  res.json({
    message: `credential issued by ${WORKER_ID}`,
    credential: record
  });
});

app.get("/status/:id", (req: Request, res: Response<Credential | { message: string }>) => {
  const id = req.params.id;
  const db = loadDb();
  const record = db.issued.find((c) => c.id === id);

  if (!record) {
    return res.status(404).json({ message: "Credential not found" });
  }

  res.json(record);
});

app.listen(PORT, () => {
  console.log(`Issuance service running on port ${PORT} with ${WORKER_ID}`);
});
