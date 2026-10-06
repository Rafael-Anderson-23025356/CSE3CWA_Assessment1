import QuoteForm from "../components/QuoteForm";

function QuoteCreationPage() {
    return (
        <>
            <title>Create Quote</title>
            <QuoteForm createQuote quote={null} />
        </>
    )
}

export default QuoteCreationPage