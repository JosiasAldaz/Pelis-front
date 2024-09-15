import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase'; // Importa el objeto `auth` de firebase
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-toastify'; // Importa react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify

interface LoginProps {
  onClose: () => void;
  type: 'login' | 'register'; // Añadimos la prop type para saber si es login o registro
}

const Login: React.FC<LoginProps> = ({ onClose, type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(type === 'login'); // Estado inicial según la prop

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin); // Alterna entre login y register
    setError(null); // Limpia cualquier error al cambiar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      if (isLogin) {
        // Iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Guardar la información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
        }));

        toast.success('Login correcto', {
          position: 'top-center',
          autoClose: 2000,
        });

        onClose();

        // Retrasar la recarga de la página para que el mensaje de confirmación se vea
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Espera 3 segundos antes de recargar la página
      } else {
        // Registrar usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Guardar la información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
        }));

        toast.success('Usuario Registrado correctamente', {
          position: 'top-center',
          autoClose: 2000,
        });

        onClose();

        // Retrasar la recarga de la página para que el mensaje de confirmación se vea
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Espera 3 segundos antes de recargar la página
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
        toast.error(`Error: ${err.message}`, {
          position: 'top-center',
          autoClose: 2000,
        });
      } else {
        setError('Unexpected error occurred');
        toast.error('Error al registrar al usuario', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              {isLogin ? 'Username' : 'Email'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isLogin ? 'Username' : 'Email'}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mb-4">
              {error}
            </p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <div className="text-center">
          <button
            className="text-blue-500 hover:text-blue-800 text-xs"
            onClick={toggleFormType}
          >
            {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Sign In'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
