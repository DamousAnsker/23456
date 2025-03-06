import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/datos.css";

export function Datos() {
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [tema, setTema] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [area, setArea] = useState('');
    const [file, setFile] = useState(null); // Estado para manejar el archivo
    const [empresa, setEmpresa] = useState("");
    const [rutEmpresa, setRutEmpresa] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleEmpresaChange = (e) => {
        const empresaSeleccionada = e.target.value;
        setEmpresa(empresaSeleccionada);
        setRutEmpresa(empresaSeleccionada === "Agroindustrial El Paico" ? "96.590.000-4" : 
                      empresaSeleccionada === "Industrial Ochagavia" ? "77.835.800-K" : "");
      };
    
      const handleRespuestasChange = (e) => {
        const { name, value } = e.target;
        setRespuestas((prevRespuestas) => {
          const updatedRespuestas = [...prevRespuestas];
          const index = updatedRespuestas.findIndex((res) => res.pregunta === name);
          if (index >= 0) {
            updatedRespuestas[index].respuesta = value;
          } else {
            updatedRespuestas.push({ pregunta: name, respuesta: value });
          }
          return updatedRespuestas;
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                console.log("No hay token, redirigiendo a Login");
                navigate("/"); // Redirige a la página de login si no hay token
                return;
            }

            try {
                const response = await fetch("http://localhost:3333/datos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`  // Corregir la interpolación de la cadena
                    }
                });

                const data = await response.json();

                if (data.success) {
                    console.log("Usuario autenticado");
                } else {
                    console.log("Usuario no autenticado, redirigiendo a Login");
                    navigate("/"); // Redirige a login si no es válido
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                navigate("/"); // Redirige a login si hay un error
            }
        };

        fetchUserData();
    }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("rut", rut);
        formData.append("email", email);
        formData.append("tema", tema);
        formData.append("descripcion", descripcion);
        formData.append("area", area);
        if (file) {
            formData.append("image", file); // Subir la imagen si existe
        }

        try {
            const response = await fetch("http://localhost:3333/enviar-formulario", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}` // Corregir la interpolación de la cadena
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert("Datos enviados correctamente");
                setNombre('');
                setRut('');
                setEmail('');
                setTema('');
                setDescripcion('');
                setArea('');
                setFile(null); // Limpiar el archivo después de enviar
            } else {
                alert("Error al enviar los datos");
            }
        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("Hubo un problema al enviar el formulario");
        }
    };

    return (
<div className="container-fluid mt-5 pt-5">
    <div className="row justify-content-center d-flex flex-column-reverse flex-lg-row">
        {/* Formulario */}
        <div className="col-lg-6 overflow-auto">
            <div className="card shadow p-4 rounded" style={{ maxHeight: "170vh", overflow: "hidden" }}>
                <div className="card-body">
                    <h4 className="text-center mb-4">Formulario Charlas SGI</h4>

                    <div className="mb-3">
                        <label className="form-label">Temario</label>
                        <select className="form-control" value={tema} onChange={(e) => setTema(e.target.value)}>
                            <option value="" disabled>Seleccione el Temario</option>
                            <option>Calidad</option>
                            <option>MedioAmbiente</option>
                            <option>Prevención</option>
                            <option>Eficiencia</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción del Tema</label>
                        <input type="text" className="form-control" placeholder="Ingrese la descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" placeholder="Ingrese su nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">RUT</label>
                        <input type="text" className="form-control" placeholder="Ingrese su RUT" value={rut} onChange={(e) => setRut(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="Ingrese su email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Área/Sección</label>
                        <select className="form-control" value={area} onChange={(e) => setArea(e.target.value)} required>
                            <option value="" disabled>Seleccione el Área/Sección</option>
                            <option>TROZADO AUTOMATICO</option>
                            <option>TROZADO BANDEJITAS</option>
                            <option>CAMARA</option>
                            <option>FAENA RECEPCION</option>
                            <option>FAENA EVISCERADO</option>
                            <option>BODEGA</option>
                            <option>SSGG DIA</option>
                            <option>SSGG NOCHE</option>
                            <option>MANTENIMIENTO</option>
                            <option>SUMINISTROS</option>
                            <option>CALIDAD</option>
                            <option>ADMINISTRACION</option>
                            <option>INFRAESTRUCTURA</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Empresa</label>
                        <select value={empresa} onChange={handleEmpresaChange} required className="form-control">
                            <option value="" disabled>Seleccione la empresa</option>
                            <option>Agroindustrial El Paico</option>
                            <option>Industrial Ochagavia</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">RUT Empresa</label>
                        <input type="text" value={rutEmpresa} readOnly className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Adjuntar Imagen</label>
                        <input className="form-control" type="file" id="formFileMultiple" multiple onChange={(e) => setFile(e.target.files[0])} />
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary btn-lg w-100" onClick={handleSubmit}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>

        {/* Texto informativo (arriba en móviles, derecha en escritorio)*/}
        <div className="col-lg-3 col-md-10 rounded-lg d-flex align-items-center bg-white text-center p-4 mb-3 mb-lg-0"
             style={{ maxHeight: "50vh", maxWidth: "53vh" }}>
            <h2 className="fw-bold">Por favor, rellene el formulario de charlas para tenerlo en cuenta</h2>
        </div> 

    </div>
</div>
  
    );    
}

export default Datos;
