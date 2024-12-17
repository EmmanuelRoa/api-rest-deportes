import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Typography, Card, Row, Col } from 'antd'; // Asegúrate de importar Card
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationButtons from '../components/NavigationButtons';
import { useTheme } from '../utils/ThemeContext';

const PlayerDetails = () => {
  const { playerID } = useParams();
  const { isDarkMode } = useTheme();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/jugadores/${playerID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/estadisticas`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data.filter(stat => stat.ID_Jugador === parseInt(playerID)));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPlayerDetails();
    fetchPlayerStats();
  }, [playerID]);

  const tema = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#333333',
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: tema.text }} />;
  }

  if (error) {
    return <Typography.Text type="danger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: tema.text }}>Error: {error}</Typography.Text>;
  }

  return (
    <div style={{ background: tema.background, color: tema.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <NavigationButtons />
      <div style={{ flex: 1, padding: '20px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Typography.Title level={1} style={{ textAlign: 'center', color: tema.text, fontSize: '2.5em' }}>{player.Nombre}</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src={player.Imagen} alt={player.Nombre} style={{ width: '600px', height: '600px', objectFit: 'contain', borderRadius: '10px' }} />
        </div>
        <Card style={{ marginBottom: '5px', backgroundColor: tema.background, color: tema.text, textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
          <Typography.Paragraph style={{ color: tema.text, fontSize: '1.2em' }}>
            <strong>Posición:</strong> {player.Posicion}<br />
            <strong>Nacionalidad:</strong> {player.Nacionalidad}<br />
            {player.NumeroCamiseta && <><strong>Número de Camiseta:</strong> {player.NumeroCamiseta}<br /></>}
            {player.Edad && <><strong>Edad:</strong> {player.Edad}<br /></>}
            {player.Altura && <><strong>Altura:</strong> {player.Altura} m<br /></>}
            {player.Peso && <><strong>Peso:</strong> {player.Peso} kg<br /></>}
            {player.Universidad && <><strong>Universidad:</strong> {player.Universidad}<br /></>}
            {player.AniosActivos && <><strong>Años Activos:</strong> {player.AniosActivos}<br /></>}
            {player.LogroPrincipal && <><strong>Logro Principal:</strong> {player.LogroPrincipal}<br /></>}
          </Typography.Paragraph>
        </Card>
        <Typography.Title level={2} style={{ textAlign: 'center', color: tema.text, fontSize: '1.8em' }}>Estadísticas</Typography.Title>
        <Row gutter={[16, 16]} justify="center">
          {stats.map(stat => (
            <Col key={stat.ID} xs={24} sm={12} md={8} lg={6}>
              <Card style={{ backgroundColor: tema.background, color: tema.text, textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px', padding: '15px' }}>
                <Typography.Title level={4} style={{ color: tema.text, fontSize: '1.1em' }}>{stat.TipoEstadistica}</Typography.Title>
                <Typography.Paragraph style={{ color: tema.text, fontSize: '1.3em' }}>
                  {stat.Valor}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default PlayerDetails;