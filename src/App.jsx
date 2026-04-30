import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/useAuth"
import MyNavbar from "./components/MyNavbar"
import MyFooter from "./components/MyFooter"
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

// Route protetta — solo utenti loggati
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

// Route admin — solo redazione
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user?.isRedazione ? children : <Navigate to="/" />
}

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
          <Route
            path="/crea"
            element={
              <PrivateRoute>
                <Editor />
              </PrivateRoute>
            }
          />
          <Route
            path="/impostazioni"
            element={
              <PrivateRoute>
                <Impostazioni />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <MyFooter />
    </BrowserRouter>
  )
}

export default App