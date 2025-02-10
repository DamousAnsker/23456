import { useState } from "react";
import "./Login.css"
import {useLocation,Link} from'react-router-dom'

export function Login(){
    const location = useLocation()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlelogin = async () => {
        console.log('Login request sent...');
        await fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
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
        <h1 className="title">Login</h1>
        
            <label className="letras">
             Email:
                <input
                    className="colorlabel"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su correo"
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
                    required/>
            </label>
            <button  className="button" onClick={()=>handlelogin()} >Entrar</button>
            
        
    </section>

    )
}