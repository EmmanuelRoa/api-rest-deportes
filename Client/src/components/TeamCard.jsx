import React from 'react';
import { Card, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

const { Title } = Typography;

const TeamCard = ({ team }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const tema = {
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#333333',
    cardBackground: isDarkMode
      ? 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
      : 'linear-gradient(145deg, #f8f8f8 0%, #e6e6e6 100%)',
    buttonBackground: isDarkMode ? '#3a3a3a' : '#e0e0e0',
    buttonText: isDarkMode ? '#ffffff' : '#333333',
  };

  const handleButtonClick = () => {
    navigate(`/clubs/${team.ID}`);
  };

  return (
    <Card
      className="team-card"
      style={{ 
        background: tema.cardBackground, 
        width: '400px', 
        marginBottom: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        transition: 'transform 0.3s, box-shadow 0.3s',
        padding: '20px',
        cursor: 'pointer'
      }}
      hoverable
      onClick={handleButtonClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Title level={3} style={{ color: tema.text, marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>{team.Nombre}</Title>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <img
          src={team.Logo}
          alt={team.Nombre}
          style={{ width: '200px', height: '200px', borderRadius: '10px', objectFit: 'contain' }}
        />
      </div>
      <Typography.Paragraph style={{ color: tema.text, textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        {team.Pais}
      </Typography.Paragraph>
      <Button 
        type="primary" 
        className="button" 
        style={{ backgroundColor: tema.buttonBackground, borderColor: tema.buttonBackground, color: tema.buttonText, width: '100%' }}
      >
        Ver detalles del club
      </Button>
    </Card>
  );
};

export default TeamCard;