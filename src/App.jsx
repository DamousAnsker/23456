import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./protected-rutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {Datos} from "./pages/Datos";
import Dashboard from "./pages/Dashboard";
import Edit from "./pages/edit-user";
import DeleteUser from "./pages/delete-user";
import FormulariosList from "./pages/view-charlas";
import ListaMaquinas from "./pages/view-maquinas";
import FormularioMaquinas from "./pages/inicio-maquinas";


function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/"]; // Agregar rutas que no necesitan navbar

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />
      
      {/* Ruta protegida */}
      <Route element={<ProtectedRoute />}>
        <Route path="/datos" element={<Datos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buscar-charlas" element={<FormulariosList />} />
        <Route path="/buscar-maquinas" element={<ListaMaquinas />} /> 
        <Route path="/inicio-maquinas" element={<FormularioMaquinas/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-user" element={<Edit />} />
        <Route path="/delete-user" element={<DeleteUser />} />
      </Route>
    </Routes>
    </>
  );
}


export default App;
