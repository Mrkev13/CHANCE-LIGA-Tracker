import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../redux/store.ts';
import { fetchTable } from '../redux/slices/tableSlice.ts';
import { getTeamLogo } from '../utils/teamLogos.ts';

const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  color: #333333;
  font-family: ${({ theme }) => theme.fonts.main};
  min-width: 800px; /* Ensure table doesn't squash on small screens */
`;

const Thead = styled.thead`
  background-color: #f8f9fa;
`;

const Th = styled.th`
  padding: 18px 24px;
  text-align: left;
  font-weight: 700;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
  
  &:first-child {
    text-align: center;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;

  &:not(:last-child) td {
    border-bottom: 1px solid #e9ecef;
  }

  &:hover {
    background-color: #f1f3f5;
  }
`;

const Td = styled.td`
  padding: 16px 24px;
  vertical-align: middle;
  color: #495057;
  font-size: 1rem;
`;

const PositionTd = styled(Td)`
  font-weight: 700;
  color: #adb5bd;
  text-align: center;
  width: 60px;
`;

const TeamCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TeamName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  letter-spacing: 0.02em;
`;

const TeamLogo = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
`;

const PointsTd = styled(Td)`
  font-weight: 800;
  color: #212529;
  font-size: 1.1rem;
`;

const StatTd = styled(Td)`
  font-feature-settings: "tnum";
`;

const FormContainer = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const FormBadge = styled.div<{ $result: string }>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: #fff;
  background-color: ${({ $result }) => {
    switch ($result) {
      case 'W': return '#00c853'; // Jasnější zelená
      case 'D': return '#ffc107'; // Žlutá
      case 'L': return '#ff3d00'; // Červená
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
      <Title>Tabulka</Title>
      <TableWrapper>
        <StyledTable>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>Tým</Th>
              <Th>Zápasy</Th>
              <Th>Výhry</Th>
              <Th>Remízy</Th>
              <Th>Prohry</Th>
              <Th>Skóre</Th>
              <Th>Body</Th>
              <Th>Forma</Th>
            </tr>
          </Thead>
          <tbody>
            {table.map((entry, index) => (
              <Tr key={entry.id}>
                <PositionTd>{index + 1}.</PositionTd>
                <Td>
                  <TeamCell>
                    <TeamLogo src={getTeamLogo(entry.team.name, entry.team.logo)} alt={entry.team.name} />
                    <TeamName>{entry.team.name}</TeamName>
                  </TeamCell>
                </Td>
                <StatTd>{entry.played}</StatTd>
                <StatTd>{entry.won}</StatTd>
                <StatTd>{entry.drawn}</StatTd>
                <StatTd>{entry.lost}</StatTd>
                <StatTd>{entry.goalsFor}:{entry.goalsAgainst}</StatTd>
                <PointsTd>{entry.points}</PointsTd>
                <Td>
                  <FormContainer>
                    {entry.form.map((result, idx) => (
                      <FormBadge key={idx} $result={result}>
                        {result === 'W' ? 'V' : result === 'D' ? 'R' : 'P'}
                      </FormBadge>
                    ))}
                  </FormContainer>
                </Td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </PageContainer>
  );
};

export default TablePage;