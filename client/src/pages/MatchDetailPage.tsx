import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store.ts';
import { fetchMatchById } from '../redux/slices/matchesSlice.ts';
import styled from 'styled-components';
import { theme } from '../styles/theme.ts';
import { getTeamLogo } from '../utils/teamLogos.ts';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    gap: 0;
  }
`;

const TeamColumn = styled.div<{ align?: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  
  @media (max-width: 767px) {
    align-items: ${({ align }) => align === 'left' ? 'flex-start' : (align === 'right' ? 'flex-end' : 'center')};
    text-align: ${({ align }) => align === 'left' ? 'left' : (align === 'right' ? 'right' : 'center')};
  }
`;

const TeamLogo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }
`;

const TeamName = styled.h2`
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
  color: white;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
    text-align: center;
  }
`;

const ScoreColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  min-width: 80px;
  
  @media (min-width: 768px) {
    width: auto;
    padding: 0 2rem;
  }
`;

const Score = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  font-family: 'Monaco', 'Consolas', monospace;
  line-height: 1;
  margin-bottom: 0.25rem;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
  }
`;

const MatchStatus = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const RoundInfo = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const MatchDetailsText = styled.div`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #cbd5e1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (min-width: 768px) {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    gap: 0.35rem;
  }
  
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  span {
    opacity: 0.8;
  }
`;

const TimelineSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const HalfHeader = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  margin: 0 0 0.75rem 0;
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding-bottom: 0.75rem;
    margin: 0 0 1rem 0;
  }
`;

const EventRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  align-items: center;
  margin-bottom: 0.5rem;
  min-height: 28px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 60px 1fr;
    margin-bottom: 0.75rem;
    min-height: 32px;
  }
`;

const EventContent = styled.div<{ align: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => align === 'left' ? 'flex-start' : 'flex-end'};
  gap: 0.25rem;
  text-align: ${({ align }) => align};
  font-size: 0.8125rem;
  
  @media (min-width: 768px) {
    gap: 0.5rem;
    font-size: 0.9375rem;
  }
`;

const EventTime = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: #64748b;
  font-size: 0.75rem;
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Icon = styled.span`
  font-size: 0.875rem;
  line-height: 1;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: visible;
  
  @media (min-width: 768px) {
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: ${({ active }) => (active ? '#f1f5f9' : 'white')};
  color: ${({ active }) => (active ? '#0f172a' : '#64748b')};
  font-weight: 600;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${({ active }) => (active ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none')};
  border-color: ${({ active }) => (active ? '#cbd5e1' : '#e2e8f0')};
  min-height: 44px;
  min-width: 0;
  flex: 1 1 auto;
  text-align: center;
  line-height: 1;
  white-space: nowrap;

  @media (min-width: 768px) {
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-height: auto;
    min-width: auto;
    flex: 0 1 auto;
    border-radius: 9999px;
  }

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  
  /* Hide icons on very small screens if needed, but try to keep them first */
  & > span {
    display: none;
    @media (min-width: 360px) {
      display: inline;
    }
    @media (min-width: 768px) {
      display: inline;
    }
  }
`;

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentMatch, loading } = useSelector((state: RootState) => state.matches);

  useEffect(() => {
    if (id) {
      dispatch(fetchMatchById(id));
    }
  }, [dispatch, id]);

  const [activeFilter, setActiveFilter] = React.useState<string>('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  if (loading && !currentMatch) {
    return <div>Načítám detail zápasu...</div>;
  }
  if (!currentMatch) {
    return <div>Zápas nenalezen</div>;
  }

  const statusLabel = currentMatch.status === 'live'
    ? 'ŽIVĚ'
    : currentMatch.status === 'finished'
      ? 'KONEC'
      : currentMatch.status === 'awarded'
        ? 'KONTUMACE'
        : currentMatch.status === 'canceled'
          ? 'ZRUŠENO'
          : currentMatch.status === 'not_played'
            ? 'NEODEHRÁNO'
            : 'NAPLÁNOVÁNO';

  const combinedScore = (currentMatch.status === 'scheduled' || currentMatch.status === 'canceled' || currentMatch.status === 'not_played')
    ? '-:-'
    : `${currentMatch.score.home}-${currentMatch.score.away}`;

  const dateObj = new Date(currentMatch.date);
  const dateStr = dateObj.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = dateObj.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const stadiumName = currentMatch.stadium;

  return (
    <Container>
      <Header>
        <MatchInfo>
          <TeamColumn align="left">
            <TeamLogo src={getTeamLogo(currentMatch.homeTeam.name)} alt={currentMatch.homeTeam.name} />
            <TeamName>{currentMatch.homeTeam.name}</TeamName>
          </TeamColumn>
          
          <ScoreColumn>
            <Score>{combinedScore}</Score>
            <MatchStatus>{statusLabel}</MatchStatus>
            {(currentMatch as any).round && <RoundInfo>{(currentMatch as any).round}. kolo</RoundInfo>}
            
            <MatchDetailsText>
              <div>
                <span></span> {dateStr} | {timeStr}
              </div>
              <div>
                <span></span> {stadiumName}
              </div>
            </MatchDetailsText>
          </ScoreColumn>

          <TeamColumn align="right">
            <TeamLogo src={getTeamLogo(currentMatch.awayTeam.name)} alt={currentMatch.awayTeam.name} />
            <TeamName>{currentMatch.awayTeam.name}</TeamName>
          </TeamColumn>
        </MatchInfo>
      </Header>

      <FilterContainer>
        <FilterButton 
          active={activeFilter === 'all'} 
          onClick={() => handleFilterChange('all')}
        >
          Vše
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'goal'} 
          onClick={() => handleFilterChange('goal')}
        >
          <span></span> Góly
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'yellow_card'} 
          onClick={() => handleFilterChange('yellow_card')}
        >
          <span></span> Žluté karty
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'red_card'} 
          onClick={() => handleFilterChange('red_card')}
        >
          <span></span> Červené karty
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'substitution'} 
          onClick={() => handleFilterChange('substitution')}
        >
          <span></span> Střídání
        </FilterButton>
      </FilterContainer>

      <TimelineSection>
        {currentMatch.events && currentMatch.events.length > 0 ? (
          <div>
            {renderHalf('1. POLOČAS', currentMatch, 'first', activeFilter)}
            {renderHalf('2. POLOČAS', currentMatch, 'second', activeFilter)}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Žádné události k zobrazení.</p>
        )}
      </TimelineSection>
    </Container>
  );
};

export default MatchDetailPage;

function formatMinute(m: number): string {
  if (m >= 46 && m <= 54) return `45+${m - 45}`;
  if (m >= 91) return `90+${m - 90}`;
  return String(m);
}

function isFirstHalf(m: number): boolean {
  return m <= 45 || (m >= 46 && m <= 54);
}

function renderHalf(title: string, match: any, half: 'first' | 'second', activeFilter: string) {
  const events = [...match.events].sort((a: any, b: any) => a.minute - b.minute);
  const filtered = events.filter((e: any) =>
    (half === 'first' ? isFirstHalf(e.minute) : !isFirstHalf(e.minute)) &&
    (activeFilter === 'all' || e.type === activeFilter)
  );
  
  if (filtered.length === 0) return null;

  return (
    <div>
      <HalfHeader>{title}</HalfHeader>
      <div>
        {filtered.map((e: any) => {
          const isHome = e.team === 'home';
          
          const icon =
            e.type === 'goal' ? '⚽' :
            e.type === 'yellow_card' ? '🟨' :
            e.type === 'red_card' ? '🟥' : '🔁';
            
          const minuteText = formatMinute(e.minute);
          const playerText = e.player?.name ? `${e.player.name}` : '';
          const assistText = e.assistPlayer?.name ? ` (${e.assistPlayer.name})` : '';
          const noteText = e.note ? ` (${e.note})` : '';
          
          const content = (
            <>
              {isHome ? (
                 <>
                   <span>{playerText}{assistText}{noteText}</span>
                   <Icon>{icon}</Icon>
                 </>
              ) : (
                 <>
                   <Icon>{icon}</Icon>
                   <span>{playerText}{assistText}{noteText}</span>
                 </>
              )}
            </>
          );

          return (
            <EventRow key={e.id}>
              <EventContent align="right">
                {isHome && content}
              </EventContent>
              <EventTime>{minuteText}'</EventTime>
              <EventContent align="left">
                {!isHome && content}
              </EventContent>
            </EventRow>
          );
        })}
      </div>
    </div>
  );
}
