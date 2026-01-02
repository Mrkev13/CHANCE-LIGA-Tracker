import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchMatches } from '../redux/slices/matchesSlice.ts';
import { RootState, AppDispatch } from '../redux/store.ts';
// odstraněn import format (již se nepoužívá)
import { theme } from '../styles/theme.ts';
import { getTeamLogo } from '../utils/teamLogos.ts';

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

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavButton = styled(Link)<{ $active?: boolean }>`
  padding: 0.75rem 2rem;
  background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : theme.colors.lightGray};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.secondary : 'transparent'};

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : '#495057'};
    transform: translateY(-2px);
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MatchCard = styled(Link)`
  background-color: ${({ theme }: { theme: any }) => theme.colors.lightGray};
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.large};     
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
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
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const MatchContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const TeamSide = styled.div<{ align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    align-items: ${({ align }) => align === 'left' ? 'flex-start' : 'flex-end'};
    text-align: ${({ align }) => align === 'left' ? 'left' : 'right'};
    gap: 0.5rem;
  }
`;

const TeamLogo = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  transition: transform 0.2s;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
  
  ${MatchCard}:hover & {
    transform: scale(1.1);
  }
`;

const TeamName = styled.h2`
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

const VersusScore = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  font-family: 'Monaco', 'Consolas', monospace;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MatchDate = styled.span`
  font-size: 0.85rem;
  color: #adb5bd;
`;

const MatchStatus = styled.span<{ status: string }>`
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  text-transform: uppercase;
  background-color: ${({ status, theme }: { status: string, theme: any }) =>  
    status === 'live' 
      ? theme.colors.secondary 
      : status === 'finished' 
        ? theme.colors.success 
        : status === 'awarded'
          ? theme.colors.secondary
          : status === 'canceled' || status === 'not_played'
            ? theme.colors.danger
            : '#495057'};
  color: white;
`;

// DateSelector a DateButton odstraněny (nepoužívají se)

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
  const { matches, loading, error } = useSelector(
    (state: RootState) => state.matches
  );
  // odstraněno filtrování podle data a živé zápasy
  
  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);
  
  // pomocná funkce byla nevyužitá, odstraněno kvůli eslint varování
  
  // filtrování podle data odstraněno; sekce Zápasy s datumy byla odstraněna

  const finishedSortedMatches: any[] = [];

  // Seskupení podle kola (Livesport styl)
  const roundsMap: Record<string, any[]> = {};
  matches.forEach((m: any) => {
    if (m.round) {
      const key = String(m.round);
      if (!roundsMap[key]) roundsMap[key] = [];
      roundsMap[key].push(m);
    }
  });
  const sortedRoundKeys = Object.keys(roundsMap)
    .sort((a, b) => Number(b) - Number(a));
  
  if (loading && matches.length === 0) {
    return <LoadingMessage theme={theme}>Načítání zápasů...</LoadingMessage>;
  }
  
  // Pokud dojde k chybě (např. živé zápasy 401), nezablokujeme celou stránku,
  // ale zobrazíme chybu jen pokud nejsou žádné zápasy k zobrazení.
  if (error && matches.length === 0) {
    return <ErrorMessage theme={theme}>{error}</ErrorMessage>;  
  }
  
  return (
    <HomeContainer>
      <NavContainer>
        <NavButton to="/" $active={true}>Zápasy</NavButton>
        <NavButton to="/table">Tabulka</NavButton>
      </NavContainer>

      <section>
        <SectionTitle>Zápasy podle kola</SectionTitle>
        {sortedRoundKeys.length > 0 ? (
          <div>
            {sortedRoundKeys.map((roundKey: string) => {
              const roundMatches = roundsMap[roundKey]
                .slice(0, 8)
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
              return (
                <div key={roundKey} style={{ marginBottom: '1.5rem' }}>
                  <SectionTitle>Kolo {roundKey}</SectionTitle>
                  <MatchesGrid>
                    {roundMatches.map((match: any) => (
                      <MatchCard 
                        key={match.id} 
                        to={`/match/${match.id}`}
                        className={match.status === 'live' ? 'live' : ''}
                      >
                        <MatchHeader>
                          <MatchDate>{new Date(match.date).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})}</MatchDate>
                          <HeaderRight>
                            <MatchStatus status={match.status}>
                              {match.status === 'live' 
                                ? 'ŽIVĚ' 
                                : match.status === 'finished' 
                                  ? 'KONEC' 
                                  : match.status === 'awarded'
                                    ? 'KONTUMACE'
                                    : match.status === 'canceled'
                                      ? 'ZRUŠENO'
                                      : match.status === 'not_played'
                                        ? 'NEODEHRÁNO'
                                        : 'NAPLÁNOVÁNO'}
                            </MatchStatus>
                          </HeaderRight>
                        </MatchHeader>
                        
                        <MatchContent>
                          <TeamSide align="left">
                            <TeamLogo src={getTeamLogo(match.homeTeam.name, match.homeTeam.logo)} alt={match.homeTeam.name} />
                            <TeamName>{match.homeTeam.name}</TeamName>
                          </TeamSide>
                          
                          <ScoreSection>
                            <VersusScore>
                              {match.status === 'scheduled' || match.status === 'canceled' || match.status === 'not_played' 
                                ? '-:-' 
                                : `${match.score.home}:${match.score.away}`}
                            </VersusScore>
                          </ScoreSection>
                          
                          <TeamSide align="right">
                            <TeamLogo src={getTeamLogo(match.awayTeam.name, match.awayTeam.logo)} alt={match.awayTeam.name} />
                            <TeamName>{match.awayTeam.name}</TeamName>
                          </TeamSide>
                        </MatchContent>

                        {match.stadium || match.competition?.name ? (
                          <MatchDate style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            {match.stadium ? `Stadion: ${match.stadium}` : ''}
                            {match.competition?.name ? `${match.stadium ? ' • ' : ''}${match.competition.name}` : ''}
                          </MatchDate>
                        ) : null}
                      </MatchCard>
                    ))}
                  </MatchesGrid>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Žádná data o kolech nejsou k dispozici.</p>
        )}
      </section>
    </HomeContainer>
  );
};

export default HomePage;
