import React, { useState, useEffect, useRef } from "react";
import "../css/maquinas.css";

const steps = [
 
  {
    title: "Sistema de transmisión y partes móviles",
    fields: [
      "Los sistemas de transmisión y partes móviles se encuentran completamente protegidos.",
      "Las defensas fijas están sólidamente aseguradas.",
      "Están señalizados los puntos de peligro.",
    ],
  },
  {
    title: "Punto de operación",
    fields: [
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
    title: "Dispositivos de Control",
    fields: [
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
    title: "Comportamiento seguro",
    fields: [
      "El operador está instruido en el Procedimiento de Trabajo seguro de la máquina.",
      "El operador usa los elementos de protección personal requeridos.",
      "El operador no porta cadenas, anillos, ropa suelta u otro tipo de accesorios que le signifiquen peligro.",
      "El operador usa en forma segura las herramientas manuales y de operación de la máquina.",
      "El operador no se distrae usando celular, no realizando juegos o bromas.",
    ],
  },
  {
    title: "Entorno",
    fields: [
      "El área de desplazamiento de los operarios está libre de obstáculos que impidan su caminar y operación.",
      "Las luminarias se encuentran en condiciones adecuadas para su funcionamiento.",
      "Los pisos se encuentran libres de grietas, desniveles, grasa, aceite o agua alrededor de la máquina.",
      "Las escaleras cuentan con pasamanos, peldaños con superficie antideslizante, libres de fisuras y grasas.",
      "No existen bordes cortantes, superficies salientes u otras condiciones irregulares.",
    ],
  },
];

export default function InspectionStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(steps.map((step) => step.fields.map(() => "")));
  const [selectedArea, setSelectedArea] = useState(""); // Nuevo estado para el área seleccionada
  const stepRef = useRef(null);

  useEffect(() => {
    if (stepRef.current) {
      stepRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const handleOptionChange = (stepIndex, fieldIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[stepIndex][fieldIndex] = value;

    if (stepIndex === 0 && fieldIndex === 3) {
      newAnswers[0][4] =
        value === "Agroindustrial El Paico"
          ? "95.590.000-4"
          : value === "Industrial Ochagavia"
          ? "77.135.800-k"
          : "";
    }
    setAnswers(newAnswers);
  };

  // Función para manejar el cambio de selección del área
  const handleAreaChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedArea(selectedValue); // Actualiza el área seleccionada
    handleOptionChange(0, 1, selectedValue); // Guarda el área seleccionada en answers
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('realizadoPor', realizadoPor);
    formData.append('area', selectedArea);  // Usar selectedArea aquí
    formData.append('maquinaEmpresa', maquinaEmpresa);
    formData.append('rutEmpresa', rutEmpresa);
    formData.append('observaciones', observaciones);
    respuestas.forEach((respuesta, index) => {
        formData.append(`respuestas[${index}]`, respuesta);
    });

    if (images.length > 0) {
        images.forEach(image => {
            formData.append('image', image); // Añadir imágenes
        });
    }

    try {
        const response = await fetch('http://localhost:3333/formulario-maquinas', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Asegúrate de incluir el token en los encabezados
            },
            body: formData,  // Usar FormData para incluir archivos y datos
        });

        const result = await response.json();
        if (response.ok) {
            alert('Formulario enviado con éxito');
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
};

  const canProceed = answers[currentStep].every((answer) => answer !== "");

  return (
    <div className="container mt-5 p-4 border rounded bg-white w-100 d-flex flex-column align-items-center overflow-auto" style={{ maxWidth: "85%", minHeight: "100vh" }}>
      <h2 className="text-center mb-4 text-wrap" ref={stepRef}>
        {steps[currentStep].title}
      </h2>
      <ul className="list-group w-85 minHeight: '170vh overflow-scroll">
        {steps[currentStep].fields.map((field, index) => (
          <li key={index} className="list-group-item d-flex flex-column text-wrap">
            <span className="mb-2">{field}</span>
            {currentStep === 0 ? (
              index === 1 ? (
                <select
                  className="form-control"
                  value={selectedArea} // Usar selectedArea para el valor
                  onChange={handleAreaChange} // Función para manejar el cambio
                >
                  <option value="">Seleccione un área</option>
                  {area.map((areaOption) => (
                    <option key={areaOption} value={areaOption}>
                      {areaOption}
                    </option>
                  ))}
                </select>
              ) : index === 3 ? (
                <select
                  className="form-control"
                  value={answers[currentStep][index]}
                  onChange={(e) => handleOptionChange(currentStep, index, e.target.value)}
                >
                  <option value="">Seleccione una empresa</option>
                  <option value="Agroindustrial El Paico">Agroindustrial El Paico</option>
                  <option value="Industrial Ochagavia">Industrial Ochagavia</option>
                </select>
              ) : index === 4 ? (
                <input
                  type="text"
                  className="form-control"
                  value={answers[currentStep][index]}
                  readOnly
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value={answers[currentStep][index]}
                  onChange={(e) => handleOptionChange(currentStep, index, e.target.value)}
                />
              )
            ) : (
              <div className="d-flex gap-2">
                {["Sí", "No", "N/A"].map((option) => (
                  <label key={option} className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={answers[currentStep][index] === option}
                      onChange={() => handleOptionChange(currentStep, index, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="d-flex justify-content-between w-100 mt-4 flex-wrap">
        <button className="btn btn-secondary" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
          Anterior
        </button>
        {currentStep === steps.length - 1 ? (
          <button className="btn btn-success" onClick={handleSubmit}>
            Enviar
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed || currentStep === steps.length - 1}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}