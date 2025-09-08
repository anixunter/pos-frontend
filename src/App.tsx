import { QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { queryClient } from '@/services/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
