import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import TeamCard from '../components/TeamCard';
import NavigationButtons from '../components/NavigationButtons';
import { useTheme } from '../utils/ThemeContext';
import { Spin, Typography } from 'antd';

const BasketballTeams = () => {
  const { isDarkMode } = useTheme();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/equipos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const basketballTeams = data.filter(team => team.ID_Deporte === 2);
        setTeams(basketballTeams);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

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
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center', padding: '24px', color: tema.text }}>Basketball Teams</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', padding: '20px' }}>
          {teams.map(team => (
            <TeamCard key={team.ID} team={team} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BasketballTeams;