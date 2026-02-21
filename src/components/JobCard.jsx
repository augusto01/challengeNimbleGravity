import { useState } from 'react';
import { useApply } from '../hooks/useApply';
import '../styles/JobCard.css';

// Agregamos 'applicationId' a las props
const JobCard = ({ job, candidateId, uuid, applicationId, repoUrlBase }) => {
  const [repoUrl, setRepoUrl] = useState(repoUrlBase || '');
  const { applyToJob, isSubmitting, status } = useApply();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usamos las props directamente
    await applyToJob({
      uuid,
      candidateId,
      applicationId, 
      jobId: job.id,
      repoUrl
    });
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <span className="job-id">Posición ID: {job.id}</span>
        <h3>{job.title}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="job-card-form">
        <div className="input-group">
          <input 
            type="url" 
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="URL de tu repositorio GitHub"
            required
            className="minimal-input"
          />
        </div>
        <button 
          type="submit" 
          className="minimal-btn" 
          disabled={isSubmitting || !uuid}
        >
          {isSubmitting ? 'Procesando...' : 'SUBMIT'}
        </button>
      </form>

      {status && (
        <div className={`status-note ${status.type}`}>
          {status.text}
        </div>
      )}

      {!uuid && (
        <p className="status-note error">Cargando credenciales...</p>
      )}
    </div>
  );
};

export default JobCard;