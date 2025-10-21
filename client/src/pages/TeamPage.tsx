import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store.ts';
import { useEffect } from 'react';
import { fetchTeams } from '../redux/slices/teamsSlice.ts';

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);
  const team = useSelector((state: RootState) => 
    state.teams.teams.find(t => t.id === id)
  );

  if (!team) {
    return <div>Tým nenalezen</div>;
  }

  return (
    <div>
      <h1>{team.name}</h1>
      <div>
        <p>Stadion: {team.stadium}</p>
        <p>Založeno: {team.foundedYear}</p>
        <p>Trenér: {team.coach}</p>
      </div>
    </div>
  );
};

export default TeamPage;