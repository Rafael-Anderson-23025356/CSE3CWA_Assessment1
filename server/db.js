import Database from "better-sqlite3";
import path from "path"

const db = new Database(path.join(import.meta.dirname, "healthcoversim.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        cover_type TEXT NOT NULL,
        applicant1_age INTEGER NOT NULL,
        applicant1_cover_history TEXT NOT NULL,
        applicant2_age INTEGER,
        applicant2_cover_history TEXT,
        hospital_cover TEXT NOT NULL,
        extras_cover TEXT NOT NULL,
        payment_frequency TEXT NOT NULL,
        annual_discount REAL,
        notes TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        CHECK (cover_type = 'Single'
               OR (applicant2_age IS NOT NULL AND applicant2_cover_history IS NOT NULL))
        CHECK (payment_frequency = 'Monthly'
               OR annual_discount IS NOT NULL)
    )
`);

export const getAllQuotes = () => {
    return db.prepare("SELECT * FROM quotes ORDER BY created_at DESC, id DESC").all();
}

export const getQuote = (id) => {
    return db.prepare("SELECT * FROM quotes WHERE id = ?").get(id);
}

export const createQuote = (quote) => {
    const result = db.prepare(`
        INSERT INTO quotes (customer_name, cover_type, applicant1_age, applicant1_cover_history, applicant2_age, applicant2_cover_history, hospital_cover, extras_cover, payment_frequency, annual_discount, notes) 
        VALUES (@customer_name, @cover_type, @applicant1_age, @applicant1_cover_history, @applicant2_age, @applicant2_cover_history, @hospital_cover, @extras_cover, @payment_frequency, @annual_discount, @notes) 
    `).run(quote);

    return result.lastInsertRowid;
}

export const editQuote = (id, quote) => {
    db.prepare(`
        UPDATE quotes
        SET customer_name = @customer_name,
            cover_type = @cover_type,
            applicant1_age = @applicant1_age,
            applicant1_cover_history = @applicant1_cover_history,
            applicant2_age = @applicant2_age,
            applicant2_cover_history = @applicant2_cover_history,
            hospital_cover = @hospital_cover,
            extras_cover = @extras_cover,
            payment_frequency = @payment_frequency,
            annual_discount = @annual_discount,
            notes = @notes
        WHERE id = @id
    `).run({ ...quote, id }); 
}

export const deleteQuote = (id) => {
    db.prepare(`
        DELETE FROM quotes WHERE id = ?;    
    `).run(id);
}

export default db;