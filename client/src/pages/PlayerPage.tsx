import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '../redux/store.ts';
import { fetchPlayers } from '../redux/slices/playersSlice.ts';

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);
  const player = useSelector((state: RootState) => 
    state.players.players.find(p => p.id === id)
  );

  if (!player) {
    return <div>Hráč nenalezen</div>;
  }

  return (
    <div>
      <h1>{player.name}</h1>
      <div>
        <p>Tým: {player.teamName}</p>
        <p>Pozice: {player.position}</p>
      </div>
    </div>
  );
};

export default PlayerPage;
// Remove mistakenly appended useEffect after export