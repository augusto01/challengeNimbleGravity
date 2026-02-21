import { useState } from 'react';

export const useApply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const applyToJob = async ({ uuid, jobId, candidateId, applicationId, repoUrl }) => {
    setIsSubmitting(true);
    setStatus(null);


    //parametros que se envían a la API para aplicar a una posición
    const payload = {
      uuid: String(uuid).trim(),
      candidateId: String(candidateId).trim(),
      jobId: String(jobId).trim(),
      applicationId: String(applicationId).trim(),
      repoUrl: repoUrl.trim()
    };

    console.log(" Enviando payload al servidor...", payload);

    try {
      const response = await fetch(
        //solicitamos a la API que procese la aplicación a la posición con los datos del candidato y el repositorio
        `${import.meta.env.VITE_API_BASE_URL}/candidate/apply-to-job`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(payload),
        }
      );

      // Verificamos si la respuesta es exitosa (200-299)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log(" Respuesta exitosa de la API:", data);

      // Si la API devuelve { ok: true } o simplemente un 200 OK
      if (data.ok || response.status === 200) {
        setStatus({ type: 'success', text: '¡Postulación exitosa!' });
        return data; 
        
        // Devolvemos la respuesta completa
      } else {
        throw new Error('La API no confirmó la recepción (ok: false)');
      }

    } catch (err) {
      console.error(" Error en la petición:", err.message);
      setStatus({ type: 'error', text: err.message });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyToJob, isSubmitting, status };
};