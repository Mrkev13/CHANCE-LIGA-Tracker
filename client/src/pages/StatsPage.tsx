import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { 
  selectTopScorers, 
  selectTopAssists, 
  selectTopYellowCards, 
  selectTopRedCards 
} from '../redux/statsSelectors.ts';
import Navigation from '../components/Navigation.tsx';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  padding-bottom: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Count = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  min-width: 2rem;
  text-align: center;
`;

const StatsPage: React.FC = () => {
  const topScorers = useSelector(selectTopScorers);
  const topAssists = useSelector(selectTopAssists);
  const yellowCards = useSelector(selectTopYellowCards);
  const redCards = useSelector(selectTopRedCards);

  return (
    <PageContainer>
      <Navigation />
      <Title>Statistiky hráčů</Title>
      <Grid>
        <StatCard>
          <CardTitle>Střelci</CardTitle>
          <List>
            {topScorers.length > 0 ? (
              topScorers.map(player => (
                <ListItem key={player.id}>
                  <PlayerName>{player.name}</PlayerName>
                  <Count>{player.count}</Count>
                </ListItem>
              ))
            ) : (
              <ListItem><PlayerName>Žádná data</PlayerName></ListItem>
            )}
          </List>
        </StatCard>

        <StatCard>
          <CardTitle>Asistence</CardTitle>
          <List>
            {topAssists.length > 0 ? (
              topAssists.map(player => (
                <ListItem key={player.id}>
                  <PlayerName>{player.name}</PlayerName>
                  <Count>{player.count}</Count>
                </ListItem>
              ))
            ) : (
              <ListItem><PlayerName>Žádná data</PlayerName></ListItem>
            )}
          </List>
        </StatCard>

        <StatCard>
          <CardTitle>Žluté karty</CardTitle>
          <List>
            {yellowCards.length > 0 ? (
              yellowCards.map(player => (
                <ListItem key={player.id}>
                  <PlayerName>{player.name}</PlayerName>
                  <Count>{player.count}</Count>
                </ListItem>
              ))
            ) : (
              <ListItem><PlayerName>Žádná data</PlayerName></ListItem>
            )}
          </List>
        </StatCard>

        <StatCard>
          <CardTitle>Červené karty</CardTitle>
          <List>
            {redCards.length > 0 ? (
              redCards.map(player => (
                <ListItem key={player.id}>
                  <PlayerName>{player.name}</PlayerName>
                  <Count>{player.count}</Count>
                </ListItem>
              ))
            ) : (
              <ListItem><PlayerName>Žádná data</PlayerName></ListItem>
            )}
          </List>
        </StatCard>
      </Grid>
    </PageContainer>
  );
};

export default StatsPage;
