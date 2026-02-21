import { useState } from 'react';

// Este hook se encarga exclusivamente de manejar la lógica de postulación a una oferta laboral,
// incluyendo la construcción del payload, la llamada a la API y el manejo detallado de errores.

export const useApply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const applyToJob = async (rawPayload) => {
    // 1. Limpieza de estados previa
    setIsSubmitting(true);
    setStatus(null);

    // 2. Validación defensiva (Fail-fast), basicamente asegurarnos de que tenemos los datos mínimos para intentar la postulación
    const { uuid, jobId, candidateId, applicationId, repoUrl } = rawPayload;
    if (!uuid || !jobId || !candidateId || !applicationId) {
      setIsSubmitting(false);
      const errorMsg = "Datos de identidad incompletos para procesar la postulación.";
      setStatus({ type: 'error', text: errorMsg });
      return null;
    }


    //creamos un nuevo objeto payload asegurándonos de convertir a string y limpiar espacios, 
    //esto ayuda a evitar errores comunes de formato que el backend podría rechazar
    const payload = {
      
      uuid: String(uuid).trim(),
      candidateId: String(candidateId).trim(),
      jobId: String(jobId).trim(),
      applicationId: String(applicationId).trim(),
      repoUrl: repoUrl?.trim() || ''
    };


    //Realizamos la postulación con un manejo robusto de errores y validaciones en cada paso
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/candidate/apply-to-job`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
          },
          body: JSON.stringify(payload),
        }
      );

      // 3. Manejo detallado de errores HTTP (4xx, 5xx)
      if (!response.ok) {
        let errorMessage = `Error del servidor (${response.status})`;
        
        try {
          // Intentamos extraer el mensaje de error específico del backend
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          
          // Caso especial: Errores de validación por campos
          if (errorData.details?.fieldErrors) {
            const fields = Object.keys(errorData.details.fieldErrors).join(', ');
            errorMessage = `Campos inválidos: ${fields}`;
          }
        } catch (parseError) {
          // Si el servidor no responde con JSON (ej: un error 500 crudo)
        }
        
        throw new Error(errorMessage);
      }

      // 4. Validación de la lógica de negocio (data.ok)
      const data = await response.json();

      if (data.ok || response.status === 200) {
        setStatus({ type: 'success', text: '¡Postulación enviada exitosamente!' });
        return data;
      } else {
        throw new Error(data.error || 'El servidor procesó la solicitud pero no confirmó el éxito.');
      }

    } catch (err) {
      // 5. Manejo de errores de Red (CORS, Sin internet, Timeout)
      let userFriendlyMessage = err.message;

      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        userFriendlyMessage = "No se pudo conectar con el servidor. Verifica tu conexión o CORS.";
      }

      console.error(" Fallo en useApply:", {
        error: err.message,
        payload
      });

      setStatus({ type: 'error', text: userFriendlyMessage });
      return null;

    } finally {
      // 6. Asegurar la liberación del estado de carga siempre
      setIsSubmitting(false);
    }
  };

  return { applyToJob, isSubmitting, status };
};