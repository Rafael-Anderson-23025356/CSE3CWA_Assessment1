import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import QuoteCreationPage from "./pages/QuoteCreationPage"
import QuoteDetailPage from "./pages/QuoteDetailPage"
import QuoteEditPage from "./pages/QuoteEditPage"
import QuoteListPage from "./pages/QuoteListPage"
import { useScrollToTop } from "./hooks/scrollToTop"

function App() {
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quotes" element={<QuoteListPage />} />
      <Route path="/quotes/new" element={<QuoteCreationPage />} />
      <Route path="/quotes/:id" element={<QuoteDetailPage />} />
      <Route path="/quotes/:id/edit" element={<QuoteEditPage />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  )
}

export default App