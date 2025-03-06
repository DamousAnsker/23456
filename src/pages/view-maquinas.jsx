import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { utils, writeFile } from "xlsx";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import "../css/view-maquinas.css";

Modal.setAppElement("#root");

export default function ListaMaquinas() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [respuestasModal, setRespuestasModal] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('');
  const [MesAnnio, setMesAnnio] = useState(null); // Para el filtro de fecha (mes y año)
  const [currentPage, setCurrentPage] = useState(1);
  const [registrosPerPage] = useState(20);
  const tokenUsuario = localStorage.getItem("token");

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        const respuesta = await fetch("http://localhost:3333/formulario-maquinas", {
          headers: {
            Authorization: `Bearer ${tokenUsuario}`,
          },
        });
        const datos = await respuesta.json();
        if (datos.success) {
          setRegistros(datos.data);
        }
      } catch (error) {
        console.error("Error al obtener los registros:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerRegistros();
  }, [tokenUsuario]);

  const abrirModal = (respuestas) => {
    setRespuestasModal(respuestas);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(registros);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Inspección de Máquinas");
    writeFile(workbook, "inspeccion_maquinas.xlsx");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
  };

  const handleDateFilterChange = (newValue) => {
    if (newValue) {
      setMesAnnio(`${newValue.$y}-${(newValue.$M + 1).toString().padStart(2, '0')}`);
    } else {
      setMesAnnio(null);
    }
  };

  if (cargando) return <p className="text-center text-gray-500">Cargando...</p>;

  // Filtrar registros por búsqueda, campo de filtro y fecha
  const registrosFiltrados = registros.filter((registro) => {
    const matchesSearchTerm = !filterField || registro[filterField]?.toLowerCase().includes(searchTerm);
    const matchesDate = !MesAnnio || (new Date(registro.createdAt).toISOString().slice(0, 7) === MesAnnio);
    return matchesSearchTerm && matchesDate;
  });

  // Paginación
  const indexOfLastForm = currentPage * registrosPerPage;
  const indexOfFirstForm = indexOfLastForm - registrosPerPage;
  const currentRegistros = registrosFiltrados.slice(indexOfFirstForm, indexOfLastForm);
  const totalPages = Math.ceil(registrosFiltrados.length / registrosPerPage);

  const changePage = (newPage) => {
    if (newPage < 1) return;
    if (newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-4 bg-white rounded-lg">
        Lista de Inspección de Máquinas
      </h2>
      <div className="d-flex gap-3">
        <Link to="/datos">
          <button className="btn btn-primary">Volver al inicio</button>
        </Link>
        <Link to="/buscar-charlas">
          <button className="btn btn-primary">Ver SGI</button>
        </Link>
        <button className="btn btn-success" onClick={exportToExcel}>Exportar a Excel</button>
      </div>

      <div className="mb-4 flex gap-3 py-4">
      <div className="d-flex col-12">
          <select className="col-4 form-control me-2" value={filterField} onChange={handleFilterFieldChange}>
            <option value="">Seleccionar campo</option>
            <option value="realizadoPor">Realizado por</option>
            <option value="area">Área</option>
            <option value="maquinaEmpresa">Máquina</option>
            <option value="empresa">Empresa</option>
          </select>

          <input
            className="col-4 form-control me-2"
            type="search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <div className="col-4"> 
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es" localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="MES Y AÑO"
                views={['month', 'year']}
                onChange={handleDateFilterChange}
                />
            </DemoContainer>
          </LocalizationProvider>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-black text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black px-4 py-2">Realizado por</th>
              <th className="border border-black px-4 py-2">Área</th>
              <th className="border border-black px-4 py-2">Máquina</th>
              <th className="border border-black px-4 py-2">Empresa</th>
              <th className="border border-black px-4 py-2">Fecha</th>
              <th className="border border-black px-4 py-2">Imágenes</th>
              <th className="border border-black px-4 py-2">Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {currentRegistros.map((registro) => (
              <tr key={registro._id} className="hover:bg-gray-100">
                <td className="border border-black px-4 py-2">{registro.realizadoPor}</td>
                <td className="border border-black px-4 py-2">{registro.area}</td>
                <td className="border border-black px-4 py-2">{registro.maquinaEmpresa}</td>
                <td className="border border-black px-4 py-2">{registro.empresa}</td>
                <td className="border border-black px-4 py-2">
                  {new Date(registro.createdAt).toISOString().split("T")[0]}
                </td>
                <td className="border border-black px-4 py-2">
                  {registro.imageUrls?.length ? (
                    <div className="flex gap-2">
                      {registro.imageUrls.map((imgUrl, index) => (
                        <a key={index} href={`http://localhost:3333${imgUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                          Ver Imagen
                        </a>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Sin imágenes</span>
                  )}
                </td>
                <td className="border border-black px-4 py-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => abrirModal(registro.respuestas)}
                  >
                    Ver respuestas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-4 text-light">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-secondary">Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-secondary">Siguiente</button>
      </div>

      {/* Modal para mostrar respuestas */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        contentLabel="Respuestas del Formulario"
        className="modal-popup"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Respuestas del Formulario</h2>
        <div className="overflow-y-auto max-h-60">
          <ul className="list-disc pl-4">
            {respuestasModal.length > 0 ? (
              respuestasModal.map((respuesta, index) => (
                <li key={index}>
                  <strong>{respuesta.pregunta}:</strong> {respuesta.respuesta}
                </li>
              ))
            ) : (
              <p>No hay respuestas disponibles</p>
            )}
          </ul>
        </div>
        <button className="btn btn-primary mt-4" onClick={cerrarModal}>
          Cerrar
        </button>
      </Modal>
    </div>
  );
}
