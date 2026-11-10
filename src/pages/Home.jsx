import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1>Home</h1>
      <p style={{ margin: '15px 0' }}>Bienvenido al sistema MediMascotas.</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link to="/login" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
           Iniciar Sesión / Registrarse
        </Link>
      </div>
    </div>
  );
}
