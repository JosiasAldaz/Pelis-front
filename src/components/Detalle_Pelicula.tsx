import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../services/apiTMDB';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FirebaseError } from 'firebase/app';

interface MovieDetails {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface Comment {
  comentario: string;
  correo_usuario: string;
  fecha_comentario: Timestamp;
}

const Detalle_Pelicula: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]); // Estado para almacenar los comentarios

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetailsUrl = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES`;
        const movieDetailsResponse = await axios.get(movieDetailsUrl);
        setMovieDetails(movieDetailsResponse.data);

        const movieCastUrl = `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=es-ES`;
        const movieCastResponse = await axios.get(movieCastUrl);
        setCast(movieCastResponse.data.cast);
      } catch (error) {
        console.error('Error fetching movie details or cast:', error);
      }
    };

    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    // Consultar comentarios desde Firestore
    const fetchComments = async () => {
      const q = query(collection(db, 'Comentarios'), where('id_pelicula', '==', Number(id)));
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map((doc) => doc.data() as Comment);
      setComments(commentsData);
    };

    fetchMovieDetails();
    fetchComments();
  }, [id]);

  const handleCommentClick = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else if (comment.trim() === '') {
      toast.warning('El comentario no puede estar vacío', { position: 'top-center', autoClose: 2000 });
    } else {
      try {
        await addDoc(collection(db, 'Comentarios'), {
          id_pelicula: Number(id),
          comentario: comment,
          correo_usuario: JSON.parse(localStorage.getItem('user') || '{}').email,
          fecha_comentario: Timestamp.now(),
        });
        setComment('');
        toast.success('Comentario enviado correctamente', { position: 'top-center', autoClose: 2000 });
        setComments([...comments, { comentario: comment, correo_usuario: JSON.parse(localStorage.getItem('user') || '{}').email, fecha_comentario: Timestamp.now() }]); // Actualizar la lista de comentarios
      } catch (error: unknown) {
        const errorMessage = (error as FirebaseError).message;
        console.error('Error adding comment:', errorMessage);
        toast.error('Error al enviar el comentario', { position: 'top-center', autoClose: 2000 });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!movieDetails) return <div>Cargando...</div>;

  return (
    <div className="w-full h-auto bg-black text-white">
      {/* Sección de la película */}
      <div className="p-8 w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="w-1/2 h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>

          <div className="text-left space-y-4">
            <h1 className="text-4xl font-bold">{movieDetails.title}</h1>
            <p className="text-lg">{movieDetails.overview}</p>
            <p className="text-md">
              <strong>Fecha de lanzamiento: </strong>{movieDetails.release_date}
            </p>
          </div>
        </div>
      </div>

      {/* Sección del elenco */}
      <div className="p-8 w-full mt-12 mb-16">
        <h2 className="text-2xl font-semibold mb-4">Elenco Principal</h2>
        <div className="flex flex-wrap gap-4">
          {cast.slice(0, 6).map((member) => (
            <div key={member.id} className="w-32 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                alt={member.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-center">
                <h3 className="text-sm font-semibold">{member.name}</h3>
                <p className="text-xs text-gray-400">{member.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="p-8 w-full mt-16">
        <div className="p-4 bg-[#3e2660] rounded-lg w-full">
          <h2 className="text-2xl font-semibold mb-4">Comentarios</h2>

          {/* Input para nuevos comentarios */}
          <div className="mb-4">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full p-3 rounded-md bg-[#ffffff] text-black placeholder:text-black"
                rows={3}
            />
            </div>


          {/* Botón para enviar comentario */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleCommentClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Comentar
            </button>
          </div>

          {/* Listado de comentarios */}
          <div className="mt-8 space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="p-4 bg-[#ffffff] rounded-lg shadow-md">
                <p className="text-lg font-semibold text-black">{comment.correo_usuario}</p>
                <p className="text-black">{comment.comentario}</p>
                <p className="text-sm text-black">
                  {comment.fecha_comentario.toDate().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center relative z-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-yellow-500 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            <h2 className="text-xl font-semibold mb-4 text-black">Debe estar logueado para comentar</h2>
            <button
              onClick={closeModal}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detalle_Pelicula;
