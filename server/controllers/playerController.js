// Minimal stubbed player controller with mock data

const players = [
  {
    id: '1',
    name: 'Jan Kuchta',
    teamId: '1',
    teamName: 'Sparta Praha',
    position: 'Útočník',
    number: 9,
    age: 27,
    nationality: 'Česká republika',
    photo: '/players/kuchta.png',
    stats: { goals: 8, assists: 3, yellowCards: 2, redCards: 0, minutesPlayed: 720 }
  },
  {
    id: '2',
    name: 'Lukáš Provod',
    teamId: '2',
    teamName: 'Slavia Praha',
    position: 'Záložník',
    number: 10,
    age: 27,
    nationality: 'Česká republika',
    photo: '/players/provod.png',
    stats: { goals: 4, assists: 6, yellowCards: 1, redCards: 0, minutesPlayed: 810 }
  },
  {
    id: '3',
    name: 'Pavel Šulc',
    teamId: '3',
    teamName: 'Viktoria Plzeň',
    position: 'Záložník',
    number: 8,
    age: 23,
    nationality: 'Česká republika',
    photo: '/players/sulc.png',
    stats: { goals: 7, assists: 4, yellowCards: 3, redCards: 0, minutesPlayed: 900 }
  }
];

exports.getAllPlayers = async (req, res) => {
  res.json(players);
};

exports.getPlayerById = async (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) return res.status(404).json({ message: 'Hráč nenalezen' });
  res.json(player);
};

exports.getPlayersByTeam = async (req, res) => {
  const { teamId } = req.params;
  const teamPlayers = players.filter(p => p.teamId === teamId);
  res.json(teamPlayers);
};

exports.getTopScorers = async (req, res) => {
  const sorted = [...players].sort((a, b) => b.stats.goals - a.stats.goals);
  res.json(sorted);
};