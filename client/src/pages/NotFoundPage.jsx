import Navbar from "../components/Navbar"
import { SearchX } from "lucide-react"
import { Link } from "react-router-dom";

function NotFoundPage(){
    return(
        <div className="font-inter min-h-screen flex flex-col w-[100%]">
            <Navbar />
            <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 w-[100%] flex flex-col flex-1">
                <div className="flex items-center justify-center flex-col gap-y-4 flex-1 py-16">
                    <SearchX size={64} />
                    <div className="gap-y-2 text-center">
                        <p>Page not found.</p>
                        <Link to="/" className="underline text-blue-500">Back to home page.</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage;