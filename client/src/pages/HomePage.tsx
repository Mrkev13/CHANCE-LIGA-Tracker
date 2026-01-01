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
  gap: 0.5rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
        : status === 'awarded'
          ? theme.colors.secondary
          : status === 'canceled' || status === 'not_played'
            ? theme.colors.danger
            : theme.colors.gray};
  color: white;
`;

const CombinedScore = styled.span`
  font-weight: bold;
  background-color: ${({ theme }: { theme: any }) => theme.colors.gray};
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.small};
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
  color: #ffffff;
`;

const Score = styled.span`
  font-weight: bold;
  margin-left: auto;
  color: #ffffff;
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
      {/* odstraněn banner Filtrováno: FORTUNA:LIGA */}
      

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
                            <CombinedScore>
                              {match.status === 'scheduled' || match.status === 'canceled' || match.status === 'not_played' 
                                ? '-:-' 
                                : `${match.score.home}:${match.score.away}`}
                            </CombinedScore>
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
                        <Teams>
                          <Team>
                            <TeamLogo src={getTeamLogo(match.homeTeam.name, match.homeTeam.logo)} alt={match.homeTeam.name} />
                            <TeamName>{match.homeTeam.name}</TeamName>
                            <Score>
                              {match.status === 'scheduled' || match.status === 'canceled' || match.status === 'not_played' ? '-' : match.score.home}
                            </Score>
                          </Team>
                          <Team>
                            <TeamLogo src={getTeamLogo(match.awayTeam.name, match.awayTeam.logo)} alt={match.awayTeam.name} />
                            <TeamName>{match.awayTeam.name}</TeamName>
                            <Score>
                              {match.status === 'scheduled' || match.status === 'canceled' || match.status === 'not_played' ? '-' : match.score.away}
                            </Score>
                          </Team>
                        </Teams>
                        {match.stadium || match.competition?.name ? (
                          <MatchDate>
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
      {/* sekce Živé zápasy a Zápasy odstraněny */}
    </HomeContainer>
  );
};

export default HomePage;
