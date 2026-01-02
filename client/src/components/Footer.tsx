import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  text-align: center;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        &copy; {new Date().getFullYear()} CHANCE:LIGA Tracker | Všechna práva vyhrazena
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;