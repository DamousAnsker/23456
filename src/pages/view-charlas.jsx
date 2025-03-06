import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/es';

export default function FormulariosList() {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formulariosPerPage] = useState(10);
  const [MesAnnio, setMesAnnio] = useState(null);  // Cambiar a null para que se pueda comparar
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFormularios = async () => {
      try {
        const response = await fetch("http://localhost:3333/formularios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setFormularios(data.data);
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormularios();
  }, [token]);

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(formularios);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Formularios");
    writeFile(workbook, "formularios.xlsx");
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleFilterFieldChange = (e) => setFilterField(e.target.value);

  const handleDateFilterChange = (newValue) => {
    if (newValue) {
      setMesAnnio(`${newValue.$y}-${(newValue.$M + 1).toString().padStart(2, '0')}`);
    } else {
      setMesAnnio(null);
    }
  };


  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;

  // Filtrar los formularios por búsqueda y por fecha (solo mes y año)
  const formulariosFiltrados = formularios.filter((form) => {
    const matchesSearchTerm = !filterField || form[filterField]?.toLowerCase().includes(searchTerm);
    
    // Filtrar por mes y año (sin considerar el día)
    const matchesDate = !MesAnnio || (new Date(form.createdAt).toISOString().slice(0, 7) === MesAnnio);  // Comparar solo año y mes
    
    return matchesSearchTerm && matchesDate;
  });

  const indexOfLastForm = currentPage * formulariosPerPage;
  const indexOfFirstForm = indexOfLastForm - formulariosPerPage;
  const currentFormularios = formulariosFiltrados.slice(indexOfFirstForm, indexOfLastForm);
  const totalPages = Math.ceil(formulariosFiltrados.length / formulariosPerPage);

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
        <Link to="/buscar-maquinas">
          <button className="btn btn-primary">Ver Maquinas</button>
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
      
      <br />
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-2 border-gray-800 text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="border-b-2 border-gray-800 p-2">Nombre</th>
              <th className="border-b-2 border-gray-800 p-2">Descripción</th>
              <th className="border-b-2 border-gray-800 p-2">Email</th>
              <th className="border-b-2 border-gray-800 p-2">Área</th>
              <th className="border-b-2 border-gray-800 p-2">Tema</th>
              <th className="border-b-2 border-gray-800 p-2">Fecha</th>
              <th className="border-b-2 border-gray-800 p-2">Imágenes</th>
            </tr>
          </thead>
          <tbody>
            {currentFormularios.map((form) => (
              <tr key={form._id} className="hover:bg-gray-100">
                <td className="border-b border-gray-800 p-2">{form.nombre}</td>
                <td className="border-b border-gray-800 p-2">{form.descripcion}</td>
                <td className="border-b border-gray-800 p-2">{form.email || "No especificado"}</td>
                <td className="border-b border-gray-800 p-2">{form.area}</td>
                <td className="border-b border-gray-800 p-2">{form.tema}</td>
                <td className="border-b border-gray-800 p-2">{new Date(form.createdAt).toISOString().split("T")[0]}</td>
                <td className="border-b border-gray-800 p-2">
                  {form.imageUrls?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {form.imageUrls.map((imgUrl, index) => (
                        <a key={index} href={`http://localhost:3333${imgUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Ver Imagen</a>
                      ))}
                    </div>
                  ) : (<span className="text-gray-500">Sin imágenes</span>)}
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
    </div>
  );
}
