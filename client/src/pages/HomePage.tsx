import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMatches, fetchLiveMatches } from '../redux/slices/matchesSlice.ts';
import { RootState, AppDispatch } from '../redux/store.ts';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { theme } from '../styles/theme.ts';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }: { theme: any }) => theme.fonts.heading};
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }: { theme: any }) => theme.colors.secondary};
  padding-bottom: 0.5rem;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const MatchCard = styled(Link)`
  background-color: ${({ theme }: { theme: any }) => theme.colors.lightGray};
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.medium};     
  padding: 1rem;
  display: flex;
  flex-direction: column;
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }: { theme: any }) => theme.shadows.medium};
  }
  
  &.live {
    border-left: 4px solid ${({ theme }: { theme: any }) => theme.colors.secondary};
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MatchDate = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }: { theme: any }) => theme.colors.gray};
`;

const MatchStatus = styled.span<{ status: string }>`
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.small};
  background-color: ${({ status, theme }: { status: string, theme: any }) =>  
    status === 'live' 
      ? theme.colors.secondary 
      : status === 'finished' 
        ? theme.colors.success 
        : theme.colors.gray};
  color: white;
`;

const Teams = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Team = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TeamLogo = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const TeamName = styled.span`
  font-weight: 500;
`;

const Score = styled.span`
  font-weight: bold;
  margin-left: auto;
`;

const DateSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DateButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${({ active, theme }: { active: boolean, theme: any }) => 
    active ? theme.colors.secondary : theme.colors.lightGray};
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.small};
  font-weight: ${({ active }: { active: boolean }) => (active ? 'bold' : 'normal')};
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ active, theme }: { active: boolean, theme: any }) => 
      active ? theme.colors.secondary : theme.colors.gray};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }: { theme: any }) => theme.colors.gray};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }: { theme: any }) => theme.colors.danger};
`;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { matches, liveMatches, loading, error } = useSelector(
    (state: RootState) => state.matches
  );
  const [selectedDate, setSelectedDate] = useState<string>('today');
  
  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchLiveMatches());
    
    // Aktualizace živých zápasů každou minutu
    const interval = setInterval(() => {
      dispatch(fetchLiveMatches());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const getDateLabel = (date: Date): string => {
    return format(date, 'd. MMMM', { locale: cs });
  };
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const filteredMatches = matches.filter((match: any) => {
    const matchDate = new Date(match.date);
    if (selectedDate === 'today') {
      return matchDate.toDateString() === today.toDateString();
    } else if (selectedDate === 'yesterday') {
      return matchDate.toDateString() === yesterday.toDateString();
    } else if (selectedDate === 'tomorrow') {
      return matchDate.toDateString() === tomorrow.toDateString();
    }
    return true;
  });
  
  if (loading && matches.length === 0) {
    return <LoadingMessage theme={theme}>Načítání zápasů...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage theme={theme}>{error}</ErrorMessage>;  
  }
  
  return (
    <HomeContainer>
      <section>
        <SectionTitle>Živé zápasy</SectionTitle>
        {liveMatches.length > 0 ? (
          <MatchesGrid>
            {liveMatches.map((match: any) => (
              <MatchCard 
                key={match.id} 
                to={`/match/${match.id}`}
                className="live"
              >
                <MatchHeader>
                  <MatchDate>{format(new Date(match.date), 'HH:mm')}</MatchDate>
                  <MatchStatus status="live">ŽIVĚ</MatchStatus>
                </MatchHeader>
                <Teams>
                  <Team>
                    <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} />
                    <TeamName>{match.homeTeam.name}</TeamName>
                    <Score>{match.score.home}</Score>
                  </Team>
                  <Team>
                    <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} />
                    <TeamName>{match.awayTeam.name}</TeamName>
                    <Score>{match.score.away}</Score>
                  </Team>
                </Teams>
              </MatchCard>
            ))}
          </MatchesGrid>
        ) : (
          <p>Momentálně neprobíhají žádné živé zápasy.</p>
        )}
      </section>
      
      <section>
        <SectionTitle>Zápasy</SectionTitle>
        <DateSelector>
          <DateButton 
            active={selectedDate === 'yesterday'} 
            onClick={() => setSelectedDate('yesterday')}
          >
            Včera
          </DateButton>
          <DateButton 
            active={selectedDate === 'today'} 
            onClick={() => setSelectedDate('today')}
          >
            Dnes
          </DateButton>
          <DateButton 
            active={selectedDate === 'tomorrow'} 
            onClick={() => setSelectedDate('tomorrow')}
          >
            Zítra
          </DateButton>
        </DateSelector>
        
        {filteredMatches.length > 0 ? (
          <MatchesGrid>
            {filteredMatches.map((match: any) => (
              <MatchCard 
                key={match.id} 
                to={`/match/${match.id}`}
                className={match.status === 'live' ? 'live' : ''}
              >
                <MatchHeader>
                  <MatchDate>{new Date(match.date).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})}</MatchDate> 
                  <MatchStatus status={match.status}>
                    {match.status === 'live' 
                      ? 'ŽIVĚ' 
                      : match.status === 'finished' 
                        ? 'KONEC' 
                        : 'NAPLÁNOVÁNO'}
                  </MatchStatus>
                </MatchHeader>
                <Teams>
                  <Team>
                    <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} />
                    <TeamName>{match.homeTeam.name}</TeamName>
                    <Score>
                      {match.status === 'scheduled' ? '-' : match.score.home}
                    </Score>
                  </Team>
                  <Team>
                    <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} />
                    <TeamName>{match.awayTeam.name}</TeamName>
                    <Score>
                      {match.status === 'scheduled' ? '-' : match.score.away}
                    </Score>
                  </Team>
                </Teams>
              </MatchCard>
            ))}
          </MatchesGrid>
        ) : (
          <p>Žádné zápasy pro vybrané datum.</p>
        )}
      </section>
    </HomeContainer>
  );
};

export default HomePage;