// Minimal stubbed match controller with mock data

const matches = [
  {
    id: '101',
    homeTeam: { id: '1', name: 'Sparta Praha', logo: '/logos/sparta.png' },
    awayTeam: { id: '2', name: 'Slavia Praha', logo: '/logos/slavia.png' },
    score: { home: 2, away: 1 },
    status: 'live',
    date: new Date().toISOString(),
    stadium: 'Letná',
    events: [
      {
        id: 'e1',
        type: 'goal',
        minute: 12,
        team: 'home',
        player: { id: '1', name: 'Jan Kuchta' },
        assistPlayer: { id: '2', name: 'Lukáš Provod' }
      }
    ]
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
  },
  {
    id: '103',
    homeTeam: { id: '2', name: 'Slavia Praha', logo: '/logos/slavia.png' },
    awayTeam: { id: '3', name: 'Viktoria Plzeň', logo: '/logos/plzen.png' },
    score: { home: 3, away: 2 },
    status: 'finished',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    stadium: 'Eden Aréna',
    events: []
  }
];

exports.getAllMatches = async (req, res) => {
  res.json(matches);
};

exports.getLiveMatches = async (req, res) => {
  res.json(matches.filter(m => m.status === 'live'));
};

exports.getMatchById = async (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ message: 'Zápas nenalezen' });
  res.json(match);
};