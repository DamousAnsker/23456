 {user ? (
        <>
            <h2>Nombre: {user.nombre}</h2>
            <h2>Email: {user.email}</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
    ) : (
        <p>Cargando datos...</p>
    )}