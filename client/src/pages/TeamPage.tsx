import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTeams } from '../redux/slices/teamsSlice';
import { fetchMatches } from '../redux/slices/matchesSlice';
import Navigation from '../components/Navigation';
import { getTeamLogo } from '../utils/teamLogos';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  border: 1px solid #444;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`;

const TeamInfo = styled.div`
  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #ffffff;
  }
  p {
    color: #ccc;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border: 1px solid #444;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding-bottom: 0.5rem;
  display: inline-block;
  color: #ffffff;
`;

const MatchItem = styled.div<{ result?: 'win' | 'draw' | 'loss' }>`
  display: grid;
  grid-template-columns: 90px 1.5fr auto 1.5fr 140px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #444;
  color: #f0f0f0;
  border-left: 4px solid ${({ result, theme }) => 
    result === 'win' ? '#28a745' : 
    result === 'draw' ? '#ffc107' : 
    result === 'loss' ? '#dc3545' : 'transparent'};

  &:last-child {
    border-bottom: none;
  }
`;

const MatchDate = styled.span`
  min-width: 90px;
  font-size: 0.9rem;
  color: #ccc;
`;

const TeamSide = styled.div<{ highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: ${({ highlight }) => (highlight ? 600 : 400)};
`;

const TeamLogoSmall = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: contain;
  background: #2a2a2a;
  padding: 2px;
`;

const ScoreBadge = styled.div`
  min-width: 64px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

const MatchExtra = styled.span`
  min-width: 120px;
  text-align: right;
  font-size: 0.9rem;
  color: #ccc;
`;

const FormContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const FormBadge = styled.div<{ result: 'W' | 'D' | 'L' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background-color: ${({ result }) => 
    result === 'W' ? '#28a745' : 
    result === 'D' ? '#ffc107' : '#dc3545'};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #444;
  color: #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { teams } = useSelector((state: RootState) => state.teams);
  const { matches } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    dispatch(fetchTeams());
    if (matches.length === 0) dispatch(fetchMatches());
  }, [dispatch, matches.length]);

  const team = teams.find(t => t.id === id);
  
  const stats = useMemo(() => {
    if (!id) return null;
    const teamMatches = matches.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
    const sorted = [...teamMatches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
    const played = sorted.filter(m => m.status === 'finished');
    const scheduled = sorted.filter(m => m.status !== 'finished').reverse(); // Soonest first

    // Form (last 5 played)
    const form = played.slice(0, 5).map(m => {
      const isHome = m.homeTeam.id === id;
      const myScore = isHome ? m.score.home : m.score.away;
      const oppScore = isHome ? m.score.away : m.score.home;
      if (myScore > oppScore) return 'W';
      if (myScore === oppScore) return 'D';
      return 'L';
    }).reverse(); // Oldest to newest for visual flow left-to-right

    // Player Stats Aggregation
    const goals: Record<string, number> = {};
    const assists: Record<string, number> = {};
    const cards: Record<string, number> = {};
    const subs: Record<string, number> = {};

    played.forEach(m => {
      const isHome = m.homeTeam.id === id;
      const teamSide = isHome ? 'home' : 'away';
      
      m.events.forEach(e => {
        if (e.team === teamSide) {
          if (e.type === 'goal' && e.player) {
             goals[e.player.name] = (goals[e.player.name] || 0) + 1;
             if (e.assistPlayer) assists[e.assistPlayer.name] = (assists[e.assistPlayer.name] || 0) + 1;
          }
          if (e.type.includes('card') && e.player) {
             cards[e.player.name] = (cards[e.player.name] || 0) + 1;
          }
          if (e.type === 'substitution' && e.playerOut) {
             subs[e.playerOut.name] = (subs[e.playerOut.name] || 0) + 1;
          }
        }
      });
    });

    const getTop = (record: Record<string, number>) => 
      Object.entries(record).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return {
      played,
      scheduled,
      form,
      topScorers: getTop(goals),
      topAssists: getTop(assists),
      topCards: getTop(cards),
      mostSubbed: getTop(subs)
    };
  }, [matches, id]);

  if (!team || !stats) return <PageContainer>Načítání...</PageContainer>;

  const logoSrc = getTeamLogo(team.name);

  return (
    <PageContainer>
      <Navigation />
      
      <Header>
        <Logo src={logoSrc} alt={team.name} />
        <TeamInfo>
          <h1>{team.name}</h1>
          <p>{team.stadium}</p>
        </TeamInfo>
      </Header>

      <Grid>
        <div>
          <Section>
            <SectionTitle>Forma (posledních 5 zápasů)</SectionTitle>
            <FormContainer>
              {stats.form.map((res, i) => (
                <FormBadge key={i} result={res as 'W' | 'D' | 'L'}>{res}</FormBadge>
              ))}
              {stats.form.length === 0 && <p>Zatím žádné odehrané zápasy</p>}
            </FormContainer>
          </Section>

          <Section>
            <SectionTitle>Odehrané Zápasy</SectionTitle>
            {stats.played.map(m => {
              const isHome = m.homeTeam.id === id;
              const result = isHome 
                ? (m.score.home > m.score.away ? 'win' : m.score.home === m.score.away ? 'draw' : 'loss')
                : (m.score.away > m.score.home ? 'win' : m.score.away === m.score.home ? 'draw' : 'loss');
              
              return (
                <MatchItem key={m.id} result={result}>
                  <MatchDate>{new Date(m.date).toLocaleDateString()}</MatchDate>
                  <TeamSide highlight={m.homeTeam.id === id}>
                    <TeamLogoSmall
                      src={getTeamLogo(m.homeTeam.name, m.homeTeam.logo)}
                      alt={m.homeTeam.name}
                    />
                    <span>{m.homeTeam.name}</span>
                  </TeamSide>
                  <ScoreBadge>
                    {m.score.home}:{m.score.away}
                  </ScoreBadge>
                  <TeamSide highlight={m.awayTeam.id === id}>
                    <span>{m.awayTeam.name}</span>
                    <TeamLogoSmall
                      src={getTeamLogo(m.awayTeam.name, m.awayTeam.logo)}
                      alt={m.awayTeam.name}
                    />
                  </TeamSide>
                  <MatchExtra />
                </MatchItem>
              );
            })}
            {stats.played.length === 0 && <p>Žádné odehrané zápasy</p>}
          </Section>

          <Section>
            <SectionTitle>Plánované Zápasy</SectionTitle>
            {stats.scheduled.map(m => (
              <MatchItem key={m.id}>
                <MatchDate>{new Date(m.date).toLocaleDateString()}</MatchDate>
                <TeamSide highlight={m.homeTeam.id === id}>
                  <TeamLogoSmall
                    src={getTeamLogo(m.homeTeam.name, m.homeTeam.logo)}
                    alt={m.homeTeam.name}
                  />
                  <span>{m.homeTeam.name}</span>
                </TeamSide>
                <ScoreBadge>vs</ScoreBadge>
                <TeamSide highlight={m.awayTeam.id === id}>
                  <span>{m.awayTeam.name}</span>
                  <TeamLogoSmall
                    src={getTeamLogo(m.awayTeam.name, m.awayTeam.logo)}
                    alt={m.awayTeam.name}
                  />
                </TeamSide>
                <MatchExtra>{m.stadium}</MatchExtra>
              </MatchItem>
            ))}
            {stats.scheduled.length === 0 && <p>Žádné plánované zápasy</p>}
          </Section>
        </div>

        <div>
          <Section>
            <SectionTitle>Top Střelci</SectionTitle>
            {stats.topScorers.map(([name, count]) => (
              <StatRow key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </StatRow>
            ))}
            {stats.topScorers.length === 0 && <p>Bez gólů</p>}
          </Section>

          <Section>
            <SectionTitle>Asistence</SectionTitle>
            {stats.topAssists.map(([name, count]) => (
              <StatRow key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </StatRow>
            ))}
             {stats.topAssists.length === 0 && <p>Bez asistencí</p>}
          </Section>

          <Section>
            <SectionTitle>Karty (Žluté/Červené)</SectionTitle>
            {stats.topCards.map(([name, count]) => (
              <StatRow key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </StatRow>
            ))}
             {stats.topCards.length === 0 && <p>Bez karet</p>}
          </Section>

           <Section>
            <SectionTitle>Nejčastěji střídán (OUT)</SectionTitle>
            {stats.mostSubbed.map(([name, count]) => (
              <StatRow key={name}>
                <span>{name}</span>
                <strong>{count}</strong>
              </StatRow>
            ))}
             {stats.mostSubbed.length === 0 && <p>Žádná data</p>}
          </Section>
        </div>
      </Grid>
    </PageContainer>
  );
};

export default TeamPage;
