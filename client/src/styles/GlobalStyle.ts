import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: #1E1E1E;
    color: #FFFFFF;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  a {
    color: #4A90E2;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #FFFFFF;
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }
`;