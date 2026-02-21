import { useState, useEffect } from 'react';

export const useJobs = (email) => {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Evitamos disparar la petición si no hay email
      if (!email) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        // 1. Obtener Datos del Candidato (Step 2)
        const candidateRes = await fetch(`${baseUrl}/candidate/get-by-email?email=${encodeURIComponent(email)}`);
        
        if (!candidateRes.ok) {
          throw new Error(`Error ${candidateRes.status}: No se pudo recuperar el perfil.`);
        }
        
        const candidateData = await candidateRes.json();
        
        // Log de seguridad para verificar qué nos devuelve exactamente el Step 2
        console.log(" Candidato recuperado:", candidateData);
        setCandidate(candidateData);

        // 2. Obtener Lista de Posiciones (Step 3)
        const jobsRes = await fetch(`${baseUrl}/jobs/get-list`);
        
        if (!jobsRes.ok) {
          throw new Error('Error al obtener el catálogo de posiciones.');
        }
        
        const jobsData = await jobsRes.json();
        setJobs(jobsData);

      } catch (err) {
        console.error("❌ Error en useJobs:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  return { candidate, jobs, loading, error };
};