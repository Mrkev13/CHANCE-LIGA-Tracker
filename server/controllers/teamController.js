// Minimal stubbed team controller with mock data

const teams = [
  {
    id: '1',
    name: 'Sparta Praha',
    logo: '/logos/sparta.png',
    stadium: 'Letná',
    foundedYear: 1893,
    coach: 'Lars Friis',
    description: 'AC Sparta Praha je český fotbalový klub, jeden z nejúspěšnějších.'
  },
  {
    id: '2',
    name: 'Slavia Praha',
    logo: '/logos/slavia.png',
    stadium: 'Eden Aréna',
    foundedYear: 1892,
    coach: 'Jindřich Trpišovský',
    description: 'SK Slavia Praha patří mezi nejstarší české kluby.'
  },
  {
    id: '3',
    name: 'Viktoria Plzeň',
    logo: '/logos/plzen.png',
    stadium: 'Doosan Arena',
    foundedYear: 1911,
    coach: 'Miroslav Koubek',
    description: 'FC Viktoria Plzeň je úspěšný klub posledních let.'
  }
];

const matches = [
  {
    id: '101',
    homeTeam: { id: '1', name: 'Sparta Praha', logo: '/logos/sparta.png' },
    awayTeam: { id: '2', name: 'Slavia Praha', logo: '/logos/slavia.png' },
    score: { home: 2, away: 1 },
    status: 'live',
    date: new Date().toISOString(),
    stadium: 'Letná',
    events: []
  },
  {
    id: '102',
    homeTeam: { id: '3', name: 'Viktoria Plzeň', logo: '/logos/plzen.png' },
    awayTeam: { id: '1', name: 'Sparta Praha', logo: '/logos/sparta.png' },
    score: { home: 0, away: 0 },
    status: 'scheduled',
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    stadium: 'Doosan Arena',
    events: []
  }
];

exports.getAllTeams = async (req, res) => {
  res.json(teams);
};

exports.getTeamById = async (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ message: 'Tým nenalezen' });
  res.json(team);
};

exports.getTeamMatches = async (req, res) => {
  const { id } = req.params;
  const teamMatches = matches.filter(m => m.homeTeam.id === id || m.awayTeam.id === id);
  res.json(teamMatches);
};