// FRONTEND - Edit.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Edit() {
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();
  
    const handleUpdate = async () => {
        if (!email || !nombre || !apellido || !role) {
            alert("Por favor, complete todos los campos.");
            return;
        }
  
        try {
            const response = await fetch("http://localhost:3333/update-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, nombre, apellido, role }),
            });
  
            const data = await response.json();
  
            if (data.success) {
                alert("Usuario actualizado correctamente.");
                navigate("/datos");
            } else {
                alert(data.message || "Error en la actualización.");
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-2 bg-blue"></div>
                <div className="col-8 d-flex justify-content-center align-items-center">
                    <div className="backLine-register d-flex flex-column">
                        <h1 className="title-register">Actualizar Usuario</h1>
                        <label className="letras">
                            Correo:
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
                            Rol:
                            <select
                                className="colorlabel"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="" disabled >Seleccione un rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Operario">Operario</option>
                            </select>
                        </label>
                        <div className="col-10 d-flex justify-content-center">
                            <button className="button1" onClick={handleUpdate}>Actualizar</button>
                            <button className="button2" onClick={() => navigate("/datos")}>Volver</button>
                        </div>
                    </div>
                </div>
                <div className="col-2 bg-blue"></div>
            </div>
        </div>
    );
}
