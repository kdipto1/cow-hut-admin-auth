import cors from "cors";
import express, { Application, urlencoded } from "express";

const app: Application = express();

/* CORS And Parse Use*/
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello Server!");
});

export default app;
