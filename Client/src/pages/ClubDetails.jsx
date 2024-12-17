import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Typography, Segmented, Table, Card } from 'antd'; // Asegúrate de importar Card
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import NavigationButtons from '../components/NavigationButtons';
import { useTheme } from '../utils/ThemeContext';

const ClubDetails = () => {
  const { clubID } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerType, setPlayerType] = useState('Actual');

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/equipos/${clubID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClub(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/jugadores');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlayers(data.filter(player => player.ID_Equipo === parseInt(clubID)));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClubDetails();
    fetchPlayers();
  }, [clubID]);

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

  const filteredPlayers = players.filter(player => player.TipoJugador === playerType);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
    },
    {
      title: 'Número de Camiseta',
      dataIndex: 'NumeroCamiseta',
      key: 'NumeroCamiseta',
    },
    {
      title: 'Posición',
      dataIndex: 'Posicion',
      key: 'Posicion',
    },
  ];

  return (
    <div style={{ background: tema.background, color: tema.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <NavigationButtons />
      <div style={{ flex: 1, padding: '20px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Typography.Title level={2} style={{ textAlign: 'center', color: tema.text }}>{club.Nombre}</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src={club.Logo} alt={club.Nombre} style={{ width: '400px', height: '400px', objectFit: 'contain', borderRadius: '10px' }} />
        </div>
        <Card style={{ marginBottom: '20px', backgroundColor: tema.background, color: tema.text, textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
          <Typography.Paragraph style={{ color: tema.text, fontSize: '1.2em' }}>
            <strong>País:</strong> {club.Pais}<br />
            <strong>Ciudad:</strong> {club.Ciudad}<br />
            <strong>Estadio/Arena:</strong> {club.EstadioArena}<br />
            <strong>Año de Fundación:</strong> {club.AnioFundacion}<br />
            <strong>Número de Campeonatos:</strong> {club.NumeroCampeonatos}<br />
            <strong>Deporte:</strong> {club.DeporteNombre}
          </Typography.Paragraph>
        </Card>
        <Segmented
          options={['Actual', 'Histórico']}
          value={playerType}
          onChange={setPlayerType}
          style={{ marginBottom: '20px' }}
        />
        <Table
          columns={columns}
          dataSource={filteredPlayers}
          rowKey="ID"
          onRow={(record) => ({
            onClick: () => navigate(`/players/${record.ID}`),
          })}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ClubDetails;