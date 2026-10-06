import { useState } from "react"
import Navbar from "../components/Navbar"
import QuoteCard from "../components/QuoteCard"
import axios from "axios"
import { useEffect } from "react"

function QuoteListPage() {
    const [quotes, setQuotes] = useState([]);

    const getQuotes = async() => {
        const res = await axios.get("http://localhost:5000/api/quotes/getAllQuotes");
        setQuotes(res.data);
        return;
    }

    useEffect(() => {
        getQuotes();
    }, [])

    const handleDelete = async(quote) => {
        try{
            await axios.delete(`http://localhost:5000/api/quotes/${quote.id}`);
            getQuotes();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className="font-inter">
            <title>All Quotes</title>
            <Navbar />
            <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 max-w-7xl mx-auto">
                <p className="text-[20px] font-semibold mb-8">
                    All Quotes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quotes.map((quote) => <QuoteCard quote={quote} handleDelete={handleDelete} />)}
                </div>
            </div>
        </div>
    )
}

export default QuoteListPage