import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTable } from '../redux/slices/tableSlice';
import { getTeamLogo } from '../utils/teamLogos';
import Navigation from '../components/Navigation';

const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #00141e; /* Dark background matching the screenshot */
  min-height: 100vh;
  color: #ffffff;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  background-color: #0f2d40;
  border: 1px solid #1f3b4d;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #0f2d40;
  color: #ffffff;
  font-family: ${({ theme }) => theme.fonts.main};
  
  @media (min-width: 769px) {
    min-width: 800px;
  }
`;

const Thead = styled.thead`
  background-color: #0b2230;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: center;
  font-weight: 700;
  color: #8da3b1;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #1f3b4d;
  white-space: nowrap;
  
  &:nth-child(2) {
    text-align: left;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.7rem;
  }
`;

const MobileHiddenTh = styled(Th)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;

  &:not(:last-child) td {
    border-bottom: 1px solid #1f3b4d;
  }

  &:hover {
    background-color: #1a3547;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  vertical-align: middle;
  color: #ffffff;
  font-size: 0.95rem;
  text-align: center;

  &:nth-child(2) {
    text-align: left;
  }

  @media (max-width: 768px) {
    padding: 10px 6px;
    font-size: 0.85rem;
  }
`;

const MobileHiddenTd = styled(Td)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PositionBadge = styled.div<{ $rank: number }>`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  margin: 0 auto;
  background-color: ${({ $rank }) => {
    if ($rank <= 6) return '#007bff'; // Title group (Blue)
    if ($rank <= 10) return '#17a2b8'; // Playoff (Cyan/Teal)
    if ($rank >= 11) return '#dc3545'; // Relegation (Red)
    return 'transparent';
  }};
`;

const TeamCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const TeamName = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 1rem;
  letter-spacing: 0.01em;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TeamLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const PointsTd = styled(Td)`
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
`;

const StatTd = styled(Td)`
  font-feature-settings: "tnum";
  color: #ced4da;
`;

const MobileHiddenStatTd = styled(StatTd)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormContainer = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
`;

const FormBadge = styled.div<{ $result: string }>`
  width: 22px;
  height: 22px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.7rem;
  color: #fff;
  background-color: ${({ $result }) => {
    switch ($result) {
      case 'W': return '#28a745'; // Green
      case 'D': return '#fd7e14'; // Orange
      case 'L': return '#dc3545'; // Red
      default: return '#6c757d';
    }
  }};
`;

const TablePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTable());
  }, [dispatch]);

  const table = useSelector((state: RootState) => state.table.table);

  return (
    <PageContainer>
      <Navigation />
      <Title>Tabulka</Title>
      <TableWrapper>
        <StyledTable>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>TÝM</Th>
              <Th>Z</Th>
              <MobileHiddenTh>V</MobileHiddenTh>
              <MobileHiddenTh>R</MobileHiddenTh>
              <MobileHiddenTh>P</MobileHiddenTh>
              <Th>G</Th>
              <Th>RS</Th>
              <Th>B</Th>
              <MobileHiddenTh>FORMA</MobileHiddenTh>
            </tr>
          </Thead>
          <tbody>
            {table.map((entry, index) => (
              <Tr key={entry.id}>
                <Td>
                  <PositionBadge $rank={index + 1}>
                    {index + 1}.
                  </PositionBadge>
                </Td>
                <Td>
                  <TeamCell>
                    <TeamLogo src={getTeamLogo(entry.team.name, entry.team.logo)} alt={entry.team.name} />
                    <TeamName>{entry.team.name}</TeamName>
                  </TeamCell>
                </Td>
                <StatTd>{entry.played}</StatTd>
                <MobileHiddenStatTd>{entry.won}</MobileHiddenStatTd>
                <MobileHiddenStatTd>{entry.drawn}</MobileHiddenStatTd>
                <MobileHiddenStatTd>{entry.lost}</MobileHiddenStatTd>
                <StatTd>{entry.goalsFor}:{entry.goalsAgainst}</StatTd>
                <StatTd>{entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}</StatTd>
                <PointsTd>{entry.points}</PointsTd>
                <MobileHiddenTd>
                  <FormContainer>
                    {entry.form.map((result, idx) => (
                      <FormBadge key={idx} $result={result}>
                        {result === 'W' ? 'V' : result === 'D' ? 'R' : 'P'}
                      </FormBadge>
                    ))}
                  </FormContainer>
                </MobileHiddenTd>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </PageContainer>
  );
};

export default TablePage;
