import '../styles/Footer.css';

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-container">
      {/* Sección de Identidad */}
      <div className="footer-section">
        <span className="footer-label">DEVELOPER:</span>
        <span className="footer-value">AUGUSTO ALMIRON</span>
      </div>
      
      

      {/* SECCION DE CONTACTO DIRECTO */}
      <div className="footer-section tech-stack">
        <a href="https://github.com/augusto01" target="_blank" rel="noopener noreferrer" className="contact-item">
          GITHUB
        </a>
        <a href="https://linkedin.com/in/augustoalmiron1" target="_blank" rel="noopener noreferrer" className="contact-item">
          LINKEDIN
        </a>
        <a href="mailto:almironaugusto404@gmail.com" className="contact-item">
          EMAIL
        </a>
      </div>

      <div className="footer-section">
        <span className="footer-label">VERSION:</span>
        <span className="footer-value">2026.1.0</span>
      </div>
    </div>
  </footer>
);

export default Footer;