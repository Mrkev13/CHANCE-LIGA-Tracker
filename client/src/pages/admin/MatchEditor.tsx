import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../redux/store.ts';
import { updateMatchEvents, updateMatchScore, saveMatch } from '../../redux/slices/matchesSlice.ts';
import Navigation from '../../components/Navigation.tsx';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f0f0f0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border: 1px solid #444;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  padding-bottom: 0.5rem;
  color: #fff;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #ccc;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  background: ${({ theme, variant }) => 
    variant === 'danger' ? '#dc3545' : 
    variant === 'secondary' ? '#6c757d' : 
    theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: ${({ variant }) => variant === 'secondary' ? '1rem' : '0'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active }) => active ? 'white' : '#ccc'};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${({ theme, active }) => active ? theme.colors.primary : '#333'};
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EventItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #333;
  border-radius: 4px;
  border: 1px solid #555;
  color: white;
`;

const MatchEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const match = useSelector((state: RootState) => 
    state.matches.matches.find(m => m.id === id)
  );

  const [eventType, setEventType] = useState<'goal' | 'card' | 'substitution' | 'commentary'>('goal');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Form State
  const [minute, setMinute] = useState('');
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [player, setPlayer] = useState('');
  const [assist, setAssist] = useState('');
  const [playerIn, setPlayerIn] = useState('');
  const [playerOut, setPlayerOut] = useState('');
  const [cardType, setCardType] = useState<'yellow_card' | 'red_card'>('yellow_card');
  const [note, setNote] = useState('');
  
  // Score State
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  useEffect(() => {
    if (match) {
      setHomeScore(match.score.home);
      setAwayScore(match.score.away);
    }
  }, [match]);

  if (!match) return <PageContainer>Zápas nenalezen</PageContainer>;

  const handleUpdateScore = async () => {
    const newScore = { home: homeScore, away: awayScore };
    
    // Optimistic Update
    dispatch(updateMatchScore({
      matchId: match.id,
      score: newScore
    }));
    
    // Save to Server
    try {
      await dispatch(saveMatch({ ...match, score: newScore })).unwrap();
      alert('Skóre uloženo na server');
    } catch (err) {
      alert('Chyba: Nepodařilo se uložit na server. Zkontrolujte, zda server běží.');
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEventId(event.id);
    setMinute(event.minute.toString());
    setTeam(event.team);
    
    // Handle card types which are subtypes of 'card' in UI logic but distinct types in data
    if (event.type === 'yellow_card' || event.type === 'red_card') {
      setEventType('card');
      setCardType(event.type);
    } else {
      setEventType(event.type);
    }
    
    setNote(event.note || '');
    
    if (event.type === 'goal') {
      setPlayer(event.player?.name || '');
      setAssist(event.assistPlayer?.name || '');
    } else if (event.type === 'yellow_card' || event.type === 'red_card') {
      setPlayer(event.player?.name || '');
    } else if (event.type === 'substitution') {
      setPlayerIn(event.playerIn?.name || '');
      setPlayerOut(event.playerOut?.name || '');
    }
    
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setMinute('');
    setPlayer('');
    setAssist('');
    setPlayerIn('');
    setPlayerOut('');
    setNote('');
    setEventType('goal');
  };

  const validateEvent = () => {
    if (!minute || isNaN(Number(minute))) return 'Minuta musí být číslo';
    if (eventType === 'goal' && !player) return 'Musíte zadat střelce';
    if (eventType === 'card' && !player) return 'Musíte zadat hráče';
    if (eventType === 'substitution' && (!playerIn || !playerOut)) return 'Musíte zadat oba hráče';
    if (eventType === 'commentary' && !note) return 'Musíte zadat text komentáře';

    // Only check cards if NOT editing (to avoid blocking edit of existing event)
    if (!editingEventId && eventType === 'card' && match) {
      const playerCards = match.events.filter(e => e.type.includes('card') && e.player?.name === player);
      const reds = playerCards.filter(e => e.type === 'red_card').length;
      const yellows = playerCards.filter(e => e.type === 'yellow_card').length;
      
      if (reds > 0) return 'Tento hráč už má červenou kartu';
      if (cardType === 'yellow_card' && yellows >= 2) return 'Tento hráč už má 2 žluté karty';
    }

    return null;
  };

  const handleAddEvent = async () => {
    const error = validateEvent();
    if (error) {
      alert(error);
      return;
    }

    const newEvent: any = {
      minute: Number(minute),
      team,
      note
    };

    let newScore = { home: homeScore, away: awayScore };

    if (eventType === 'goal') {
      newEvent.type = 'goal';
      newEvent.player = { id: `p_${Math.random()}`, name: player };
      if (assist) newEvent.assistPlayer = { id: `p_${Math.random()}`, name: assist };
      
      // Calculate new score only if adding new goal, OR if editing and we want to recalc? 
      // Simplified: We assume manual score edit for corrections, but auto-increment for new goals.
      // If editing, we DON'T change score automatically to avoid mess.
      if (!editingEventId) {
        const isHome = team === 'home';
        newScore = { 
          home: isHome ? homeScore + 1 : homeScore,
          away: !isHome ? awayScore + 1 : awayScore
        };
        setHomeScore(newScore.home);
        setAwayScore(newScore.away);
        newEvent.scoreUpdate = `${newScore.home}-${newScore.away}`;
        dispatch(updateMatchScore({ matchId: match.id, score: newScore }));
      }
    } else if (eventType === 'card') {
      newEvent.type = cardType;
      newEvent.player = { id: `p_${Math.random()}`, name: player };
    } else if (eventType === 'substitution') {
      newEvent.type = 'substitution';
      newEvent.playerIn = { id: `p_${Math.random()}`, name: playerIn };
      newEvent.playerOut = { id: `p_${Math.random()}`, name: playerOut };
    } else if (eventType === 'commentary') {
      newEvent.type = 'commentary';
      // note is already set
    }

    let updatedEvents;
    if (editingEventId) {
      newEvent.id = editingEventId;
      updatedEvents = match.events.map(e => e.id === editingEventId ? { ...e, ...newEvent } : e).sort((a, b) => a.minute - b.minute);
    } else {
      newEvent.id = Math.random().toString(36).substr(2, 9);
      updatedEvents = [...match.events, newEvent].sort((a, b) => a.minute - b.minute);
    }
    
    dispatch(updateMatchEvents({ matchId: match.id, events: updatedEvents }));
    
    // Use current state score if editing, or newScore if adding goal
    const scoreToSave = editingEventId ? { home: homeScore, away: awayScore } : newScore;
    const updatedMatch = { ...match, events: updatedEvents, score: scoreToSave };
    
    try {
      await dispatch(saveMatch(updatedMatch)).unwrap();
      handleCancelEdit(); // Reset form
    } catch (err) {
      alert('Chyba: Nepodařilo se uložit na server.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Opravdu smazat tuto událost?')) {
      const updatedEvents = match.events.filter(e => e.id !== eventId);
      
      dispatch(updateMatchEvents({ matchId: match.id, events: updatedEvents }));
      
      const updatedMatch = { ...match, events: updatedEvents };
      try {
        await dispatch(saveMatch(updatedMatch)).unwrap();
      } catch (err) {
        alert('Chyba při ukládání na server');
      }
    }
  };

  return (
    <PageContainer>
      <Navigation />
      <Header>
        <h1>Editor Zápasu</h1>
        <Button onClick={() => navigate('/admin')}>Zpět na přehled</Button>
      </Header>

      <Section>
        <SectionTitle>Skóre</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FormGroup>
            <Label>{match.homeTeam.name}</Label>
            <Input 
              type="number" 
              value={homeScore} 
              onChange={(e) => setHomeScore(Number(e.target.value))} 
            />
          </FormGroup>
          <span>:</span>
          <FormGroup>
            <Label>{match.awayTeam.name}</Label>
            <Input 
              type="number" 
              value={awayScore} 
              onChange={(e) => setAwayScore(Number(e.target.value))} 
            />
          </FormGroup>
          <Button onClick={handleUpdateScore}>Uložit Skóre</Button>
        </div>
      </Section>

      <Section>
        <SectionTitle>{editingEventId ? 'Upravit Událost' : 'Přidat Událost'}</SectionTitle>
        <Tabs>
          <Tab active={eventType === 'goal'} onClick={() => setEventType('goal')}>Gól</Tab>
          <Tab active={eventType === 'card'} onClick={() => setEventType('card')}>Karta</Tab>
          <Tab active={eventType === 'substitution'} onClick={() => setEventType('substitution')}>Střídání</Tab>
          <Tab active={eventType === 'commentary'} onClick={() => setEventType('commentary')}>Komentář</Tab>
        </Tabs>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormGroup>
            <Label>Minuta</Label>
            <Input type="number" value={minute} onChange={(e) => setMinute(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Tým</Label>
            <Select value={team} onChange={(e: any) => setTeam(e.target.value)}>
              <option value="home">{match.homeTeam.name}</option>
              <option value="away">{match.awayTeam.name}</option>
            </Select>
          </FormGroup>
        </div>

        {eventType === 'goal' && (
          <>
            <FormGroup>
              <Label>Střelec</Label>
              <Input value={player} onChange={(e) => setPlayer(e.target.value)} placeholder="Jméno střelce" />
            </FormGroup>
            <FormGroup>
              <Label>Asistence (nepovinné)</Label>
              <Input value={assist} onChange={(e) => setAssist(e.target.value)} placeholder="Jméno asistenta" />
            </FormGroup>
          </>
        )}

        {eventType === 'card' && (
          <>
            <FormGroup>
              <Label>Typ Karty</Label>
              <Select value={cardType} onChange={(e: any) => setCardType(e.target.value)}>
                <option value="yellow_card">Žlutá</option>
                <option value="red_card">Červená</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Hráč</Label>
              <Input value={player} onChange={(e) => setPlayer(e.target.value)} placeholder="Hříšník" />
            </FormGroup>
          </>
        )}

        {eventType === 'substitution' && (
          <>
            <FormGroup>
              <Label>Hráč DOVNITŘ</Label>
              <Input value={playerIn} onChange={(e) => setPlayerIn(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Hráč VEN</Label>
              <Input value={playerOut} onChange={(e) => setPlayerOut(e.target.value)} />
            </FormGroup>
          </>
        )}

        {eventType === 'commentary' && (
          <FormGroup>
            <Label>Text komentáře</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Zadejte text..." />
          </FormGroup>
        )}

        {eventType !== 'commentary' && (
          <FormGroup>
            <Label>Poznámka</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Např. z penalty, hrubost..." />
          </FormGroup>
        )}

        <ButtonGroup>
          <Button onClick={handleAddEvent}>
            {editingEventId ? 'Uložit Změny' : 'Přidat Událost'}
          </Button>
          {editingEventId && (
            <Button variant="secondary" onClick={handleCancelEdit}>
              Zrušit
            </Button>
          )}
        </ButtonGroup>
      </Section>

      <Section>
        <SectionTitle>Seznam Událostí</SectionTitle>
        <EventsList>
          {match.events.map(event => (
            <EventItem key={event.id}>
              <span>
                <strong>{event.minute}'</strong> - {event.type === 'commentary' ? 'Komentář' : event.type} 
                ({event.team === 'home' ? match.homeTeam.name : match.awayTeam.name})
                {' - '}
                {event.type === 'goal' && `${event.player?.name} ${event.assistPlayer ? `(${event.assistPlayer.name})` : ''}`}
                {event.type.includes('card') && event.player?.name}
                {event.type === 'substitution' && `${event.playerIn?.name} -> ${event.playerOut?.name}`}
                {event.note && ` [${event.note}]`}
              </span>
              <ButtonGroup>
                <Button variant="secondary" onClick={() => handleEditEvent(event)}>Upravit</Button>
                <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>Smazat</Button>
              </ButtonGroup>
            </EventItem>
          ))}
        </EventsList>
      </Section>
    </PageContainer>
  );
};

export default MatchEditor;
