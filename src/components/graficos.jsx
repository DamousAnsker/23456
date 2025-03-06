import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axios from "axios";
import "../css/graficos.css";

// Registrar los componentes de Chart.js que usaremos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Grafico({ isBarChart, month, year }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem("token");
        
        // Verificar si el token está presente
        if (!token) {
          console.error("Token no encontrado, el usuario no está autenticado");
          return;
        }

        // Hacer la petición a la API para obtener los datos del gráfico
        const response = await axios.get("http://localhost:3333/grafico-datos", {
          headers: {
            Authorization: `Bearer ${token}`,  // Incluir el token en la cabecera
          },
          params: {
            month,
            year,
          },
        });

        // Verificar la respuesta
        if (response.data && response.data.length > 0) {
          const formattedData = response.data.reduce((acc, item) => {
            const key = isBarChart ? item.name.split(" - ")[1] : item.name.split(" - ")[0];
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += item.count;
            return acc;
          }, {});

          // Formatear los datos para el gráfico
          const chartData = Object.keys(formattedData).map((key) => ({
            name: key,
            y: formattedData[key],
          }));

          // Actualizar el estado con los datos del gráfico
          setData(chartData);
        } else {
          console.error("No se recibieron datos del servidor");
        }
      } catch (error) {
        console.error("Error al obtener los datos del gráfico:", error);
      }
    };

    fetchData();
  }, [isBarChart, month, year]); // Dependemos de 'month' y 'year' para volver a cargar los datos

  // Datos del gráfico para Chart.js
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: isBarChart ? "Cantidad por Tema" : "Cantidad por Área",
        data: data.map((item) => item.y),
        backgroundColor: isBarChart
          ? "rgba(75, 192, 192, 0.2)"
          : data.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.5)`),
        borderColor: isBarChart
          ? "rgba(75, 192, 192, 1)"
          : data.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`),
        borderWidth: 1,
      },
    ],
  };

  return (
    <figure className="highcharts-figure d-flex align-items-center justify-content-center">
      {isBarChart ? (
        <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: "Distribución por Tema" } } }} />
      ) : (
        <Pie data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: "Distribución por Área" } } }} />
      )}
    </figure>
  );
}
