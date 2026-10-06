import { Router } from "express";
import { getAllQuotes, createQuote, deleteQuote, getQuote, editQuote } from "../db.js";
import { COVER_TYPES, HISTORY, HOSPITAL, EXTRAS, FREQUENCY } from "../../client/constants/validOptions.js";

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

const isValidAge = (age) => Number.isInteger(age) && age >= 18 && age <= 100;

const matchOption = (value, options) => {
    if (typeof value !== "string") return null;
    const cleaned = value.trim().toLowerCase();
    return options.find((opt) => opt.toLowerCase() === cleaned) ?? null;
};

const validateQuoteBody = (req, res, next) => {
    const body = req.body;
    const errors = [];

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

    if (typeof body.customer_name !== "string" || body.customer_name.trim() == "") {
        errors.push("customer_name is required.");
    } else {
        body.customer_name = body.customer_name.trim();
    }

    const normalise = (field, options) => {
        const match = matchOption(body[field], options);
        if (match == null){
            errors.push(`${field} must be one of: ${options.join(", ")}.`);
        }else{
            body[field] = match;
        }
        return match;
    }

    if (!isValidAge(req.body.applicant1_age)){
        errors.push("applicant1_age must be an integer within range from 18 to 100.");
    }
    const coverType = normalise("cover_type", COVER_TYPES);
    normalise("applicant1_cover_history", HISTORY);
    normalise("hospital_cover", HOSPITAL);
    normalise("extras_cover", EXTRAS);
    const frequency = normalise("payment_frequency", FREQUENCY);

    if (coverType != "Single"){
        if (!isValidAge(body.applicant2_age)){
            errors.push("applicant2_age must be an integer within range from 18 to 100.");
        }
        normalise("applicant1_cover_history", HISTORY);
    }   

    if (frequency == "Yearly"){
        if (!Number.isFinite(body.annual_discount) || typeof(body.annual_discount) != "number" || body.annual_discount < 0 || body.annual_discount > 10){
            errors.push("annual_discount must be a number from 0 to 10.");
        }
    }
    if (typeof(body.notes) != null && typeof(body.notes) != "string"){
        errors.push("notes must be a string if provided.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Invalid quote data.", errors });
    }

    if (body.cover_type === "Single") {
        body.applicant2_age = null;
        body.applicant2_cover_history = null;
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