
import "./Inicio.css"
import {Link} from'react-router-dom'


export function Inicio(){
    return (
    <section className="backLine">
        <header>
            <nav className="navbar">
                <Link to='/'>Home</Link>
                <Link to='/Login'>Login</Link>
                <Link to='/Register'>Register</Link>
            </nav>
        </header>
        <h1 className="title">Bienvenido</h1>
        <form>
            <label className="letras">
             Email:
                <input className="colorlabel" type="email" name="email" required/>
            </label>
            <label className="letras">
            Clave: 
            <input className="colorlabel" type="password" name="Clave" required/></label>
            <input href="../Registro.jsx" className="button" type="submit" value="Register"/>
        </form>
        
    </section>

    )
}