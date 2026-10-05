import { useNavigate } from "react-router-dom";

function QuoteCard({quote, handleDelete}) {
    const navigate = useNavigate();
    return (
        <div className={`w-[100%] border border-gray-300 rounded-lg px-8 font-inter py-6 flex flex-col justify-center`}>
            <div className="flex-grow">
                <div className="mb-1 flex items-center">
                    <p className="font-semibold text-[18px]">{quote.customer_name}</p>
                    <div className="bg-[#4294F8] py-1 px-2 rounded-md font-medium ml-3">
                        <p className="text-white text-xs">{quote.cover_type}</p>
                    </div>
                </div>
                <div className="text-sm text-gray-600 flex flex-col gap-y-2 mt-4">
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#4294F8] rounded-full" />
                        Hospital cover: {quote.hospital_cover}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full" />
                        Extras cover: {quote.extras_cover}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        Payment frequency: {quote.payment_frequency}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                        Created: {quote.created_at}
                    </p>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <button 
                    className="px-4 py-2 text-sm bg-[#4294F8] hover:bg-[#2E7BE0] text-white rounded-md cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                >View</button>
                <button 
                    className="px-4 py-2 text-sm text-[#4294F8] bg-white border border-[#4294F8] hover:text-[#2E7BE0] hover:border-[#2E7BE0] rounded-md cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/quotes/${quote.id}/edit`)}
                >Edit</button>
                <button
                    onClick={() => handleDelete(quote)}
                    className="px-4 py-2 text-sm font-semibold bg-white text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-lg cursor-pointer transition-colors duration-200"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default QuoteCard;