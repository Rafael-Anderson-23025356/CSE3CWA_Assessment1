import { Router } from "express";
import { getAllQuotes, createQuote, deleteQuote, getQuote, editQuote } from "../db.js";

const quotesRouter = Router();

quotesRouter.get("/test", (req, res) => {
    return res.status(200).json({"test": "Successful!"});
})

quotesRouter.get("/getAllQuotes", (req, res) => {
    try {
        const quotes = getAllQuotes();
        return res.status(200).json(quotes);
    } catch (err) {
        return res.status(500).json(err);
    }
})

quotesRouter.get("/getQuote/:quoteID", (req, res) => {
    try {
        const { quoteID } = req.params;
        const quote = getQuote(quoteID);
        return res.status(200).json(quote);
    } catch (err) {
        return res.status(500).json(err);
    }
})

quotesRouter.post("/", (req, res) => {
    try {
        const quote = req.body;
        const quoteID = createQuote(quote);
        return res.status(201).json({quoteID});
    } catch (err) {
        return res.status(500).json(err)
    }
})

quotesRouter.put("/:quoteID", (req, res) => {
    try {
        const quote = req.body;
        const { quoteID } = req.params;
        editQuote(quoteID, quote);
        return res.status(200).json({quoteID});
    } catch (err) {
        return res.status(500).json(err)
    }
})

quotesRouter.delete("/:quoteID", (req, res) => {
    try{
        const { quoteID } = req.params;
        deleteQuote(quoteID);
        return res.status(200).json({ message: "Quote deleted." });
    }catch(err){
        return res.status(500).json(err)
    }
})


export default quotesRouter;