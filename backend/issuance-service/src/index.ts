import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Load DB (simple JSON file)
const dbFile = "./src/db.json";
let db: any = { issued: [] };
if (fs.existsSync(dbFile)) {
  db = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}

// Issue Credential API
app.post("/issue", (req: Request, res: Response) => {
  const credential = req.body;
  const exists = db.issued.find((c: any) => c.id === credential.id);

  if (exists) {
    return res.json({ message: "Credential already issued" });
  }

  const workerId = `worker-${Math.floor(Math.random() * 10)}`;
  const record = { ...credential, workerId, timestamp: new Date().toISOString() };
  db.issued.push(record);

  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
  res.json({ message: `credential issued by ${workerId}`, credential: record });
});

app.listen(PORT, () => {
  console.log(`Issuance service running on port ${PORT}`);
});
