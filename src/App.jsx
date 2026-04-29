import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Categoria from "./pages/Categoria"
import ArticoloSingolo from "./pages/ArticoloSingolo"
import ProfiloUtente from "./pages/ProfiloUtente"
import Editor from "./pages/Editor"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Manifesto from "./pages/Manifesto"
import Impostazioni from "./pages/Impostazioni"
import Admin from "./pages/Admin"
import MyNavbar from "./components/MyNavbar";
import MyFooter from "./components/MyFooter"

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categoria/:nome" element={<Categoria />} />
          <Route path="/articolo/:id" element={<ArticoloSingolo />} />
          <Route path="/@:handle" element={<ProfiloUtente />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crea" element={<Editor />} />
          <Route path="/impostazioni" element={<Impostazioni />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <MyFooter />
    </BrowserRouter>
  )
}

export default App