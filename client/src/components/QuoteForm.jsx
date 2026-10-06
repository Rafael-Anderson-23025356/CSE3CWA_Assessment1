import { useState } from "react"
import Navbar from "../components/Navbar"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "./BreadCrumb.jsx";

function QuoteForm({ createQuote, quote }) {
    const [customerName, setCustomerName] = useState(quote?.customer_name ?? "");
    const [age, setAge] = useState(String(quote?.applicant1_age ?? ""));
    const [age2, setAge2] = useState(String(quote?.applicant2_age ?? ""));
    const [annualPaymentDiscount, setAnnualPaymentDiscount] = useState(String(quote?.annual_discount ?? ""));
    const [coverType, setCoverType] = useState(quote?.cover_type ?? "");
    const [hospitalCoverHistory, setHospitalCoverHistory] = useState(quote?.applicant1_cover_history ?? "");
    const [hospitalCoverHistory2, setHospitalCoverHistory2] = useState(quote?.applicant2_cover_history ?? "");
    const [hospitalCoverLevel, setHospitalCoverLevel] = useState(quote?.hospital_cover ?? "");
    const [extrasCoverHotel, setExtrasCoverHotel] = useState(quote?.extras_cover ?? "");   
    const [paymentFrequency, setPaymentFrequency] = useState(quote?.payment_frequency ?? "");
    const [notes, setNotes] = useState(quote?.notes ?? "");
    const {id} = useParams();

    const isMultiple = coverType === "Couple" || coverType === "Family";
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        let newErrors = {};
        const checkEmpty = (key, value, message) => {
            if (!value.trim()) newErrors[key] = message;
        };

        checkEmpty("customerName", customerName, "Enter the customer's name.");
        checkEmpty("age", age, isMultiple ? "Enter Applicant 1's age." : "Enter the applicant's age.");
        checkEmpty("coverType", coverType, "Select the cover type.");
        checkEmpty("hospitalCoverHistory", hospitalCoverHistory, isMultiple ? "Select Applicant 1's hospital cover history." : "Select the applicant's hospital cover history.");
        checkEmpty("hospitalCoverLevel", hospitalCoverLevel, "Select the hospital cover level.");
        checkEmpty("extrasCoverHotel", extrasCoverHotel, "Select the extras cover level.");
        checkEmpty("paymentFrequency", paymentFrequency, "Select the payment frequency.");

        if (isMultiple){
            checkEmpty("age2", age2, "Enter Applicant 2's age.");
            checkEmpty("hospitalCoverHistory2", hospitalCoverHistory2, "Select applicant 2's hospital cover history.");
        }
        if (paymentFrequency === "Yearly") {
            checkEmpty("annualPaymentDiscount", annualPaymentDiscount, "Enter a discount from 0 to 10, or choose Monthly payment.")
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0){
            let payload = {
                customer_name: customerName,
                cover_type: coverType,
                applicant1_age: Number(age),
                applicant1_cover_history: hospitalCoverHistory,
                applicant2_age: isMultiple ? Number(age2): null,
                applicant2_cover_history: isMultiple ? hospitalCoverHistory2: null,
                hospital_cover: hospitalCoverLevel,
                extras_cover: extrasCoverHotel,
                payment_frequency: paymentFrequency,
                annual_discount: paymentFrequency == "Yearly" ? Number(annualPaymentDiscount): null,
                notes: notes
            }
            try{
                let res;
                if (createQuote){
                    res = await axios.post("http://localhost:5000/api/quotes", payload);
                }else{
                    res = await axios.put(`http://localhost:5000/api/quotes/${id}`, payload);
                }
                const {quoteID} = res.data;
                navigate(`/quotes/${quoteID}`)
            }catch(err){
                if (err.response) {
                    console.log("Server message:", err.response.data.message);
                    console.log("Details:", err.response.data.errors);
                } else if (err.request) {
                    console.log("No response from server:", err.message);
                } else {
                    console.log("Request setup error:", err.message);
                }
            }
        }
    }

    return (
        <div className="font-inter">
            <Navbar />
            <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 max-w-[700px] mx-auto">
                {!createQuote && (
                    <Breadcrumb
                        items={[
                            { to: "/quotes", label: "All Quotes" },
                            { to: `/quotes/${id}`, label: `Quote #${id}` },
                            { to: `/quotes/${id}/edit`, label: `Edit` },
                        ]}
                    />
                )}
                <p className="text-[20px] font-semibold mb-1">
                    {createQuote ? "Create a Quote": "Edit Quote"}
                </p>
                <p className="text-gray-600">
                    {createQuote ? "Fill in the details below to get an estimated monthly and yearly premium.": "Update the details below to recalculate your estimated monthly and yearly premium."}
                </p>
                <form onSubmit={handleSubmit}>
                    <p className="font-semibold mt-8">Customer Name <span className="text-red-600">*</span></p>
                    <input 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        type="text"
                        placeholder="e.g. Jane Smith"
                        className="border w-[100%] rounded-sm mt-2 px-3 py-2 border border-gray-300 outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200" 
                    />
                    {errors.customerName && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.customerName}</p>}

                    <p className="font-semibold mt-4">Cover Type <span className="text-red-600">*</span></p>    
                    <select
                        value={coverType}
                        onChange={(e) => {
                            setCoverType(e.target.value);
                        }}
                        className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${coverType == "" ? "text-gray-500/80": "text-gray-900"}`}
                    >
                        <option value="" disabled>Select cover type</option>
                        <option value="Single" className="text-gray-900">Single</option>
                        <option value="Couple" className="text-gray-900">Couple</option>
                        <option value="Family" className="text-gray-900">Family</option>
                    </select>
                    {errors.coverType && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.coverType}</p>}

                    <p className="font-semibold mt-4">{isMultiple ? "Applicant 1 Age": "Age"} <span className="text-red-600">*</span></p>
                    <input 
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        type="number"
                        min="18"
                        max="100"
                        placeholder="e.g. 35"
                        className="border w-[100%] rounded-sm mt-2 px-3 py-2 border border-gray-300 outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200" 
                    />
                    {errors.age && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.age}</p>}

                    <p className="font-semibold mt-4">{isMultiple ? "Applicant 1 Hospital Cover History": "Hospital Cover History"} <span className="text-red-600">*</span></p>    
                    <select
                        value={hospitalCoverHistory}
                        onChange={(e) => {setHospitalCoverHistory(e.target.value)}}
                        className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${hospitalCoverHistory == "" ? "text-gray-500/80": "text-gray-900"}`}
                    >
                        <option value="" disabled>Select hospital cover history</option>
                        <option value="Yes" className="text-gray-900">Yes</option>
                        <option value="No" className="text-gray-900">No</option>
                        <option value="Not Sure" className="text-gray-900">Not Sure</option>
                    </select>
                    {errors.hospitalCoverHistory && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.hospitalCoverHistory}</p>}

                    {isMultiple && (
                        <div>
                            <p className="font-semibold mt-4">Applicant 2 Age <span className="text-red-600">*</span></p>
                            <input 
                                value={age2}
                                onChange={(e) => setAge2(e.target.value)}
                                type="number"
                                min="18"
                                max="100"
                                placeholder="e.g. 35"
                                className="border w-[100%] rounded-sm mt-2 px-3 py-2 border border-gray-300 outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200" 
                            />
                            {errors.age2 && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.age2}</p>}

                            <p className="font-semibold mt-4">Applicant 2 Hospital Cover History <span className="text-red-600">*</span></p>    
                            <select
                                value={hospitalCoverHistory2}
                                onChange={(e) => {setHospitalCoverHistory2(e.target.value)}}
                                className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${hospitalCoverHistory2 == "" ? "text-gray-500/80": "text-gray-900"}`}
                            >
                                <option value="" disabled>Select hospital cover history</option>
                                <option value="Yes" className="text-gray-900">Yes</option>
                                <option value="No" className="text-gray-900">No</option>
                                <option value="Not Sure" className="text-gray-900">Not Sure</option>
                            </select>
                            {errors.hospitalCoverHistory2 && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.hospitalCoverHistory2}</p>}
                        </div>
                    )}

                    <p className="font-semibold mt-4">Hospital Cover Level <span className="text-red-600">*</span></p>    
                    <select
                        value={hospitalCoverLevel}
                        onChange={(e) => {setHospitalCoverLevel(e.target.value)}}
                        className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${hospitalCoverLevel == "" ? "text-gray-500/80": "text-gray-900"}`}
                    >
                        <option value="" disabled>Select hospital cover level</option>
                        <option value="None" className="text-gray-900">None</option>
                        <option value="Basic" className="text-gray-900">Basic</option>
                        <option value="Bronze" className="text-gray-900">Bronze</option>
                        <option value="Silver" className="text-gray-900">Silver</option>
                        <option value="Gold" className="text-gray-900">Gold</option>
                    </select>
                    {errors.hospitalCoverLevel && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.hospitalCoverLevel}</p>}

                    <p className="font-semibold mt-4">Extras cover level <span className="text-red-600">*</span></p>    
                    <select
                        value={extrasCoverHotel}
                        onChange={(e) => {setExtrasCoverHotel(e.target.value)}}
                        className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${extrasCoverHotel == "" ? "text-gray-500/80": "text-gray-900"}`}
                    >
                        <option value="" disabled>Select extras cover level</option>
                        <option value="None" className="text-gray-900">None</option>
                        <option value="Basic" className="text-gray-900">Basic</option>
                        <option value="Standard" className="text-gray-900">Standard</option>
                        <option value="Premium" className="text-gray-900">Premium</option>
                    </select>
                    {errors.extrasCoverHotel && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.extrasCoverHotel}</p>}

                    <p className="font-semibold mt-4">Payment Frequency <span className="text-red-600">*</span></p>    
                    <select
                        value={paymentFrequency}
                        onChange={(e) => {
                            setPaymentFrequency(e.target.value);
                            setErrors((prev) => ({ ...prev, annualPaymentDiscount: undefined }));
                        }}
                        className={`w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200 ${paymentFrequency == "" ? "text-gray-500/80": "text-gray-900"}`}
                    >
                        <option value="" disabled>Select hospital payment frequency</option>
                        <option value="Monthly" className="text-gray-900">Monthly</option>
                        <option value="Yearly" className="text-gray-900">Yearly</option>
                    </select>
                    {errors.paymentFrequency && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.paymentFrequency}</p>}

                    {paymentFrequency == "Yearly" && (
                        <div>
                            <p className="font-semibold mt-4">Annual-payment discount (%) <span className="text-red-600">*</span></p>
                            <input 
                                value={annualPaymentDiscount}
                                onChange={(e) => setAnnualPaymentDiscount(e.target.value)}
                                type="number"
                                className="border w-[100%] rounded-sm mt-2 px-3 py-2 border border-gray-300 outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200" 
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder="e.g. 5"
                            />
                            {errors.annualPaymentDiscount && <p className="text-red-600 mt-1 text-[0.9rem]">{errors.annualPaymentDiscount}</p>}
                        </div>

                    )}

                    <p className="font-semibold mt-4">Notes</p>    
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-sm outline-none focus:border-[#4294F8] focus:ring-2 focus:ring-[#4294F8]/30 transition-colors duration-200"
                        rows={5}
                        placeholder="Optional: any extra details about this quote"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                e.currentTarget.form.requestSubmit();
                            }
                        }}
                    />
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-[#4294F8] hover:bg-[#2E7BE0] text-white rounded-md cursor-pointer transition-colors duration-200 text-[0.9rem] mt-3"
                            onSubmit={handleSubmit}
                        >{createQuote ? "Create Quote": "Edit Quote"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default QuoteForm