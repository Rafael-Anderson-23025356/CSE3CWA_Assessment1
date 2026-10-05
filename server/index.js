import quotesRouter from "./routes/quotes.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/quotes', quotesRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));