import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  
  /* Show only on mobile devices (max-width 768px) */
  @media (min-width: 769px) {
    display: none;
  }
`;

const NavButton = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Touch friendly sizing (min 48px height) */
  padding: 1rem 1.5rem;
  min-width: 48px;
  min-height: 48px;
  
  /* Visual distinction */
  background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : theme.colors.lightGray};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  
  /* Shadows for depth */
  box-shadow: ${({ theme, $active }) => $active 
    ? '0 4px 8px rgba(200, 16, 46, 0.4)' 
    : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.secondary : 'rgba(255,255,255,0.1)'};

  /* Smooth animations */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: scale(1);

  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : '#495057'};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.96);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <NavContainer>
      <NavButton to="/" $active={path === '/'}>Zápasy</NavButton>
      <NavButton to="/table" $active={path === '/table'}>Tabulka</NavButton>
      <NavButton to="/stats" $active={path === '/stats'}>Statistiky</NavButton>
    </NavContainer>
  );
};

export default Navigation;
