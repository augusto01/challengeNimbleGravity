import { useJobs } from './hooks/useJobs';
import Header from './components/Header';
import JobCard from './components/JobCard';
import Footer from './components/Footer';
import './App.css';

// Configuración de variables de entorno
const MY_EMAIL = import.meta.env.VITE_CANDIDATE_EMAIL;
const DEFAULT_REPO = import.meta.env.VITE_GITHUB_REPO;
const API_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  /**
   * 1. Validación de Infraestructura
   * Verificamos que las variables de entorno necesarias estén presentes.
   */
  const missingVars = [
    !MY_EMAIL && "VITE_CANDIDATE_EMAIL",
    !DEFAULT_REPO && "VITE_GITHUB_REPO",
    !API_URL && "VITE_API_BASE_URL"
  ].filter(Boolean);

  if (missingVars.length > 0) {
    return (
      <div className="state-container">
        <div className="error-card">
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <h2>Configuración Requerida</h2>
          </div>
          <p className="error-desc">Faltan variables críticas en el archivo .env:</p>
          <div className="missing-vars-grid">
            {missingVars.map((v) => (
              <div key={v} className="var-item">
                <span className="var-name">{v}</span>
                <span className="var-status">MISSING</span>
              </div>
            ))}
          </div>
          <div className="error-footer">
            <p>Reinicia el servidor tras configurar el entorno.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Consumo de Datos (Custom Hook)
  const { candidate, jobs, loading, error } = useJobs(MY_EMAIL);

  // 3. Gestión de Estados Globales (Carga y Error de API)
  if (loading) {
    return (
      <div className="state-container">
        <div className="minimal-loader"></div>
        <p className="loading-text">Obteniendo trabajos disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <div className="error-card" style={{ borderColor: 'var(--error)' }}>
          <h2>Error de Conexión</h2>
          <p>{error}</p>
          <button className="minimal-btn" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 4. Renderizado Principal
  return (
    <div className="app-wrapper">
      <Header candidate={candidate} />

      <main className="main-content">
        <header className="hero-section">
          <h1>JOBS</h1>
        </header>

        <div className="job-grid">
          {jobs?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              // Pasamos todos los identificadores del candidato recuperados en el Step 2
              candidateId={candidate?.candidateId}
              uuid={candidate?.uuid}
              applicationId={candidate?.applicationId} // <--- CAMBIO CLAVE PARA EL STEP 5
              repoUrlBase={DEFAULT_REPO}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;