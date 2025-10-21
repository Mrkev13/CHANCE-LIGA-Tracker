import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';

const MatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const match = useSelector((state: RootState) => 
    state.matches.matches.find(m => m.id === id)
  );

  if (!match) {
    return <div>Zápas nenalezen</div>;
  }

  return (
    <div>
      <h1>Detail zápasu</h1>
      <div>
        <h2>{match.homeTeam.name} vs {match.awayTeam.name}</h2>
        <p>Skóre: {match.score.home} - {match.score.away}</p> 
        <p>Datum: {new Date(match.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default MatchDetailPage;