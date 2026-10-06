import { useParams } from "react-router-dom"
import QuoteForm from "../components/QuoteForm";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/BreadCrumb";
import Navbar from "../components/Navbar";
import { SearchX } from "lucide-react";

function QuoteEditPage() {
    const { id } = useParams();
    const [quote, setQuote] = useState(null);
    const [quoteNotFound, setQuoteNotFound] = useState(false);
    useEffect(() => {
        const getQuote = async() => {
            setQuote(null);
            setQuoteNotFound(false);
            try{
                const res = await axios.get(`http://localhost:5000/api/quotes/getQuote/${id}`);
                setQuote(res.data);
            }catch(err){
                if (err.status == 404 || err.status == 400){
                    setQuoteNotFound(true);
                }
            }
        }
            getQuote();
    }, [id]);

    if (quoteNotFound){
        return(
            <div className="font-inter flex flex-col min-h-dvh">
                <Navbar />
                <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 max-w-[700px] mx-auto flex flex-1">
                    <div className="flex items-center justify-center flex-col gap-y-4 flex-1 py-16">
                        <SearchX size={64} />
                        <div className="gap-y-2 text-center">
                            <p>Page not found.</p>
                            <Link to="/quotes" className="underline text-blue-500">Back to quote list.</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <QuoteForm createQuote={false} quote={quote} />
    )
}

export default QuoteEditPage