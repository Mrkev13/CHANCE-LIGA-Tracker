import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  text-decoration: none;
  
  span {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ theme, $active }) => $active ? theme.colors.secondary : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: ${({ $active }) => $active ? 'bold' : 'normal'};
  font-size: 1.1rem;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          CHANCE:<span>LIGA</span> Tracker
        </Logo>
        <NavLinks>
          <NavLink to="/" $active={path === '/'}>Zápasy</NavLink>
          <NavLink to="/table" $active={path === '/table'}>Tabulka</NavLink>
          <NavLink to="/stats" $active={path === '/stats'}>Statistiky</NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
