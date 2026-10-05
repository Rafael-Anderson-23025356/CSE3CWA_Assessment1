import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (
        <div className="py-4 px-4 md:px-6 lg:px-8 flex border-b border-gray-300/70 text-[#1F2937] top-0 sticky bg-white">
            <p className="text-[20px] lg:text-[24px] font-inter flex-grow">HealthCoverSim</p>
            <div className="hidden lg:flex items-center">
                <p 
                    className="mr-6 cursor-pointer"
                    onClick={() => {
                        navigate("/");
                    }}
                >Home</p>
                <p 
                    className="mr-6 cursor-pointer"
                    onClick={() => {
                        navigate("/quotes/new")
                    }}
                >New Quote</p>
                <p 
                    className="cursor-pointer"
                    onClick={() => {
                        navigate("/quotes")
                    }}    
                >All Quotes</p>
            </div>
        </div>  
    );
}

export default Navbar;