import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carrusel_Inicial from './components/Carrusel_Inicial';
import Top_Peliculas from './components/Top_Peliculas';
import Detalle_Pelicula from './components/Detalle_Pelicula'; // Componente de detalles de película
import Login from './components/login'; // Importar el componente de Login
import Busqueda from './components/Busqueda'; // Importar el componente de Busqueda
import { ToastContainer } from 'react-toastify';

function Home() {
  return (
    <>
      <Carrusel_Inicial />
      <Top_Peliculas />
    </>
  );
}

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Estado para controlar el modal
  const [loginType, setLoginType] = useState<'login' | 'register'>('login'); // Tipo de modal (login o registro)

  const handleLoginClick = (type: 'login' | 'register') => {
    setLoginType(type); // Establece el tipo de acción (login o registro)
    setIsLoginOpen(true); // Mostrar el modal
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false); // Cerrar el modal
  };

  return (
    <Router>
      <ToastContainer />
      <div>
        <Navbar onLoginClick={handleLoginClick} /> 
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detalles/:id" element={<Detalle_Pelicula />} />
            <Route path="/busqueda" element={<Busqueda />} /> {/* Ruta para el componente de búsqueda */}
          </Routes>
        </div>

        {/* Si `isLoginOpen` es true, mostrar el modal de Login con el tipo adecuado */}
        {isLoginOpen && <Login onClose={handleCloseLogin} type={loginType} />} 
      </div>
    </Router>
  );
}

export default App;
