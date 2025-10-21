import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store.ts';
import { fetchTable } from '../redux/slices/tableSlice.ts';

const TablePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTable());
  }, [dispatch]);

  const table = useSelector((state: RootState) => state.table.table);

  return (
    <div>
      <h1>Tabulka</h1>
      <table>
        <thead>
          <tr>
            <th>Pořadí</th>
            <th>Tým</th>
            <th>Zápasy</th>
            <th>Výhry</th>
            <th>Remízy</th>
            <th>Prohry</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {table.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.team.name}</td>
              <td>{entry.played}</td>
              <td>{entry.won}</td>
              <td>{entry.drawn}</td>
              <td>{entry.lost}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;