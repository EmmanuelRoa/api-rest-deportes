import React from 'react';
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import '../styles/global.css';
import { useTheme } from '../utils/ThemeContext';

export default function Nav() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const navStyle = {
    backgroundColor: isDarkMode ? '#141414' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  return (
    <div className='nav' style={navStyle}>
      <div><h1 className='tittle'>SportNews</h1></div>
      <div className='container-profile'>
        <div className='icon' onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? (
            <SunOutlined className='icon-on' />
          ) : (
            <MoonOutlined className='icon-on' />
          )}
        </div>
        <div className='img-profile'></div>
      </div>
    </div>
  );
}