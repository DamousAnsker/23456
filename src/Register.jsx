import { useState } from "react";
import "./Register.css"
import {useLocation,Link} from'react-router-dom'

export function Register(){
    const location = useLocation()

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleregister = async () => {
        console.log('Login request sent...');
        await fetch('http://localhost:3333/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nombre, apellido, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                console.log("=>>>",data)
                
                window.location.href = '/datos'
            }else{
                alert(data.message)
            }
        })
    } 
    return (
    <section className="backLine">
        <header>
            <nav className="navbar">
                <Link to='/'>Home</Link>
                <Link to='/Login'>Login</Link>
                <Link to='/Register'>Register</Link>
            </nav>
        </header>
        <h1 className="title">Register</h1>

            <label className="letras">
             Nombre:
                <input 
                className="colorlabel"
                type="nombre" 
                name="Nombre" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese su nombre:"
                required/>
            </label>
            
            <label className="letras">
            Apellido: 
            <input 
                className="colorlabel"
                type="apellido" 
                name="Apellido" 
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ingrese su apellido:"
                required/>
            </label>

            <label className="letras">
             Email:
                <input
                    className="colorlabel"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su correo:"
                    required/>
            </label>
            
            <label className="letras">
            Clave: 
            <input 
                className="colorlabel"
                type="password"
                name="Clave" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña:"
                required/>
            </label>
            <button className="button" onClick={()=>handleregister()}>Registrar</button>

    </section>

    )
}