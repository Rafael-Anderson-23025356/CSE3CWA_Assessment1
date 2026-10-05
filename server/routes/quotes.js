import { Router } from "express";
import { getAllQuotes, createQuote, deleteQuote, getQuote, editQuote } from "../db.js";

const quotesRouter = Router();

const validateQuoteID = (req, res, next) => {
    const { quoteID } = req.params;
    const id = Number(quoteID);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Quote ID must be a positive integer." });
    }

    req.params.quoteID = id;
    next();
}

const validateQuoteBody = (req, res, next) => {
    const body = req.body;
    if (body == null || typeof(body) != "object" || Array.isArray(body)){
        return res.status(400).json({ message: "Request body must be a JSON object." })
    }

    const quoteKeys = [
        "customer_name", "cover_type", "applicant1_age", "applicant1_cover_history", "applicant2_age",
        "applicant2_cover_history", "hospital_cover", "extras_cover", "payment_frequency", "annual_discount", "notes"
    ]

    const missingKeys = quoteKeys.filter((key) => !Object.hasOwn(body, key));
    if (missingKeys.length > 0){
        return res.status(400).json({ message: `Invalid quote data, missing the following keys: ${missingKeys}` })
    }

    next();
}

quotesRouter.get("/getAllQuotes", (req, res) => {
    try {
        const quotes = getAllQuotes();
        return res.status(200).json(quotes);
    } catch (err) {
        return res.status(500).json(err);
    }
})

quotesRouter.get("/getQuote/:quoteID", validateQuoteID, (req, res) => {
    try {
        const { quoteID } = req.params;
        const quote = getQuote(quoteID);
        
        if (!quote) {
            return res.status(404).json({ message: "Quote not found." })
        }

        return res.status(200).json(quote);
    } catch (err) {
        return res.status(500).json(err);
    }
})

quotesRouter.post("/", validateQuoteBody, (req, res) => {
    try {
        const quote = req.body;
        const quoteID = createQuote(quote);
        return res.status(201).json({quoteID});
    } catch (err) {
        return res.status(500).json(err)
    }
})

quotesRouter.put("/:quoteID", validateQuoteID, validateQuoteBody, (req, res) => {
    try {
        const quote = req.body;
        const { quoteID } = req.params;

        const quoteInDatabase = getQuote(quoteID);
        if (!quoteInDatabase){
            return res.status(404).json({ message: "Quote not found." })
        }

        editQuote(quoteID, quote);
        return res.status(200).json({quoteID});
    } catch (err) {
        return res.status(500).json(err)
    }
})

quotesRouter.delete("/:quoteID", validateQuoteID, (req, res) => {
    try{
        const { quoteID } = req.params;

        const quote = getQuote(quoteID);
        if (!quote){
            return res.status(404).json({ message: "Quote not found." })
        }

        deleteQuote(quoteID);
        return res.status(200).json({ message: "Quote deleted." });
    }catch(err){
        return res.status(500).json(err)
    }
})


export default quotesRouter;