import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

function HomePage() {
    return (
        <div className="font-inter">
            <Navbar />
            <HeroSection />
            <div className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24 flex flex-col bg-[#4294F8] text-white">
                <div className="flex flex-col max-w-7xl mx-auto">
                    <p className="text-[24px] lg:text-[30px] font-semibold text-center">How it works</p>
                    <div className="mt-8 flex justify-between relative lg:flex-row flex-col gap-y-12">
                        <div className="hidden lg:block absolute top-1 left-[12.3%] right-[12.3%] h-px -translate-y-1/2 bg-white"></div>
                        <div className="lg:w-[25%]">
                            <div className="bg-white w-2 h-2 rounded-full mx-auto"></div>
                            <p className="text-center text-[20px] font-medium mt-4">Enter details</p>
                            <p className="mt-2 text-center text-sm">Enter applicant and cover details.</p>
                        </div>
                        <div className="lg:w-[25%]">
                            <div className="bg-white w-2 h-2 rounded-full mx-auto"></div>   
                            <p className="text-center text-[20px] font-medium mt-4">We calculate</p>
                            <p className="mt-2 text-center text-sm">Hospital and extras are calculated separately.</p>
                        </div>
                        <div className="lg:w-[25%]">
                            <div className="bg-white w-2 h-2 rounded-full mx-auto"></div>
                            <p className="text-center text-[20px] font-medium mt-4">Get your breakdown</p>
                            <p className="mt-2 text-center text-sm">Get a plain-English breakdown of your monthly and yearly premium.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;