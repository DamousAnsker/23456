import { useState } from "react";

export default function InicioMaquinas() {
  const [maquinaEmpresa, setMaquinaEmpresa] = useState("");
  const [realizadoPor, setRealizadoPor] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [area, setArea] = useState("");
  const [respuestas, setRespuestas] = useState(new Map());
  const [sugerencias, setSugerencias] = useState(new Map());  
  const [file, setFile] = useState(null);
  const [seccionActual, setSeccionActual] = useState(0);
  const tokenUsuario = localStorage.getItem("token");

  const secciones = [
    {
      titulo: "Sistema de transmisión y partes móviles",
      preguntas: [
        "Los sistemas de transmisión y partes móviles se encuentran completamente protegidos.",
        "Las defensas fijas están sólidamente aseguradas.",
        "Están señalizados los puntos de peligro.",
      ],
    },
    {
      titulo: "Punto de operación",
      preguntas: [
        "Las partes móviles de la máquina son completamente inaccesibles.",
        "Existen los dispositivos de seguridad en los puntos de operación.",
        "Existen dispositivos de bloqueo.",
        "Están bien señalizados los puntos de peligro y partes en movimiento de la máquina.",
        "Se utilizan herramientas o dispositivos para alimentar la máquina.",
        "La operación de carga y descarga de materia prima y residuos no representa peligro para los operarios.",
        "El puesto de trabajo se encuentra libre de materiales o elementos que dificulten el desarrollo de la operación.",
      ],
    },
    {
      titulo: "Dispositivos de Control",
      preguntas: [
        "Los dispositivos de control son visibles, están claramente identificados, de fácil alcance y ubicados fuera de zonas peligrosas.",
        "Su accionamiento sólo es posible de manera intencionada.",
        "Las paradas de emergencia tienen enclavamiento.",
        "Desde el punto de mando el operador ve todas las zonas de peligro de la máquina, o existe una señal acústica o visible.",
        "Existen uno o más dispositivos de parada de emergencia cerca de los puntos de peligro.",
        "Los cables y conexiones eléctricas no tienen partes expuestas y están bien canalizados.",
        "Se tiene establecido el procedimiento para el bloqueo de energías peligrosas.",
      ],
    },
    {
      titulo: "Comportamiento seguro",
      preguntas: [
        "El operador está instruido en el Procedimiento de Trabajo seguro de la máquina.",
        "El operador usa los elementos de protección personal requeridos.",
        "El operador no porta cadenas, anillos, ropa suelta u otro tipo de accesorios que le signifiquen peligro.",
        "El operador usa en forma segura las herramientas manuales y de operación de la máquina.",
        "El operador no se distrae usando celular, no realizando juegos o bromas.",
      ],
    },
    {
      titulo: "Entorno",
      preguntas: [
        "El área de desplazamiento de los operarios está libre de obstáculos que impidan su caminar y operación.",
        "Las luminarias se encuentran en condiciones adecuadas para su funcionamiento.",
        "Los pisos se encuentran libres de grietas, desniveles, grasa, aceite o agua alrededor de la máquina.",
        "Las escaleras cuentan con pasamanos, peldaños con superficie antideslizante, libres de fisuras y grasas.",
        "No existen bordes cortantes, superficies salientes u otras condiciones irregulares.",
      ],
    },
  ];

  const handleEmpresaChange = (e) => {
    const empresaSeleccionada = e.target.value;
    setNombreEmpresa(empresaSeleccionada);
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

  const handleSugerenciasChange = (e) => {
    const { name, value } = e.target;
    setSugerencias((prevSugerencias) => {
      const updatedSugerencias = [...prevSugerencias];
      const index = updatedSugerencias.findIndex((res) => res.pregunta === name);
      if (index >= 0) {
        updatedSugerencias[index].sugerencia = value;
      } else {
        updatedSugerencias.push({ pregunta: name, sugerencia: value });
      }
      return updatedSugerencias;
    });
  };

  const handleSiguiente = () => {
    const preguntasActuales = secciones[seccionActual].preguntas;
    const todasRespondidas = preguntasActuales.every(pregunta =>
      respuestas.some(res => res.pregunta === pregunta && res.respuesta)
    );

    
    if (!todasRespondidas) {
      alert("Debe responder todas las preguntas antes de continuar.");
      return;
    }

    if (seccionActual < secciones.length - 1) setSeccionActual(seccionActual + 1);
  };

  const handleAnterior = () => {
    if (seccionActual > 0) setSeccionActual(seccionActual - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!realizadoPor || !nombreEmpresa || !area || !maquinaEmpresa || respuestas.length === 0 || !file) {
      alert("Por favor, complete todos los campos y seleccione un archivo.");
      return;
    }    

    const formData = { realizadoPor, area, maquinaEmpresa, rutEmpresa, empresa: nombreEmpresa, respuestas };

    try {
      const response = await fetch("http://localhost:3333/formulario-maquinas", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${tokenUsuario}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Datos enviados correctamente");
        setRealizadoPor("");
        setNombreEmpresa("");
        setRutEmpresa("");
        setArea("");
        setMaquinaEmpresa("");
        setRespuestas([]);
        setSugerencias([]); // Limpiar sugerencias
      } else {
        alert("Error al enviar los datos");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un problema al enviar el formulario");
    }
  };

  return (

    <div className="container col-11 rounded-lg align-items-start flex-column overflow-auto overflow-y ">
      <div className="row bg-white rounded-lg p-4 overflow-y overflow-scroll mh-40">
        <div className="col-md-6 ">
          <h1>Formulario máquinas</h1>
          <h4>Complete los datos para poder seguir</h4>

          <input value={realizadoPor} onChange={(e) => setRealizadoPor(e.target.value)} type="text" placeholder="Realizado por" required className="form-control mb-3" />
          <select value={area} onChange={(e) => setArea(e.target.value)} required className="form-control mb-3">
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
          <input type="text" value={maquinaEmpresa} onChange={(e) => setMaquinaEmpresa(e.target.value)} placeholder="Máquinas" required className="form-control mb-3" />
          <select value={nombreEmpresa} onChange={handleEmpresaChange} required className="form-control mb-3">
            <option value="" disabled>Seleccione la empresa</option>
            <option>Agroindustrial El Paico</option>
            <option>Industrial Ochagavia</option>
          </select>
          <input type="text" value={rutEmpresa} readOnly placeholder="RUT Empresa" required className="form-control mb-3" />
          <div className="mb-3">
              <input className="form-control" type="file" id="formFileMultiple" multiple onChange={(e) => setFile(e.target.files[0])} />
          </div>
        </div>
        

        <div className="col-md-6 m6-4 mt-md-0">
          <div className="bg-light p-4 rounded border overflow-hidden" required>
            <h4>{secciones[seccionActual].titulo}</h4>
            {secciones[seccionActual].preguntas.map((pregunta, index) => (
              <div key={index} className="mb-3">
                <p>{pregunta}</p>
                <div required>
                  <input type="radio" value="si" name={pregunta} checked={respuestas.find(res => res.pregunta === pregunta)?.respuesta === "si"} onChange={handleRespuestasChange} /> Sí
                  <input type="radio" value="no" name={pregunta} checked={respuestas.find(res => res.pregunta === pregunta)?.respuesta === "no"} onChange={handleRespuestasChange} /> No
                  <input type="radio" value="na" name={pregunta} checked={respuestas.find(res => res.pregunta === pregunta)?.respuesta === "na"} onChange={handleRespuestasChange} /> N/A
                </div>
                <input
                  type="text"
                  placeholder="Sugerencia"
                  value={sugerencias.find(res => res.pregunta === pregunta)?.sugerencia || ""}
                  onChange={handleSugerenciasChange}
                  name={pregunta}
                  className="form-control mt-2"
                />
              </div>
            ))}
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={handleAnterior} disabled={seccionActual === 0}>Anterior</button>
              <button className="btn btn-primary" onClick={handleSiguiente} disabled={seccionActual === secciones.length - 1}>Siguiente</button>
            </div>
          </div>
          <button className="btn w-100 btn-success mt-3" onClick={handleSubmit}>Enviar</button>
        </div>
      </div>
    </div>
  );
}