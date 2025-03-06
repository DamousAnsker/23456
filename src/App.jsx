<<<<<<< HEAD
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
=======
import { Login } from './Login'
import { Register } from './Register'
import { Inicio } from './Inicio'
import './App.css'
import {Routes,Route,Link} from'react-router-dom'
import Datos from './Datos'

function App() {
  return (
    <>

     {/* <nav className="navbar">
        <Link to='/'>Home</Link>
        <Link to='/Login'>Login</Link>
        <Link to='/Register'>Register</Link>
      </nav> */}

      
      <Routes>
        <Route path='/' element={<Inicio/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/datos' element={<Datos/>} />
      </Routes>    

    </>
  )
}

export default App
>>>>>>> 31e1d0cea6eb9a3ac71a7ff415edb0b23d221b11
