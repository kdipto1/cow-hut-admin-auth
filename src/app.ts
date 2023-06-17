import cors from "cors";
import express, { Application, urlencoded } from "express";
import router from "./app/routes";

const app: Application = express();

/* CORS And Parse Use*/
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", async (req, res) => {
  res.send("Hello Server!");
});

export default app;
