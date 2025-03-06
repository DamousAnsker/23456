import { useState } from "react";
import "../css/login.css";  // Asegúrate de tener el archivo CSS de login
import logo from "../img/foto ariaztia.png"; // Imagen del logo

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        // Guardar el token en localStorage
        localStorage.setItem('token', data.token);
        console.log('Login exitoso');
        window.location.href = 'http://localhost:5173/datos';  // Redirigir a la página de datos
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Hubo un error al iniciar sesión.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Imagen de Ariaztia */}
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </div>
        {/* Formulario de login */}
        <div className="form-container">
          <h1 className="title-login">Iniciar Sesión</h1>
          <label className="letras">
            Email:
            <input
              className="labels-inicio"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo"
              required
            />
          </label>
          <label className="letras">
            Clave:
            <input
              className="labels-inicio"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </label>
          <div className="botones-login">
            <button className="button1" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
