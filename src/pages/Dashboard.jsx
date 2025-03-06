import { useState } from "react";
import {Link} from "react-router-dom"
import Grafico from "../components/graficos";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import dayjs from "dayjs"; // Importa dayjs para manejar fechas
import "../css/dashboard.css";

export default function Dashboard() {
  const [isBarChart, setIsBarChart] = useState(false);
  const [date, setDate] = useState(dayjs()); // Inicializa con la fecha actual

  const toggleChart = () => {
    setIsBarChart(!isBarChart);
  };

  const handleDateFilterChange = (newDate) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const month = date.month() + 1; // `month()` devuelve valores de 0 a 11, por eso sumamos 1
  const year = date.year();

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <button className="btn btn-primary rounded-pill dashboard-button" onClick={toggleChart}>
          {isBarChart ? "Mostrar por Área" : "Mostrar por Tema"}
        </button>
        <Link to="/buscar-charlas">
          <button className="btn btn-primary rounded-pill dashboard-button-2">Ver charlas </button>
        </Link>

        <h1 className="mb-3">Gráficas</h1>
        <h2 className="mb-4">{isBarChart ? "Gráfico por Temas" : "Gráfico por Áreas"}</h2>

        <div className="mb-3">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="MES Y AÑO"
              views={["month", "year"]}
              value={date}
              onChange={handleDateFilterChange}
              disableFuture
            />
          </LocalizationProvider>
        </div>

        <Grafico isBarChart={isBarChart} month={month} year={year} />

        <Link to="/dashboard-maquinas">
          <button className="btn btn-primary rounded-pill gap-4">Ver datos Maquinas </button>
        </Link>
      </div>
    </div>
  );
}
