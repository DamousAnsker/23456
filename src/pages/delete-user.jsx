import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteUser() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!email) {
      alert("Por favor, ingrese un correo electrónico.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Usamos el token de localStorage
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
        setError("");
        setEmail("");  // Limpiamos el campo de email
      } else {
        setMessage("");
        setError("Error al eliminar el usuario.");
      }
    } catch (err) {
      setMessage("");
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-2 bg-blue"></div>
        <div className="col-8 d-flex justify-content-center align-items-center">
          <div className="backLine-register d-flex flex-column">
            <h1 className="title-register">Eliminar Usuario</h1>
            <label className="letras">
              Correo electrónico:
              <input
                className="colorlabel"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese el correo electrónico del usuario"
                required
              />
            </label>

            <div className="col-10 d-flex justify-content-center">
              <button className="button1" onClick={handleDelete}>Eliminar</button>
              <button className="button2" onClick={() => navigate("/datos")}>Volver</button>
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
        <div className="col-2 bg-blue"></div>
      </div>
    </div>
  );
}
