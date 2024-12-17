import React, { useEffect, useState } from 'react';
import { Card, List, Button, Typography, Spin } from 'antd';
import { TrophyOutlined, TeamOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTheme } from '../utils/ThemeContext';
import { useNavigate } from 'react-router-dom';
import '../styles/cardsSport.css';

const { Title } = Typography;

const TarjetaDeporte = () => {
  const themeContext = useTheme();
  if (!themeContext) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  const { isDarkMode } = themeContext;
  const navigate = useNavigate();

  const [deportes, setDeportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/deportes`);
        if (!response.ok) {
          throw new Error(`¡Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        setDeportes(data);
      } catch (error) {
        console.error('Error al obtener los deportes:', error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };
    fetchDeportes();
  }, []);

  const caracteristicas = [
    { icon: <TrophyOutlined />, text: 'Principales ligas y competiciones' },
    { icon: <TeamOutlined />, text: 'Alineaciones actuales de los equipos' },
    { icon: <HistoryOutlined />, text: 'Top 5 jugadores históricos por equipo' },
  ];

  const tema = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#333333',
    cardBackground: isDarkMode
      ? 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
      : 'linear-gradient(145deg, #f8f8f8 0%, #e6e6e6 100%)',
    buttonBackground: isDarkMode ? '#3a3a3a' : '#e0e0e0',
    buttonText: isDarkMode ? '#ffffff' : '#333333',
  };

  if (cargando) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: tema.text }} />;
  }

  if (error) {
    return <Typography.Text type="danger" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: tema.text }}>Error: {error}</Typography.Text>;
  }

  const handleButtonClick = (deporteID) => {
    navigate(`/teams/${deporteID}`);
  };

  return (
    <div style={{ backgroundColor: tema.background, minHeight: '80vh', padding: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
        {deportes.map((deporte) => (
          <Card
            key={deporte.ID}
            className="sport-card"
            style={{ 
              background: tema.cardBackground, 
              width: '45%', 
              marginBottom: '20px', 
              borderRadius: '10px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            hoverable
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <Title level={2} style={{ color: tema.text, margin: 0, fontWeight: 'bold' }}>{deporte.Nombre}</Title>
                <Typography.Paragraph style={{ color: tema.text }}>
                  Explora ligas, equipos y jugadores destacados de {deporte.Nombre.toLowerCase()}. Descubre las estadísticas más recientes, las alineaciones actuales y los jugadores más destacados. Mantente al día con las últimas noticias y eventos de {deporte.Nombre.toLowerCase()}.
                </Typography.Paragraph>
              </div>
              <img
                src={
                  deporte.Nombre === 'Fútbol'
                    ? 'https://www.hindustantimes.com/ht-img/img/2024/06/18/550x309/SOCCER-EURO-POR-CZE-REPORT-96_1718742075000_1718742088519.JPG'
                    : deporte.Nombre === 'Baloncesto'
                    ? 'https://cdn.britannica.com/21/233921-050-69BE4DB8/Stephen-Curry-Golden-State-Warriors-Dillon-Brooks-Memphis-Grizzlies-NBA-action-2022.jpg'
                    : `/placeholder.svg?height=128&width=128&text=${deporte.Nombre}`
                }
                alt={deporte.Nombre}
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginLeft: '20px' }}
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?height=128&width=128&text=${deporte.Nombre}`;
                }}
              />
            </div>
            <List
              dataSource={caracteristicas}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text style={{ color: tema.text }}>
                    {item.icon} {item.text}
                  </Typography.Text>
                </List.Item>
              )}
            />
            <Button 
              type="primary" 
              className="button" 
              style={{ backgroundColor: tema.buttonBackground, borderColor: tema.buttonBackground, color: tema.buttonText }}
              onClick={() => handleButtonClick(deporte.ID)}
            >
              Explorar equipos de {deporte.Nombre}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TarjetaDeporte;