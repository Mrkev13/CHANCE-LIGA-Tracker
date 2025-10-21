// Minimal stubbed table controller with mock data

const table = [
  {
    id: '1',
    position: 1,
    team: { id: '1', name: 'Sparta Praha', logo: '/logos/sparta.png' },
    played: 10,
    won: 8,
    drawn: 1,
    lost: 1,
    goalsFor: 24,
    goalsAgainst: 8,
    goalDifference: 16,
    points: 25,
    form: ['W', 'W', 'W', 'D', 'W']
  },
  {
    id: '2',
    position: 2,
    team: { id: '2', name: 'Slavia Praha', logo: '/logos/slavia.png' },
    played: 10,
    won: 7,
    drawn: 2,
    lost: 1,
    goalsFor: 22,
    goalsAgainst: 7,
    goalDifference: 15,
    points: 23,
    form: ['W', 'W', 'D', 'W', 'D']
  },
  {
    id: '3',
    position: 3,
    team: { id: '3', name: 'Viktoria Plzeň', logo: '/logos/plzen.png' },
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goalsFor: 18,
    goalsAgainst: 10,
    goalDifference: 8,
    points: 20,
    form: ['W', 'L', 'W', 'W', 'D']
  }
];

exports.getTable = async (req, res) => {
  res.json(table);
};

exports.getHomeTable = async (req, res) => {
  res.json(table);
};

exports.getAwayTable = async (req, res) => {
  res.json(table);
};