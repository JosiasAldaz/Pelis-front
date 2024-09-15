import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface NavbarProps {
  onLoginClick: (type: 'login' | 'register') => void; // Prop para manejar login o registro
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user); // Cambia el estado si el usuario está presente
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/busqueda?query=${searchTerm}`); // Navegar al componente de búsqueda con el término
    }
  };

  const handleLogout = () => {
    // Elimina al usuario del localStorage y actualiza el estado
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Sesión cerrada', {
      position: 'top-center',
      autoClose: 2000,
    });
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-[#090310] p-4 fixed w-full top-0 left-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-white text-xl font-bold">
            <h1>PelisPlus</h1>
          </Link>

          {/* Lista centrada */}
          <ul className="flex space-x-4 justify-center flex-grow">
            {/* <li className="text-white hover:bg-slate-400 rounded cursor-pointer p-2 transition-colors duration-300">
              Películas
            </li> */}
            <li className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-500 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer p-2 rounded-lg">
            Vive cada película con la mejor definición
            </li>

            {/* <li className="text-white hover:bg-slate-400 rounded cursor-pointer p-2 transition-colors duration-300">
              Géneros
            </li> */}
          </ul>

          {/* Buscador e icono de perfil */}
          <div className="flex items-center space-x-8 relative">
            {/* Input para manejar la búsqueda */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress} // Enviar al presionar Enter
              placeholder="Buscar"
              className="p-2 rounded bg-white text-black"
            />

            {/* Icono de perfil en SVG */}
            <div
              className="text-white cursor-pointer flex items-center justify-center"
              onClick={toggleModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 bg-black rounded-full p-1 hover:bg-gray-700 transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 19.879A3 3 0 018 18h8a3 3 0 012.879 1.879M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>

            {/* Modal justo debajo del ícono de perfil */}
            {isModalOpen && (
              <div
                ref={modalRef}
                className="absolute right-2 top-12 w-48 bg-[#b3ddff] rounded-lg shadow-lg py-2 z-30"
              >
                <ul className="text-gray-800">
                  {isLoggedIn ? (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={handleLogout} // Cerrar sesión
                    >
                      Cerrar sesión
                    </li>
                  ) : (
                    <>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 rounded-t-lg cursor-pointer"
                        onClick={() => onLoginClick('register')} // Abrir el modal para registro
                      >
                        Registrarse
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => onLoginClick('login')} // Abrir el modal para login
                      >
                        Iniciar Sesión
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
