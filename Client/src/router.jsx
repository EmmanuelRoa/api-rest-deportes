import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import BasketballTeams from './pages/BasketballTeams';
import SoccerTeams from './pages/SoccerTeams';
import Teams from './pages/Teams';
import ClubDetails from './pages/ClubDetails';
import PlayerDetails from './pages/PlayerDetails'; // Importa el componente PlayerDetails
import { ThemeProvider } from './utils/ThemeContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/basketballteams',
    element: <BasketballTeams />,
  },
  {
    path: '/soccerteams',
    element: <SoccerTeams />,
  },
  {
    path: '/teams/:deporteID',
    element: <Teams />,
  },
  {
    path: '/clubs/:clubID',
    element: <ClubDetails />,
  },
  {
    path: '/players/:playerID', // Nueva ruta dinámica para detalles del jugador
    element: <PlayerDetails />, // Componente que mostrará los detalles del jugador
  },
]);

const AppRouter = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default AppRouter;