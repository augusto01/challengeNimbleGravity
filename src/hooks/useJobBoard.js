// src/hooks/useJobs.js
import { useState, useEffect } from 'react';

// Accedemos a la variable del .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useJobs = (email) => {
  const [data, setData] = useState({ candidate: null, jobs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!email) return;
      
      try {
        setLoading(true);
        // Step 2: Candidato usando la URL del .env
        const candRes = await fetch(`${BASE_URL}/candidate/get-by-email?email=${email}`);
        if (!candRes.ok) throw new Error('Error al obtener candidato');
        const candidateData = await candRes.json();

        // Step 3: Posiciones
        const jobsRes = await fetch(`${BASE_URL}/jobs/get-list`);
        if (!jobsRes.ok) throw new Error('Error al obtener posiciones');
        const jobsData = await jobsRes.json();

        setData({ candidate: candidateData, jobs: jobsData });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [email]);

  return { ...data, loading, error };
};