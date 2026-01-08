import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle.ts';
import { theme } from './styles/theme.ts';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import HomePage from './pages/HomePage.tsx';
import MatchDetailPage from './pages/MatchDetailPage.tsx';
import TeamPage from './pages/TeamPage.tsx';
import TablePage from './pages/TablePage.tsx';
import StatsPage from './pages/StatsPage.tsx';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ScrollToTop />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/match/:id" element={<MatchDetailPage />} />
            <Route path="/team/:id" element={<TeamPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
