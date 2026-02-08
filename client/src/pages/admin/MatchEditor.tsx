import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../redux/store';
import { updateMatchEvents, updateMatchScore, saveMatch } from '../../redux/slices/matchesSlice';
import { selectAllPlayerNames } from '../../redux/statsSelectors';
import { TEAM_BY_ID } from '../../redux/teamData';
import Navigation from '../../components/Navigation';

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

// Helper to recalculate score from events
const calculateScoreFromEvents = (events: any[]) => {
  let home = 0;
  let away = 0;
  events.forEach(e => {
    if (e.type === 'goal') {
      if (e.team === 'home') home++;
      else away++;
    }
  });
  return { home, away };
};

const MatchEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const match = useSelector((state: RootState) => 
    state.matches.matches.find(m => m.id === id)
  );
  
  // Get all matches to gather historical player data
  const allMatches = useSelector((state: RootState) => state.matches.matches);
  const allPlayerNames = useSelector(selectAllPlayerNames);

  // Get full team data including players from static file
  const homeTeamData = match ? TEAM_BY_ID[match.homeTeam.id] : null;
  const awayTeamData = match ? TEAM_BY_ID[match.awayTeam.id] : null;

  const [eventType, setEventType] = useState<'goal' | 'card' | 'substitution'>('goal');
  // Subtype for goal tab
  const [goalType, setGoalType] = useState<'goal' | 'goal_disallowed' | 'missed_penalty'>('goal');
  const [isInjury, setIsInjury] = useState(false);

  // Helper for formatting player name: "David Douděra" -> "Douděra D."
  const formatPlayerName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length < 2) return fullName;
    const surname = parts.slice(1).join(' ');
    const firstname = parts[0];
    return `${surname} ${firstname.charAt(0)}.`;
  };

  const NOTE_OPTIONS = [
    'gól', 'penalta', 'neuznaný gól', 'faul', 'ofsajd', 'ruka', 
    'žlutá karta', 'podražení', 'držení', 'nafilmování/pád', 
    'nesportovní chování', 'hrubost', 'STOP na další zápas'
  ];
  
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
  const [status, setStatus] = useState<'scheduled' | 'live' | 'finished' | 'awarded' | 'canceled' | 'not_played'>('scheduled');

  useEffect(() => {
    if (match) {
      setHomeScore(match.score.home);
      setAwayScore(match.score.away);
      setStatus(match.status);
    }
  }, [match]);

  if (!match) return <PageContainer>Zápas nenalezen</PageContainer>;
  
  const handleBack = () => {
    navigate('/admin');
  };

  const handleUpdateMatchInfo = async () => {
    const newScore = { home: homeScore, away: awayScore };
    
    // Optimistic Update
    dispatch(updateMatchScore({
      matchId: match.id,
      score: newScore
    }));
    
    // Save to Server
    try {
      await dispatch(saveMatch({ ...match, score: newScore, status: status })).unwrap();
      alert('Informace o zápasu uloženy na server');
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
    } else if (event.type === 'goal' || event.type === 'goal_disallowed' || event.type === 'missed_penalty') {
      setEventType('goal');
      setGoalType(event.type);
    } else {
      setEventType(event.type);
    }
    
    setNote(event.note || '');
    
    if (event.type === 'goal' || event.type === 'goal_disallowed' || event.type === 'missed_penalty') {
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

  const resetForm = (keepType = false) => {
    setEditingEventId(null);
    setMinute('');
    setPlayer('');
    setAssist('');
    setPlayerIn('');
    setPlayerOut('');
    setNote('');
    setIsInjury(false);
    
    if (!keepType) {
      setEventType('goal');
      setGoalType('goal');
      setCardType('yellow_card');
    }
  };

  const handleCancelEdit = () => {
    resetForm(false);
  };

  const validateEvent = () => {
    // Regex for minute: allows simple numbers (1-120) or added time format (45+2, 90+4)
    const minuteRegex = /^([1-9][0-9]?|1[0-1][0-9]|120)(\+[0-9]+)?$/;
    if (!minute || !minuteRegex.test(minute)) return 'Minuta musí být číslo (např. 45) nebo nastavený čas (např. 90+2)';
    
    if (eventType === 'goal' && !player) return 'Musíte zadat hráče (střelce/aktéra)';
    if (eventType === 'card' && !player) return 'Musíte zadat hráče';
    if (eventType === 'substitution' && (!playerIn || !playerOut)) return 'Musíte zadat oba hráče';

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
      minute: minute, // Keep as string to support 90+1
      team,
      note
    };

    if (eventType === 'goal') {
      newEvent.type = goalType;
      newEvent.player = { id: `p_${Math.random()}`, name: player };
      if (assist && goalType === 'goal') newEvent.assistPlayer = { id: `p_${Math.random()}`, name: assist };
    } else if (eventType === 'card') {
      newEvent.type = cardType;
      newEvent.player = { id: `p_${Math.random()}`, name: player };
    } else if (eventType === 'substitution') {
      newEvent.type = 'substitution';
      newEvent.playerIn = { id: `p_${Math.random()}`, name: playerIn };
      newEvent.playerOut = { id: `p_${Math.random()}`, name: playerOut };
    }

    let updatedEvents;
    
    // Helper for sorting events with 90+1 support
    const sortEvents = (a: any, b: any) => {
       const minA = parseInt(a.minute);
       const minB = parseInt(b.minute);
       if (minA !== minB) return minA - minB;
       const isPlusA = a.minute.toString().includes('+');
       const isPlusB = b.minute.toString().includes('+');
       if (isPlusA && !isPlusB) return 1;
       if (!isPlusA && isPlusB) return -1;
       if (isPlusA && isPlusB) {
         const extraA = parseInt(a.minute.split('+')[1] || '0');
         const extraB = parseInt(b.minute.split('+')[1] || '0');
         return extraA - extraB;
       }
       return 0;
    };

    if (editingEventId) {
      newEvent.id = editingEventId;
      updatedEvents = match.events.map(e => e.id === editingEventId ? { ...e, ...newEvent } : e).sort(sortEvents);
    } else {
      newEvent.id = Math.random().toString(36).substr(2, 9);
      updatedEvents = [...match.events, newEvent].sort(sortEvents);
    }
    
    dispatch(updateMatchEvents({ matchId: match.id, events: updatedEvents }));
    
    // Auto-update status to live if scheduled
    let newStatus = status;
    if (status === 'scheduled') {
        newStatus = 'live';
        setStatus('live');
    }
    
    // Recalculate score from updated events
    const newScore = calculateScoreFromEvents(updatedEvents);
    setHomeScore(newScore.home);
    setAwayScore(newScore.away);
    
    const updatedMatch = { ...match, events: updatedEvents, score: newScore, status: newStatus };
    
    try {
      await dispatch(saveMatch(updatedMatch)).unwrap();
      // If we were editing, reset completely (to default goal tab). 
      // If we were adding, keep the current event type for rapid entry (e.g. multiple cards).
      resetForm(!editingEventId); 
    } catch (err) {
      alert('Chyba: Nepodařilo se uložit na server.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Opravdu smazat tuto událost?')) {
      const updatedEvents = match.events.filter(e => e.id !== eventId);
      
      dispatch(updateMatchEvents({ matchId: match.id, events: updatedEvents }));
      
      // Recalculate score
      const newScore = calculateScoreFromEvents(updatedEvents);
      setHomeScore(newScore.home);
      setAwayScore(newScore.away);
      
      const updatedMatch = { ...match, events: updatedEvents, score: newScore };
      try {
        await dispatch(saveMatch(updatedMatch)).unwrap();
      } catch (err) {
        alert('Chyba při ukládání na server');
      }
    }
  };

  const availablePlayers = team === 'home' 
    ? (homeTeamData?.players || []) 
    : (awayTeamData?.players || []);

  // Merge static players with those already in stats (if any missing) - simple version just uses static if exists
  // If static list is empty (teams not seeded), fallback to all known names filtered roughly? 
  // For now, we prioritize the static list as requested.
  
  return (
    <PageContainer>
      <Navigation />
      <datalist id="player-names">
        {(() => {
          // Deduplication logic:
          // 1. Static players take precedence.
          // 2. Dynamic players are added only if their FORMATTED name is not in static.
          // 3. Dynamic players are deduplicated by formatted name.

          const staticNames = new Set(availablePlayers.map(p => formatPlayerName(p.name)));
          
          const renderedStatic = availablePlayers.map(p => (
            <option key={`static-${p.id}`} value={formatPlayerName(p.name)}>{p.position ? `(${p.position})` : ''}</option>
          ));

          const dynamicOptions = allPlayerNames
            .map(name => ({ raw: name, formatted: formatPlayerName(name) }))
            .filter(item => !staticNames.has(item.formatted))
            .filter((item, index, self) => 
              index === self.findIndex(t => t.formatted === item.formatted)
            )
            .map((item) => (
              <option key={`dynamic-${item.raw}`} value={item.formatted} />
            ));

          return [...renderedStatic, ...dynamicOptions];
        })()}
      </datalist>
      <Header>
        <Button onClick={handleBack} variant="secondary">← Zpět na přehled</Button>
        <SectionTitle>Editace zápasu: {match.homeTeam.name} vs {match.awayTeam.name}</SectionTitle>
      </Header>

      <Section>
        <SectionTitle>Základní informace</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <FormGroup>
            <Label>Stav</Label>
            <Select value={status} onChange={(e: any) => setStatus(e.target.value)}>
              <option value="scheduled">Naplánováno</option>
              <option value="live">Živě</option>
              <option value="finished">Konec</option>
              <option value="awarded">Kontumace</option>
              <option value="canceled">Zrušeno</option>
              <option value="not_played">Neodehráno</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>{match.homeTeam.name}</Label>
            <Input 
              type="number" 
              value={homeScore} 
              onChange={(e) => setHomeScore(Number(e.target.value))} 
              style={{ width: '60px', textAlign: 'center' }}
            />
          </FormGroup>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>:</span>
          <FormGroup>
            <Label>{match.awayTeam.name}</Label>
            <Input 
              type="number" 
              value={awayScore} 
              onChange={(e) => setAwayScore(Number(e.target.value))} 
              style={{ width: '60px', textAlign: 'center' }}
            />
          </FormGroup>
          <Button onClick={handleUpdateMatchInfo}>Uložit Změny</Button>
        </div>
      </Section>

      <Section>
        <SectionTitle>{editingEventId ? 'Upravit Událost' : 'Přidat Událost'}</SectionTitle>
        <Tabs>
          <Tab active={eventType === 'goal'} onClick={() => setEventType('goal')}>Gól</Tab>
          <Tab active={eventType === 'card'} onClick={() => setEventType('card')}>Karta</Tab>
          <Tab active={eventType === 'substitution'} onClick={() => setEventType('substitution')}>Střídání</Tab>
        </Tabs>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormGroup>
            <Label>Minuta</Label>
            <Input type="text" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="např. 45 nebo 90+2" />
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
              <Label>Typ události</Label>
              <Select value={goalType} onChange={(e: any) => setGoalType(e.target.value)}>
                <option value="goal">Gól</option>
                <option value="goal_disallowed">Neuznaný gól</option>
                <option value="missed_penalty">Neproměněná penalta</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>{goalType === 'missed_penalty' ? 'Exekutor' : 'Střelec'}</Label>
              <Input list="player-names" value={player} onChange={(e) => setPlayer(e.target.value)} placeholder={goalType === 'missed_penalty' ? 'Jméno hráče' : 'Jméno střelce'} />
            </FormGroup>
            {goalType === 'goal' && (
              <FormGroup>
                <Label>Asistence (nepovinné)</Label>
                <Input list="player-names" value={assist} onChange={(e) => setAssist(e.target.value)} placeholder="Jméno asistenta" />
              </FormGroup>
            )}
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
              <Input list="player-names" value={player} onChange={(e) => setPlayer(e.target.value)} placeholder="Hříšník" />
            </FormGroup>
          </>
        )}

        {eventType === 'substitution' && (
          <>
            <FormGroup>
              <Label>Hráč DOVNITŘ</Label>
              <Input list="player-names" value={playerIn} onChange={(e) => setPlayerIn(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Hráč VEN</Label>
              <Input list="player-names" value={playerOut} onChange={(e) => setPlayerOut(e.target.value)} />
            </FormGroup>
            <FormGroup>
               <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                 <input 
                   type="checkbox" 
                   checked={isInjury} 
                   onChange={(e) => {
                     setIsInjury(e.target.checked);
                     if (e.target.checked) {
                        setNote(prev => prev ? `${prev}, střídání – zranění` : 'střídání – zranění');
                     }
                   }} 
                 />
                 Zranění
               </label>
            </FormGroup>
          </>
        )}

        <FormGroup style={{ position: 'relative' }}>
          <Label>Poznámka</Label>
          <Input 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Např. z penalty, hrubost..." 
            autoComplete="off"
          />
          {(() => {
             const segments = note.split(/,\s*/);
             const lastSegment = segments[segments.length - 1];
             if (!lastSegment || lastSegment.length < 1) return null;
             
             // Diacritic sensitive/insensitive? "citlivý na diakritiku" means sensitive.
             // But usually users want insensitive search (typing "zluta" finds "žlutá").
             // "Zajisti, že našeptávač je citlivý na diakritiku" -> strictly means sensitive.
             // But usually "citlivý" means "handles it correctly".
             // If I type "zluta", should it find "žlutá"? Usually yes.
             // If I type "č", should it find "červená"? Yes.
             // If I type "c", should it find "červená"? Usually yes.
             // But strictly "citlivý" (sensitive) means 'c' != 'č'.
             // Given the context of "inteligentní", I assume they want it to WORK well.
             // I'll stick to strict startswith for now to be safe with "citlivý".
             
             const matches = NOTE_OPTIONS.filter(opt => 
               opt.toLowerCase().startsWith(lastSegment.toLowerCase()) && 
               opt.toLowerCase() !== lastSegment.toLowerCase()
             );
             
             if (matches.length === 0) return null;

             return (
               <div style={{
                 position: 'absolute',
                 top: '100%',
                 left: 0,
                 right: 0,
                 backgroundColor: '#222',
                 border: '1px solid #444',
                 zIndex: 1000,
                 maxHeight: '150px',
                 overflowY: 'auto',
                 borderRadius: '4px',
                 boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
               }}>
                 {matches.map(match => (
                   <div 
                     key={match}
                     style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #333', color: '#fff' }}
                     onClick={() => {
                       const newSegments = [...segments];
                       newSegments.pop();
                       newSegments.push(match);
                       setNote(newSegments.join(', ') + ', ');
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                   >
                     {match}
                   </div>
                 ))}
               </div>
             );
          })()}
        </FormGroup>

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
