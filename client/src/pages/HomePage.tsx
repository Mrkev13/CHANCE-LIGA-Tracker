import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowUp } from 'react-icons/fa';
import styled from 'styled-components';
import { fetchMatches, Match } from '../redux/slices/matchesSlice.ts';
import { RootState, AppDispatch } from '../redux/store.ts';
import { theme } from '../styles/theme.ts';
import { getTeamLogo } from '../utils/teamLogos.ts';

const HomeContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }: { theme: any }) => theme.fonts.heading};
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }: { theme: any }) => theme.colors.secondary};
  padding-bottom: 0.5rem;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavButton = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : theme.colors.lightGray};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.small};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.secondary : 'transparent'};

  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.secondary : '#495057'};
    transform: translateY(-2px);
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MatchCard = styled(Link)`
  background-color: ${({ theme }: { theme: any }) => theme.colors.lightGray};
  border-radius: ${({ theme }: { theme: any }) => theme.borderRadius.large};     
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }: { theme: any }) => theme.shadows.medium};
  }
  
  &.live {
    border-left: 4px solid ${({ theme }: { theme: any }) => theme.colors.secondary};
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const MatchContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const TeamSide = styled.div<{ align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    align-items: ${({ align }) => align === 'left' ? 'flex-start' : 'flex-end'};
    text-align: ${({ align }) => align === 'left' ? 'left' : 'right'};
    gap: 0.5rem;
  }
`;

const TeamLogo = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  transition: transform 0.2s;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
  
  ${MatchCard}:hover & {
    transform: scale(1.1);
  }
`;

const TeamName = styled.h2`
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

const VersusScore = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  font-family: 'Monaco', 'Consolas', monospace;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MatchDate = styled.span`
  font-size: 0.85rem;
  color: #adb5bd;
`;

const MatchStatus = styled.span<{ status: string }>`
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  text-transform: uppercase;
  background-color: ${({ status, theme }: { status: string, theme: any }) =>  
    status === 'live' 
      ? theme.colors.secondary 
      : status === 'finished' 
        ? theme.colors.success 
        : status === 'awarded'
          ? theme.colors.secondary
          : status === 'canceled' || status === 'not_played'
            ? theme.colors.danger
            : '#495057'};
  color: white;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }: { theme: any }) => theme.colors.gray};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }: { theme: any }) => theme.colors.danger};
`;

const FilterContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  z-index: 10;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: white;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.small};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    background-color: #495057;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScrollTopButton = styled.button<{ visible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: ${({ visible }) => visible ? 1 : 0};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  transform: ${({ visible }) => visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 0.3s ease;
  z-index: 99;

  &:hover {
    background-color: #a90d27;
    transform: ${({ visible }) => visible ? 'translateY(-5px)' : 'translateY(20px)'};
  }
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
  }
`;

const FilterButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: white;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.small};

  &:hover {
    background-color: #495057;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.2);
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    transition: transform 0.2s;
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: #2c3034;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.large};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 20;
`;

const DropdownItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem 1.25rem;
  background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.secondary : 'transparent'};
  color: white;
  border: none;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.1s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.secondary : '#3d4248'};
  }

  &:focus {
    outline: none;
    background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.secondary : '#3d4248'};
  }
`;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { matches, loading, error } = useSelector(
    (state: RootState) => state.matches
  );
  
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Seskupení podle kola (Livesport styl)
  const { roundsMap, sortedRoundKeys } = useMemo(() => {
    const map: Record<string, Match[]> = {};
    matches.forEach((m: Match) => {
      if (m.round) {
        const key = String(m.round);
        if (!map[key]) map[key] = [];
        map[key].push(m);
      }
    });
    const keys = Object.keys(map).sort((a, b) => Number(b) - Number(a));
    return { roundsMap: map, sortedRoundKeys: keys };
  }, [matches]);
  
  const filteredRoundKeys = useMemo(() => 
    selectedRound === 'all' 
      ? sortedRoundKeys 
      : sortedRoundKeys.filter((key: string) => key === selectedRound),
    [selectedRound, sortedRoundKeys]
  );

  return (
    <HomeContainer>
      <NavContainer>
        <NavButton to="/" $active={true}>Zápasy</NavButton>
        <NavButton to="/table">Tabulka</NavButton>
      </NavContainer>

      {loading && matches.length === 0 ? (
        <LoadingMessage theme={theme}>Načítání zápasů...</LoadingMessage>
      ) : error && matches.length === 0 ? (
        <ErrorMessage theme={theme}>{error}</ErrorMessage>
      ) : (
        <section>
          <ControlsContainer>
            <FilterContainer ref={dropdownRef}>
              <FilterButton 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                isOpen={isDropdownOpen}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                {selectedRound === 'all' ? 'Všechna kola' : `Kolo ${selectedRound}`}
              </FilterButton>
              <DropdownMenu isOpen={isDropdownOpen} role="listbox">
                <DropdownItem 
                  isSelected={selectedRound === 'all'}
                  onClick={() => {
                    setSelectedRound('all');
                    setIsDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedRound === 'all'}
                >
                  Všechna kola
                </DropdownItem>
                {sortedRoundKeys.map((roundKey: string) => (
                  <DropdownItem
                    key={roundKey}
                    isSelected={selectedRound === roundKey}
                    onClick={() => {
                      setSelectedRound(roundKey);
                      setIsDropdownOpen(false);
                    }}
                    role="option"
                    aria-selected={selectedRound === roundKey}
                  >
                    Kolo {roundKey}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </FilterContainer>

            <SearchContainer>
              <SearchIconWrapper>
                <FaSearch />
              </SearchIconWrapper>
              <SearchInput 
                type="text" 
                placeholder="Hledat tým..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </ControlsContainer>

          <SectionTitle>Zápasy podle kola</SectionTitle>
          {filteredRoundKeys.length > 0 ? (
            <div>
              {filteredRoundKeys.map((roundKey: string) => {
                let roundMatches = roundsMap[roundKey]
                  .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                if (searchQuery) {
                  const lowerQuery = searchQuery.toLowerCase();
                  roundMatches = roundMatches.filter((m: Match) => 
                    m.homeTeam.name.toLowerCase().includes(lowerQuery) || 
                    m.awayTeam.name.toLowerCase().includes(lowerQuery)
                  );
                } else if (selectedRound === 'all') {
                  roundMatches = roundMatches.slice(0, 8);
                }

                if (roundMatches.length === 0) return null;

                return (
                  <div key={roundKey} style={{ marginBottom: '1.5rem' }}>
                    {selectedRound === 'all' && <SectionTitle>Kolo {roundKey}</SectionTitle>}
                    <MatchesGrid>
                      {roundMatches.map((match: Match) => (
                        <MatchCard 
                          key={match.id} 
                          to={`/match/${match.id}`}
                          className={match.status === 'live' ? 'live' : ''}
                        >
                          <MatchHeader>
                            <MatchDate>{new Date(match.date).toLocaleTimeString('cs-CZ', {hour: '2-digit', minute: '2-digit'})}</MatchDate>
                            <HeaderRight>
                              <MatchStatus status={match.status}>
                                {match.status === 'live' 
                                  ? 'ŽIVĚ' 
                                  : match.status === 'finished' 
                                    ? 'KONEC' 
                                    : match.status === 'awarded'
                                      ? 'KONTUMACE'
                                      : match.status === 'canceled'
                                        ? 'ZRUŠENO'
                                        : match.status === 'not_played'
                                          ? 'NEODEHRÁNO'
                                          : 'NAPLÁNOVÁNO'}
                              </MatchStatus>
                            </HeaderRight>
                          </MatchHeader>
                          
                          <MatchContent>
                            <TeamSide align="left">
                              <TeamLogo src={getTeamLogo(match.homeTeam.name, match.homeTeam.logo)} alt={match.homeTeam.name} />
                              <TeamName>{match.homeTeam.name}</TeamName>
                            </TeamSide>
                            
                            <ScoreSection>
                              <VersusScore>
                                {match.status === 'scheduled' || match.status === 'canceled' || match.status === 'not_played' 
                                  ? '-:-' 
                                  : `${match.score.home}:${match.score.away}`}
                              </VersusScore>
                            </ScoreSection>
                            
                            <TeamSide align="right">
                              <TeamLogo src={getTeamLogo(match.awayTeam.name, match.awayTeam.logo)} alt={match.awayTeam.name} />
                              <TeamName>{match.awayTeam.name}</TeamName>
                            </TeamSide>
                          </MatchContent>

                          {match.stadium || match.competition?.name ? (
                            <MatchDate style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              {match.stadium ? `Stadion: ${match.stadium}` : ''}
                              {match.competition?.name ? `${match.stadium ? ' • ' : ''}${match.competition.name}` : ''}
                            </MatchDate>
                          ) : null}
                        </MatchCard>
                      ))}
                    </MatchesGrid>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Žádná data o kolech nejsou k dispozici.</p>
          )}
        </section>
      )}
      <ScrollTopButton 
        visible={showScrollTop} 
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </ScrollTopButton>
    </HomeContainer>
  );
};

export default HomePage;
