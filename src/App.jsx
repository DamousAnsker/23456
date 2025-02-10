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
