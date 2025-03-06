import { useState } from "react";
import "../css/register.css";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/datos");
      } else {
        alert(data.message || "Error en el registro.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-2 bg-blue d-none d-md-block"></div>
        <div className="col-12 col-md-8 d-flex justify-content-center align-items-center">
          <div className="backLine-register d-flex flex-column">
            <h1 className="title.register">Registro</h1>
            <label className="letras">
              Nombre:
              <input
                className="colorlabel"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese su nombre"
                required
              />
            </label>
            <label className="letras">
              Apellido:
              <input
                className="colorlabel"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ingrese su apellido"
                required
              />
            </label>
            <label className="letras">
              Email:
              <input
                className="colorlabel"
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
                className="colorlabel"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
            </label>

            <div className="col-12 d-flex justify-content-center">
              <button className="button1" onClick={handleRegister}>
                Registrar
              </button>
              <button className="button2" onClick={() => navigate("/datos")}>
                Volver
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-2 bg-blue d-none d-md-block"></div>
      </div>
    </div>
  );
}
