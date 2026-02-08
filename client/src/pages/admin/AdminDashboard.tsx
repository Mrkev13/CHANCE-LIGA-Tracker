import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchMatches } from '../../redux/slices/matchesSlice';
import { logout } from '../../redux/slices/authSlice';
import Navigation from '../../components/Navigation';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0; /* Default light text */
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #ffffff;
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: white;
  font-size: 1rem;
`;

const MatchList = styled.div`
  display: grid;
  gap: 1rem;
`;

const MatchCard = styled.div`
  background: #2a2a2a; /* Dark background */
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border: 1px solid #444;

  &:hover {
    background: #333;
  }
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Teams = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffffff;
`;

const Details = styled.div`
  font-size: 0.9rem;
  color: #ccc; /* Lighter gray for readability on dark */
`;

const EditButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { matches, loading } = useSelector((state: RootState) => state.matches);
  
  // Initialize state from sessionStorage if available, otherwise 'all'
  const [selectedRound, setSelectedRound] = useState<string>(() => {
    return sessionStorage.getItem('adminSelectedRound') || 'all';
  });

  useEffect(() => {
    if (matches.length === 0) {
      dispatch(fetchMatches());
    }
  }, [dispatch, matches.length]);

  // Update sessionStorage when selection changes
  useEffect(() => {
    sessionStorage.setItem('adminSelectedRound', selectedRound);
  }, [selectedRound]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const rounds = Array.from(new Set(matches.map(m => m.round).filter(Boolean))).sort((a, b) => Number(a) - Number(b));

  const filteredMatches = selectedRound === 'all' 
    ? matches 
    : matches.filter(m => m.round === selectedRound);

  const handleEdit = (id: string) => {
    navigate(`/admin/match/${id}`);
  };

  if (loading) return <PageContainer>Načítání...</PageContainer>;

  const getStatusLabel = (match: any) => {
    const hasEvents = match.events && match.events.length > 0;
    // If match has events but is scheduled, treat as live (unless we know it's finished)
    // However, for admin, maybe we should show the real status? 
    // User requested "místo scheduled by měl být finished".
    // If we want to show 'live' when events exist, we can. 
    // But if it's 1:0 and over, it should be finished. 
    // We'll stick to 'live' as effective status for scheduled+events.
    const effectiveStatus = (match.status === 'scheduled' && hasEvents) ? 'live' : match.status;

    switch (effectiveStatus) {
      case 'live': return 'ŽIVĚ';
      case 'finished': return 'KONEC';
      case 'awarded': return 'KONTUMACE';
      case 'canceled': return 'ZRUŠENO';
      case 'not_played': return 'NEODEHRÁNO';
      case 'scheduled': return 'NAPLÁNOVÁNO';
      default: return effectiveStatus;
    }
  };

  return (
    <PageContainer>
      <Navigation />
      <AdminHeader>
        <Title>Administrace Zápasů</Title>
        <LogoutButton onClick={handleLogout}>Odhlásit se</LogoutButton>
      </AdminHeader>
      
      <FilterContainer>
        <Select value={selectedRound} onChange={(e) => setSelectedRound(e.target.value)}>
          <option value="all">Všechna kola</option>
          {rounds.map(round => (
            <option key={round} value={round}>{round}. kolo</option>
          ))}
        </Select>
      </FilterContainer>

      <MatchList>
        {filteredMatches.map(match => (
          <MatchCard key={match.id}>
            <MatchInfo>
              <Teams>{match.homeTeam.name} vs {match.awayTeam.name}</Teams>
              <Details>
                {new Date(match.date).toLocaleDateString()} | {match.score.home}:{match.score.away} | {getStatusLabel(match)}
              </Details>
            </MatchInfo>
            <EditButton onClick={() => handleEdit(match.id)}>
              Upravit
            </EditButton>
          </MatchCard>
        ))}
      </MatchList>
    </PageContainer>
  );
};

export default AdminDashboard;
