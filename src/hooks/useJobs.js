import { useState, useEffect } from 'react';

// Este hook se encarga de manejar la lógica de carga de datos relacionados a los empleos disponibles y el perfil del candidato,
// incluyendo validaciones, manejo de errores detallado y categorización de estados para una mejor experiencia de usuario.

export const useJobs = (email) => {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Validación inicial "sin email no hay nada que cargar", esto evita llamadas innecesarias al backend y mejora la experiencia de usuario al no mostrar estados de carga sin sentido
      if (!email) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        // 2. Petición del Candidato: Manejo de errores por código de estado
        const candidateRes = await fetch(`${baseUrl}/candidate/get-by-email?email=${encodeURIComponent(email)}`);
        
        if (!candidateRes.ok) {
          // Si es 404, es un error de negocio (email no existe), sino es un error de servidor
          throw new Error(candidateRes.status === 404 ? "Candidato no registrado" : "Error al obtener perfil");
        }
        const candidateData = await candidateRes.json();

        // 3. Petición de Empleos: Manejo de error de carga
        const jobsRes = await fetch(`${baseUrl}/jobs/get-list`);
        if (!jobsRes.ok) throw new Error("No se pudo cargar la lista de empleos");
        
        const jobsData = await jobsRes.json();

        // 4. Seteo de datos con validación de tipo
        setCandidate(candidateData);
        setJobs(Array.isArray(jobsData) ? jobsData : []);

      } catch (err) {
        // 5. Categorización del error para el usuario
        console.error("Detalle del error:", err.message);
        
        // 'Failed to fetch' si se cae el servidor o hay un problema de red, otros mensajes para errores específicos
        const message = err.message === 'Failed to fetch' ? "Error de conexión con el servidor" : err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  return { candidate, jobs, loading, error };
};