import { useNavigate } from "react-router-dom"

function HeroSection (){
    const navigate = useNavigate();
    return (
        <div className="font-inter px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24 flex flex-col text-[#1F2937] min-h-[85vh] items-center justify-center text-center">
            <p className="text-[28px] md:text-[32px] lg:text-[36px] font-bold">
                Know exactly what you'll pay for health cover.
            </p>
            <p className="mb-8 w-[80%] lg:w-[50%] mt-2 hidden lg:block">
                Get a simple breakdown of your monthly and yearly premium, with every number explained.
            </p>
            <div className="flex flex-col lg:flex-row mt-8 lg:mt-0">
                <button 
                    className="px-6 py-2 text-[0.9rem] bg-[#4294F8] hover:bg-[#2E7BE0] text-white rounded-md cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/quotes/new")}
                >Get a Quote</button>
                <button 
                    className="px-6 py-2 text-[0.9rem] text-[#4294F8] bg-white border border-[#4294F8] hover:text-[#2E7BE0] hover:border-[#2E7BE0] rounded-md mt-4 lg:mt-0 lg:ml-2 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate("/quotes")}
                >View Saved Quotes</button>
            </div>
        </div>
    )
}

export default HeroSection