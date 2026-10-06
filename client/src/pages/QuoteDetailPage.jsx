import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { HOSPITAL_TIERS, EXTRAS_TIERS } from "../../constants/pricing";
import Breadcrumb from "../components/BreadCrumb";
import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

function QuoteDetailPage() {
    const { id } = useParams();
    const [quote, setQuote] = useState(null);
    const [quoteNotFound, setQuoteNotFound] = useState(false);

    useEffect(() => {
        setQuote(null);
        setQuoteNotFound(false);
        const getQuote = async() => {
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

    const calculateLHCPercentage = (age, coverHistory, hospitalCover) => {
        if (
            hospitalCover === "None" ||
            coverHistory === "Yes" ||
            coverHistory?.toLowerCase() === "not sure" ||
            !age ||
            age <= 30
        ) {
            return 0;
        }
        return (age - 30) * 2;
    };

    const isSingle = quote?.cover_type === "Single";
    const isYearly = quote?.payment_frequency === "Yearly";
    const isFamily = quote?.cover_type === "Family";
    const baseHospitalRate = HOSPITAL_TIERS[quote?.hospital_cover] ?? 0;
    const baseExtrasRate = EXTRAS_TIERS[quote?.extras_cover] ?? 0;
    const app1LhcPct = calculateLHCPercentage(quote?.applicant1_age, quote?.applicant1_cover_history, quote?.hospital_cover);
    const hospitalPremium = baseHospitalRate * (1 + app1LhcPct / 100);
    const app2LhcPct = !isSingle ? calculateLHCPercentage(quote?.applicant2_age, quote?.applicant2_cover_history, quote?.hospital_cover): 0;
    const hospitalPremium2 = !isSingle ? baseHospitalRate * (1 + app2LhcPct / 100) : 0;
    const hospitalSubtotal = hospitalPremium + hospitalPremium2;
    const adultCount = isSingle ? 1 : 2;
    const extrasTotal = baseExtrasRate * adultCount;
    const familyFee = isFamily ? 30 : 0;
    const monthlyPremium = hospitalSubtotal + extrasTotal + familyFee;
    const yearlyPremium = monthlyPremium * 12;
    const annualDiscountPct = quote?.annual_discount ?? 0;
    const discountedYearlyPremium = yearlyPremium * (1 - annualDiscountPct / 100);
    const app1NotSure = quote?.applicant1_cover_history?.toLowerCase() === "not sure";
    const app2NotSure = !isSingle && quote?.applicant2_cover_history?.toLowerCase() === "not sure";
    
    if (quoteNotFound){
        return(
            <div className="font-inter min-h-screen flex flex-col w-[100%]">
                <Navbar />
                <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 w-[100%] flex flex-col flex-1">
                    <div className="flex items-center justify-center flex-col gap-y-4 flex-1 py-16">
                        <SearchX size={64} />
                        <div className="gap-y-2 text-center">
                            <p>It may have been deleted, or the link may be wrong.</p>
                            <Link to="/quotes" className="underline text-blue-500">Back to quote list</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="font-inter">
            <Navbar />
            <div className="px-4 md:px-6 lg:px-8 pt-8 pb-16 max-w-7xl mx-auto">
                <Breadcrumb
                    items={[
                        { to: "/quotes", label: "All Quotes" },
                        { to: `/quotes/${id}`, label: `Quote #${id}` },
                    ]}
                />
                <p className="text-[20px] font-semibold mb-8">
                    Quote Details
                </p>
                <div className="flex flex-col md:flex-row gap-x-4 gap-y-4">
                    <div className="w-[100%] md:w-[50%] border border-gray-300 rounded-lg px-8 py-6">
                        <p className="font-semibold text-[18px] mb-4">Policy Configuration</p>
                        <div className="gap-y-2 flex flex-col">
                            <p>Customer Name: {quote?.customer_name}</p>
                            <p>Cover Type: {quote?.cover_type}</p>
                            <p>{isSingle ? "Age": "Applicant 1 Age"}: {quote?.applicant1_age}</p>
                            <p>{isSingle ? "Hospital Cover History": "Applicant 1 Hospital Cover History"}: {quote?.applicant1_cover_history}</p>

                            {!isSingle && (
                                <>
                                    <p>Applicant 2 Age: {quote?.applicant2_age}</p>
                                    <p>Applicant 2 Hospital Cover History: {quote?.applicant2_cover_history}</p>
                                </>
                            )}
                            <p>Hospital Cover Level: {quote?.hospital_cover}</p>
                            <p>Extras cover level: {quote?.extras_cover}</p>
                            <p>Payment Frequency: {quote?.payment_frequency}</p>
                            {quote?.payment_frequency == "Yearly" && <p>Annual-payment discount (%): {quote?.annual_discount}</p>}
                            <p>Notes: {quote?.notes?.trim() == "" ? "-": quote?.notes ?? "-"}</p>
                        </div>
                    </div>
                    <div className="w-[100%] md:w-[50%] border border-gray-300 rounded-lg px-8 py-6 flex flex-col">
                        <p className="font-semibold text-[18px] mb-4">Cost Breakdown</p>
                        <div className="gap-y-2 flex flex-col flex-grow">
                            <p>{quote?.cover_type == "Single" ? "Hospital Premium:": "Applicant 1 Hospital Premium:"} ${hospitalPremium.toFixed(2)}/mo</p>
                            {!isSingle && (
                                <>
                                    <p>Applicant 2 Hospital Premium: ${hospitalPremium2?.toFixed(2)}/mo</p>
                                    <p>Total Hospital Subtotal: ${hospitalSubtotal?.toFixed(2)}/mo</p>
                                </>
                            )}
                            <p>Extras Cover Subtotal: ${extrasTotal.toFixed(2)}/mo</p>
                            {quote?.cover_type == "Family" && (
                                <p>Family Upgrade Fee: $30.00/mo</p>
                            )}
                            <p>Estimated Monthly Premium: ${monthlyPremium.toFixed(2)}</p>
                            <p>{quote?.payment_frequency == "Yearly" ? "Yearly Premium (Before Discount):": "Yearly Premium:"} ${yearlyPremium.toFixed(2)}</p>
                            {quote?.payment_frequency == "Yearly" && (
                                <p>Yearly Premium (After Discount): ${discountedYearlyPremium.toFixed(2)}</p>
                            )}
                        </div>
                        <p className="text-amber-600 text-sm mt-4 font-medium">Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.</p>
                        {app1NotSure && (
                            <p className="text-amber-600 text-sm mt-2 font-medium">
                                Applicant 1 Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.
                            </p>
                        )}
                        {app2NotSure && (
                            <p className="text-amber-600 text-sm mt-2 font-medium">
                                Applicant 2 Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full border border-gray-300 rounded-lg px-8 py-6 mt-6">
                    <p className="font-semibold text-[18px] mb-4">Calculation Breakdown</p>
                    <div className="gap-y-4 flex flex-col text-sm md:text-base">
                        <div className="flex flex-col gap-y-2">
                            <p className="font-semibold text-gray-800">1. Hospital Cover Calculation</p>
                            <p className="ml-4">
                                Base Rate ({quote?.hospital_cover}): ${baseHospitalRate.toFixed(2)}/mo
                            </p>
                            <p className="ml-4">
                                {isSingle ? "LHC Loading:" : "Applicant 1 LHC Loading:"}{" "}
                                {app1LhcPct > 0 
                                    ? `Age ${quote?.applicant1_age} (>30) with no previous cover → (${quote?.applicant1_age} - 30) × 2% = ${app1LhcPct}% loading`
                                    : `0% (${quote?.applicant1_cover_history === "Yes" ? "Has prior cover" : quote?.applicant1_age <= 30 ? "Age ≤ 30" : "Cover history unknown"})`}
                            </p>
                            <p className="ml-4">
                                {isSingle ? "Hospital Cost:" : "Applicant 1 Hospital Cost:"}{" "}
                                ${baseHospitalRate.toFixed(2)} × (1 + {app1LhcPct}%) =${hospitalPremium.toFixed(2)}/mo
                            </p>

                            {!isSingle && (
                                <div className="flex flex-col gap-y-2">
                                    <p className="ml-4">
                                        Applicant 2 LHC Loading:{" "}
                                        {app2LhcPct > 0 
                                            ? `Age ${quote?.applicant2_age} (>30) with no previous cover → (${quote?.applicant2_age} - 30) × 2% = ${app2LhcPct}% loading`
                                            : `0% (${quote?.applicant2_cover_history === "Yes" ? "Has prior cover" : quote?.applicant2_age <= 30 ? "Age ≤ 30" : "Cover history unknown"})`}
                                    </p>
                                    <p className="ml-4">
                                        Applicant 2 Hospital Cost: ${baseHospitalRate.toFixed(2)} × (1 + {app2LhcPct}%) =${hospitalPremium2.toFixed(2)}/mo
                                    </p>
                                    <p className="ml-4 font-medium text-gray-700">
                                        Total Hospital Subtotal: ${hospitalPremium.toFixed(2)} + ${hospitalPremium2.toFixed(2)} =${hospitalSubtotal.toFixed(2)}/mo
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <p className="font-semibold text-gray-800">2. Extras Cover Calculation</p>
                            <p className="ml-4">
                                Base Rate ({quote?.extras_cover}): ${baseExtrasRate.toFixed(2)}/mo per adult
                            </p>
                            <p className="ml-4">
                                Total Extras Cost: ${baseExtrasRate.toFixed(2)} × {adultCount} {adultCount === 1 ? "adult" : "adults"} = ${extrasTotal.toFixed(2)}/mo
                            </p>
                        </div>

                        {isFamily && (
                            <div className="flex flex-col gap-y-2">
                                <p className="font-semibold text-gray-800">3. Family Upgrade Fee</p>
                                <p className="ml-4">
                                    Fixed tier surcharge for Family cover: +$30.00/mo
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-y-2">
                            <p className="font-semibold text-gray-800">
                                {isFamily ? "4. Estimated Monthly Premium" : "3. Estimated Monthly Premium"}
                            </p>
                            <p className="ml-4">
                                ${hospitalSubtotal.toFixed(2)} (Hospital) +${extrasTotal.toFixed(2)} (Extras)
                                {isFamily ? " + $30.00 (Family Fee)" : ""} = ${monthlyPremium.toFixed(2)}/mo
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <p className="font-semibold text-gray-800">
                                {isFamily ? "5. Annual Payment & Discounts" : "4. Annual Payment & Discounts"}
                            </p>
                            <p className="ml-4">
                                Standard Annual Total: ${monthlyPremium.toFixed(2)} × 12 months = ${yearlyPremium.toFixed(2)}
                            </p>
                            {isYearly ? (
                                <p className="ml-4 text-emerald-700 font-medium">
                                    Annual Payment Discount ({annualDiscountPct}%): ${yearlyPremium.toFixed(2)} × (1 - {annualDiscountPct}%) =${discountedYearlyPremium.toFixed(2)}
                                </p>
                            ) : (
                                <p className="ml-4 text-gray-600 text-sm">
                                    Payment frequency selected is Monthly (No annual discount applied).
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuoteDetailPage