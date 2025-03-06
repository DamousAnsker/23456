import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../css/navbar.css";
import logo from "../img/foto ariaztia.png";
import imgPerfil from "../img/perfil.png";

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [settingsExpanded, setSettingsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No hay token, redirigiendo a Login");
            navigate("/");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3333/datos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                } else {
                    console.log("Usuario no autenticado, redirigiendo a Login");
                    navigate("/");
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                navigate("/");
            }
        };

        fetchUserData();
    }, [navigate]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSettingsMenu = () => {
        setSettingsExpanded(!settingsExpanded);
    };

    return (
    <div>
        <div>
            <div>
                    {/* Navbar */}
                    <nav className="navbar navbar-expand-md navbar-custom bg-custom p-2vh">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/">
                                <img src={logo} alt="Logo" height={50} />
                            </a>
                            {!isMobile && (
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav mx-auto">
                                        <li className="nav-item">
                                            <a className="nav-link" href="/datos">Formulario-Charlas</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/dashboard">Gráficos</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/inicio-maquinas">Formulario-Maquinas</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <button className="btn" onClick={toggleSidebar}>
                                <img src={imgPerfil} alt="Foto Perfil" height={50} />
                            </button>
                    </div>
                </nav>
            </div>

        </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                {user ? (
            <>
                <p className="sidebar-user">👤 {user.nombre} {user.apellido}</p>
                <p className="sidebar-user">{user.role}</p>
                <hr />
                {isMobile && (
                    <>
                        <a className="nav-link" href="/datos">Formulario-Charlas</a>
                        <a className="nav-link" href="/dashboard">Gráficos</a>
                        <a className="nav-link" href="/inicio-maquinas">Formulario-Maquinas</a>
                        <hr />
                    </>
                )}
                {user.role === 'Administrador' && (
                    <a className="conf-btn" onClick={toggleSettingsMenu}>
                        Configuración
                    </a>
                )}
                {settingsExpanded && (
                    <div className={`settings-options ${settingsExpanded ? "open" : ""}`}>
                        <a href="/register">Registrar usuario</a>
                        <a href="/update-user">Editar usuario</a>
                        <a href="/delete-user">Borrar usuario</a>
                    </div>
                )}
                <div className="logout-container">
                    <a onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>Cerrar Sesión</a>
                </div>
            </>
        ) : (
            <p>Cargando usuario...</p>
        )}
    </div>
</div>
);
}
