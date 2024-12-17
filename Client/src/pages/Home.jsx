import React from 'react';
import Nav from '../components/Nav';
import TarjetaDeporte from '../components/sportcard';
import NavigationButtons from '../components/NavigationButtons';
import { useTheme } from '../utils/ThemeContext';
import '../styles/global.css';
import Footer from '../components/Footer';

const Home = () => {
  const { isDarkMode } = useTheme();

  const homeStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    color: isDarkMode ? '#e0e0e0' : '#333333',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const contentStyle = {
    flex: 1, // Permite que el contenido crezca y empuje el footer hacia abajo
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  return (
    <>
      <Nav />
      <NavigationButtons />
      <div style={homeStyle}>
        <div style={contentStyle}>
          <h1 className="mainh1">Bienvenido a Sport News</h1>
          <p className="text-home">
            Sumérgete en el mundo de los deportes profesionales. Explora equipos, jugadores y estadísticas de las ligas más populares del mundo.
          </p>
          <TarjetaDeporte />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;