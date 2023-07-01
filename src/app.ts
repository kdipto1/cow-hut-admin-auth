import cors from "cors";
import express, { Application, urlencoded } from "express";
import router from "./app/routes";
import globalErrorHandle from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
const app: Application = express();

/* CORS And Parse Use*/
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", async (req, res) => {
  res.send("Hello Server!");
});

app.use(globalErrorHandle);

export default app;
