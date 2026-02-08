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
    } else if (e.type === 'own_goal') {
      if (e.team === 'home') away++;
      else home++;
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
  const [goalType, setGoalType] = useState<'goal' | 'goal_disallowed' | 'missed_penalty' | 'own_goal'>('goal');
  const [isInjury, setIsInjury] = useState(false);

  // Helper for formatting player name: "David Douděra" -> "Douděra D."
  const formatPlayerName = (fullName: string) => {
    if (!fullName) return '';
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/);
    
    if (parts.length < 2) return trimmed;

    // Check if already in "Surname F." format (last part is single letter with dot)
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 2 && lastPart.endsWith('.')) {
      return trimmed;
    }

    const surname = parts.slice(1).join(' ');
    const firstname = parts[0];
    return `${surname} ${firstname.charAt(0)}.`;
  };

  const NOTE_OPTIONS = [
    'Gól', 'Penalta', 'Neuznaný gól', 'Faul', 'Ofsajd', 'Ruka', 
    'Žlutá karta', 'Podražení', 'Držení', 'Nafilmovaný pád', 
    'Nesportovní chování', 'Hrubost', 'STOP na další zápas', 'Zdržování hry',
    'Mimo hřiště', 'Neproměněná penalta'
  ];
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Form State
  const [minute, setMinute] = useState('');
  const [team, setTeam] = useState<'home' | 'away'>('home');
  const [player, setPlayer] = useState('');
  const [assist, setAssist] = useState('');
  const [playerIn, setPlayerIn] = useState('');
  const [playerOut, setPlayerOut] = useState('');
  const [cardType, setCardType] = useState<'yellow_card' | 'red_card' | 'second_yellow'>('yellow_card');
  const [note, setNote] = useState('');
  
  const minuteInputRef = React.useRef<HTMLInputElement>(null);
  
  const [noteHighlightIndex, setNoteHighlightIndex] = useState(0);
  
  // Derived state for note autocomplete
  const noteSegments = note.split(/,\s*/);
  const lastNoteSegment = noteSegments[noteSegments.length - 1];
  const showNoteAutocomplete = lastNoteSegment && lastNoteSegment.length >= 1;
  
  const noteMatches = showNoteAutocomplete ? NOTE_OPTIONS.filter(opt => 
     opt.toLowerCase().startsWith(lastNoteSegment.toLowerCase()) && 
     opt.toLowerCase() !== lastNoteSegment.toLowerCase()
  ) : [];

  // Reset highlight when options change
  useEffect(() => {
    setNoteHighlightIndex(0);
  }, [lastNoteSegment]);

  const selectNoteOption = (option: string) => {
    const newSegments = [...noteSegments];
    newSegments.pop();
    newSegments.push(option);
    setNote(newSegments.join(', '));
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent) => {
    if (noteMatches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setNoteHighlightIndex(prev => (prev + 1) % noteMatches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setNoteHighlightIndex(prev => (prev - 1 + noteMatches.length) % noteMatches.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (noteMatches.length > 0) {
        e.preventDefault();
        selectNoteOption(noteMatches[noteHighlightIndex]);
      }
    } else if (e.key === 'Escape') {
      // Optional: Logic to close autocomplete if needed, though typing clears it usually
    }
  };

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
    setMinute(event.minute?.toString() || '');
    setTeam(event.team);
    
    // Handle card types which are subtypes of 'card' in UI logic but distinct types in data
    if (event.type === 'yellow_card' || event.type === 'red_card') {
      setEventType('card');
      if (event.type === 'red_card' && event.note && event.note.includes('2. ŽK')) {
        setCardType('second_yellow');
      } else {
        setCardType(event.type as any);
      }
    } else if (event.type === 'goal' || event.type === 'goal_disallowed' || event.type === 'missed_penalty' || event.type === 'own_goal') {
      setEventType('goal');
      setGoalType(event.type);
    } else {
      setEventType(event.type);
    }
    
    setNote(event.note || '');
    
    if (event.type === 'goal' || event.type === 'goal_disallowed' || event.type === 'missed_penalty' || event.type === 'own_goal') {
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
    
    // Focus minute input
    setTimeout(() => {
      minuteInputRef.current?.focus();
    }, 100); // Slight delay for scroll
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

    // Focus minute input after reset
    setTimeout(() => {
      minuteInputRef.current?.focus();
    }, 0);
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
      if (cardType === 'second_yellow' && yellows === 0) return 'Tento hráč zatím nemá žádnou žlutou kartu';
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
      if (cardType === 'second_yellow') {
        newEvent.type = 'red_card';
        if (!note.includes('2. ŽK')) {
             newEvent.note = note ? `${note}, 2. ŽK` : '2. ŽK';
        }
      } else {
        newEvent.type = cardType;
      }
      newEvent.player = { id: `p_${Math.random()}`, name: player };
    } else if (eventType === 'substitution') {
      newEvent.type = 'substitution';
      newEvent.playerIn = { id: `p_${Math.random()}`, name: playerIn };
      newEvent.playerOut = { id: `p_${Math.random()}`, name: playerOut };
    }

    let updatedEvents;
    
    // Helper for sorting events with 90+1 support
    const sortEvents = (a: any, b: any) => {
       const minA = parseInt(a.minute || '0');
       const minB = parseInt(b.minute || '0');
       if (minA !== minB) return minA - minB;
       const isPlusA = (a.minute || '').toString().includes('+');
       const isPlusB = (b.minute || '').toString().includes('+');
       if (isPlusA && !isPlusB) return 1;
       if (!isPlusA && isPlusB) return -1;
       if (isPlusA && isPlusB) {
         const extraA = parseInt((a.minute || '').toString().split('+')[1] || '0');
         const extraB = parseInt((b.minute || '').toString().split('+')[1] || '0');
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
          
          const renderedStatic = availablePlayers.map(p => {
            const formatted = formatPlayerName(p.name);
            const normalized = formatted.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const label = p.position ? `(${p.position})` : '';
            return (
              <option key={`static-${p.id}`} value={formatted}>
                {label} {normalized !== formatted ? normalized : ''}
              </option>
            );
          });

          const dynamicOptions = allPlayerNames
            .map(name => ({ raw: name, formatted: formatPlayerName(name) }))
            .filter(item => !staticNames.has(item.formatted))
            .filter((item, index, self) => 
              index === self.findIndex(t => t.formatted === item.formatted)
            )
            .map((item) => {
              const normalized = item.formatted.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return (
                <option key={`dynamic-${item.raw}`} value={item.formatted}>
                   {normalized !== item.formatted ? normalized : ''}
                </option>
              );
            });

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
            <Input 
              ref={minuteInputRef}
              type="text" 
              value={minute} 
              onChange={(e) => setMinute(e.target.value)} 
              placeholder="např. 45 nebo 90+2" 
            />
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
                <option value="own_goal">Vlastní gól</option>
                <option value="goal_disallowed">Neuznaný gól</option>
                <option value="missed_penalty">Neproměněná penalta</option>
              </Select>
            </FormGroup>
            {goalType === 'own_goal' && (
              <div style={{ padding: '0.5rem', marginBottom: '1rem', background: '#333', borderLeft: '3px solid #ffa500', color: '#ccc', fontSize: '0.9rem' }}>
                Pozor: Vyberte <strong>TÝM, KTERÝ SI DAL VLASTNÍ GÓL</strong> (tedy tým hráče), nikoliv tým, který skóroval.
              </div>
            )}
            <FormGroup>
              <Label>{goalType === 'missed_penalty' ? 'Exekutor' : goalType === 'own_goal' ? 'Nešťastník' : 'Střelec'}</Label>
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
                <option value="second_yellow">Druhá žlutá (ČK)</option>
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
            onKeyDown={handleNoteKeyDown}
            placeholder="Např. z penalty, hrubost..." 
            autoComplete="off"
          />
          {noteMatches.length > 0 && (
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
              {noteMatches.map((match, index) => (
                <div 
                  key={match}
                  style={{ 
                    padding: '0.75rem', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid #333', 
                    color: '#fff',
                    backgroundColor: index === noteHighlightIndex ? '#444' : 'transparent'
                  }}
                  onClick={() => selectNoteOption(match)}
                  onMouseEnter={() => setNoteHighlightIndex(index)}
                >
                  {match}
                </div>
              ))}
            </div>
          )}
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
                <strong>{event.minute}'</strong> - {(() => {
                  if (event.type === 'commentary') return 'Komentář';
                  if (event.type === 'goal') return 'Gól';
                  if (event.type === 'own_goal') return 'Vlastní gól';
                  if (event.type === 'yellow_card') return 'Žlutá karta';
                  if (event.type === 'red_card') {
                    if (event.note && event.note.includes('2. ŽK')) return '2. Žlutá karta (ČK)';
                    return 'Červená karta';
                  }
                  if (event.type === 'substitution') return 'Střídání';
                  if (event.type === 'goal_disallowed') return 'Neuznaný gól';
                  if (event.type === 'missed_penalty') return 'Neproměněná penalta';
                  return event.type;
                })()} 
                ({event.team === 'home' ? match.homeTeam.name : match.awayTeam.name})
                {' - '}
                {event.type === 'goal' && `${event.player?.name} ${event.assistPlayer ? `(${event.assistPlayer.name})` : ''}`}
                {event.type === 'own_goal' && `${event.player?.name} (vlastní)`}
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
