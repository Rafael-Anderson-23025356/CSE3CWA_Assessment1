import { useParams } from "react-router-dom"
import QuoteForm from "../components/QuoteForm";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function QuoteEditPage() {
    const { id } = useParams();
    const [quote, setQuote] = useState(null);
    useEffect(() => {
        const getQuote = async() => {
            setQuote(null);
            const res = await axios.get(`http://localhost:5000/api/quotes/getQuote/${id}`);
            setQuote(res.data);
        }
            getQuote();
    }, [id]);

    if (!quote) return <div className="p-8 text-center">Loading quote details...</div>;
    return (
        <QuoteForm createQuote={false} quote={quote} />
    )
}

export default QuoteEditPage