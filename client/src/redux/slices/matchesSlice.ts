import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  score: {
    home: number;
    away: number;
  };
  status: 'scheduled' | 'live' | 'finished' | 'awarded' | 'canceled' | 'not_played';
  date: string;
  stadium: string;
  competition?: { id: string; name: string };
  round?: string;
  events: Array<{
    id: string;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
    minute: number;
    team: 'home' | 'away';
    player: {
      id: string;
      name: string;
    };
    assistPlayer?: {
      id: string;
      name: string;
    };
    note?: string;
  }>;
}

interface MatchesState {
  matches: Match[];
  liveMatches: Match[];
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  liveMatches: [],
  currentMatch: null,
  loading: false,
  error: null
};

export const MANUAL_MATCHES: Match[] = [

  {
    id: '2025-07-18-01',
    homeTeam: { id: 't_par', name: 'FK Pardubice', logo: '' },
    awayTeam: { id: 't_plz', name: 'FC Viktoria Plzeň', logo: '' },
    score: { home: 1, away: 5 },
    status: 'finished',
    date: '2025-07-18T15:00:00Z',
    stadium: 'CFIG Aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-19-01',
    homeTeam: { id: 't_tep', name: 'FK Teplice', logo: '' },
    awayTeam: { id: 't_zli', name: 'FC Zlín', logo: '' },
    score: { home: 1, away: 3 },
    status: 'finished',
    date: '2025-07-19T13:00:00Z',
    stadium: 'Stadion Na Stínadlech',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-19-02',
    homeTeam: { id: 't_boh', name: 'Bohemians Praha 1905', logo: '' },
    awayTeam: { id: 't_ban', name: 'FC Baník Ostrava', logo: '' },
    score: { home: 1, away: 0 },
    status: 'finished',
    date: '2025-07-19T15:00:00Z',
    stadium: 'Ďolíček',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-19-03',
    homeTeam: { id: 't_kar', name: 'MFK Karviná', logo: '' },
    awayTeam: { id: 't_duk', name: 'Dukla Praha', logo: '' },
    score: { home: 2, away: 0 },
    status: 'finished',
    date: '2025-07-19T17:30:00Z',
    stadium: 'Městský stadion Karviná',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-19-04',
    homeTeam: { id: 't_jab', name: 'FK Jablonec', logo: '' },
    awayTeam: { id: 't_spa', name: 'Sparta Praha', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-07-19T19:00:00Z',
    stadium: 'Stadion Střelnice',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-20-01',
    homeTeam: { id: 't_slo', name: '1. FC Slovácko', logo: '' },
    awayTeam: { id: 't_olo', name: 'SK Sigma Olomouc', logo: '' },
    score: { home: 0, away: 1 },
    status: 'finished',
    date: '2025-07-20T13:00:00Z',
    stadium: 'Městský stadion Miroslava Valenty',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-20-02',
    homeTeam: { id: 't_mbo', name: 'FK Mladá Boleslav', logo: '' },
    awayTeam: { id: 't_lib', name: 'Slovan Liberec', logo: '' },
    score: { home: 3, away: 3 },
    status: 'finished',
    date: '2025-07-20T15:00:00Z',
    stadium: 'Městský stadion Mladá Boleslav',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },
  {
    id: '2025-07-20-03',
    homeTeam: { id: 't_sla', name: 'Slavia Praha', logo: '' },
    awayTeam: { id: 't_hrk', name: 'Hradec Králové', logo: '' },
    score: { home: 2, away: 2 },
    status: 'finished',
    date: '2025-07-20T17:30:00Z',
    stadium: 'Eden Aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '1',
    events: []
  },

  {
    id: '2025-07-26-01',
    homeTeam: { id: 't_zli', name: 'FC Zlín', logo: '' },
    awayTeam: { id: 't_slo', name: '1. FC Slovácko', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-07-26T13:00:00Z',
    stadium: 'Stadion Letná Zlín',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-26-02',
    homeTeam: { id: 't_olo', name: 'SK Sigma Olomouc', logo: '' },
    awayTeam: { id: 't_duk', name: 'Dukla Praha', logo: '' },
    score: { home: 0, away: 0 },
    status: 'finished',
    date: '2025-07-26T13:00:00Z',
    stadium: 'Andrův stadion',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-26-03',
    homeTeam: { id: 't_hrk', name: 'Hradec Králové', logo: '' },
    awayTeam: { id: 't_kar', name: 'MFK Karviná', logo: '' },
    score: { home: 1, away: 2 },
    status: 'finished',
    date: '2025-07-26T15:00:00Z',
    stadium: 'Malšovická aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-26-04',
    homeTeam: { id: 't_plz', name: 'FC Viktoria Plzeň', logo: '' },
    awayTeam: { id: 't_jab', name: 'FK Jablonec', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-07-26T17:30:00Z',
    stadium: 'Doosan Arena',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-26-05',
    homeTeam: { id: 't_boh', name: 'Bohemians Praha 1905', logo: '' },
    awayTeam: { id: 't_sla', name: 'Slavia Praha', logo: '' },
    score: { home: 0, away: 2 },
    status: 'finished',
    date: '2025-07-26T19:00:00Z',
    stadium: 'Ďolíček',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-27-04',
    homeTeam: { id: 't_lib', name: 'Slovan Liberec', logo: '' },
    awayTeam: { id: 't_par', name: 'FK Pardubice', logo: '' },
    score: { home: 2, away: 1 },
    status: 'finished',
    date: '2025-07-27T13:00:00Z',
    stadium: 'Stadion U Nisy',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-27-05',
    homeTeam: { id: 't_ban', name: 'Baník Ostrava', logo: '' },
    awayTeam: { id: 't_tep', name: 'FK Teplice', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-07-27T15:00:00Z',
    stadium: 'Městský stadion Vítkovice',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },
  {
    id: '2025-07-27-06',
    homeTeam: { id: 't_spa', name: 'Sparta Praha', logo: '' },
    awayTeam: { id: 't_mbo', name: 'FK Mladá Boleslav', logo: '' },
    score: { home: 3, away: 2 },
    status: 'finished',
    date: '2025-07-27T17:30:00Z',
    stadium: 'Letná',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '2',
    events: []
  },

  {
    id: '2025-08-02-04',
    homeTeam: { id: 't_jab', name: 'FK Jablonec', logo: '' },
    awayTeam: { id: 't_hrk', name: 'Hradec Králové', logo: '' },
    score: { home: 2, away: 0 },
    status: 'finished',
    date: '2025-08-02T13:00:00Z',
    stadium: 'Stadion Střelnice',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-02-05',
    homeTeam: { id: 't_kar', name: 'MFK Karviná', logo: '' },
    awayTeam: { id: 't_zli', name: 'FC Zlín', logo: '' },
    score: { home: 0, away: 1 },
    status: 'finished',
    date: '2025-08-02T13:00:00Z',
    stadium: 'Městský stadion Karviná',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-02-06',
    homeTeam: { id: 't_tep', name: 'FK Teplice', logo: '' },
    awayTeam: { id: 't_boh', name: 'Bohemians Praha 1905', logo: '' },
    score: { home: 3, away: 0 },
    status: 'finished',
    date: '2025-08-02T15:00:00Z',
    stadium: 'Stadion Na Stínadlech',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-02-07',
    homeTeam: { id: 't_olo', name: 'SK Sigma Olomouc', logo: '' },
    awayTeam: { id: 't_lib', name: 'Slovan Liberec', logo: '' },
    score: { home: 2, away: 1 },
    status: 'finished',
    date: '2025-08-02T15:00:00Z',
    stadium: 'Andrův stadion',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-03-04',
    homeTeam: { id: 't_slo', name: '1. FC Slovácko', logo: '' },
    awayTeam: { id: 't_sla', name: 'Slavia Praha', logo: '' },
    score: { home: 0, away: 1 },
    status: 'finished',
    date: '2025-08-03T13:00:00Z',
    stadium: 'Městský stadion Miroslava Valenty',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-03-05',
    homeTeam: { id: 't_duk', name: 'Dukla Praha', logo: '' },
    awayTeam: { id: 't_ban', name: 'FC Baník Ostrava', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-08-03T15:00:00Z',
    stadium: 'Juliska',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },
  {
    id: '2025-08-03-06',
    homeTeam: { id: 't_par', name: 'FK Pardubice', logo: '' },
    awayTeam: { id: 't_spa', name: 'Sparta Praha', logo: '' },
    score: { home: 1, away: 3 },
    status: 'finished',
    date: '2025-08-03T17:30:00Z',
    stadium: 'CFIG Aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '3',
    events: []
  },

  {
    id: '2025-08-09-04',
    homeTeam: { id: 't_zli', name: 'FC Zlín', logo: '' },
    awayTeam: { id: 't_mbo', name: 'FK Mladá Boleslav', logo: '' },
    score: { home: 3, away: 2 },
    status: 'finished',
    date: '2025-08-09T13:00:00Z',
    stadium: 'Stadion Letná Zlín',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-09-05',
    homeTeam: { id: 't_lib', name: 'Slovan Liberec', logo: '' },
    awayTeam: { id: 't_duk', name: 'Dukla Praha', logo: '' },
    score: { home: 2, away: 0 },
    status: 'finished',
    date: '2025-08-09T15:00:00Z',
    stadium: 'Stadion U Nisy',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-09-06',
    homeTeam: { id: 't_plz', name: 'FC Viktoria Plzeň', logo: '' },
    awayTeam: { id: 't_slo', name: '1. FC Slovácko', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-08-09T15:00:00Z',
    stadium: 'Doosan Arena',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-09-07',
    homeTeam: { id: 't_sla', name: 'Slavia Praha', logo: '' },
    awayTeam: { id: 't_tep', name: 'FK Teplice', logo: '' },
    score: { home: 3, away: 0 },
    status: 'finished',
    date: '2025-08-09T17:30:00Z',
    stadium: 'Eden Aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-10-04',
    homeTeam: { id: 't_hrk', name: 'Hradec Králové', logo: '' },
    awayTeam: { id: 't_par', name: 'FK Pardubice', logo: '' },
    score: { home: 1, away: 1 },
    status: 'finished',
    date: '2025-08-10T13:00:00Z',
    stadium: 'Malšovická aréna',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-10-05',
    homeTeam: { id: 't_boh', name: 'Bohemians Praha 1905', logo: '' },
    awayTeam: { id: 't_jab', name: 'FK Jablonec', logo: '' },
    score: { home: 0, away: 1 },
    status: 'finished',
    date: '2025-08-10T15:00:00Z',
    stadium: 'Ďolíček',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-10-06',
    homeTeam: { id: 't_ban', name: 'Baník Ostrava', logo: '' },
    awayTeam: { id: 't_kar', name: 'MFK Karviná', logo: '' },
    score: { home: 1, away: 2 },
    status: 'finished',
    date: '2025-08-10T17:30:00Z',
    stadium: 'Městský stadion Vítkovice',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
  },
  {
    id: '2025-08-10-07',
    homeTeam: { id: 't_spa', name: 'Sparta Praha', logo: '' },
    awayTeam: { id: 't_olo', name: 'SK Sigma Olomouc', logo: '' },
    score: { home: 1, away: 0 },
    status: 'finished',
    date: '2025-08-10T19:00:00Z',
    stadium: 'Letná',
    competition: { id: 'chance', name: 'Chance Liga 2025/26' },
    round: '4',
    events: []
    },
  {
    "id": "2025-08-16-t_duk-t_plz",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-16T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-16-t_olo-t_zli",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-16T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-16-t_mbo-t_hrk",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 2
    },
    "status": "finished",
    "date": "2025-08-16T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-16-t_slo-t_tep",
    "homeTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-16T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-16-t_jab-t_sla",
    "homeTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-16T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-17-t_kar-t_boh",
    "homeTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-08-17T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-17-t_lib-t_spa",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 2
    },
    "status": "finished",
    "date": "2025-08-17T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-08-19-t_mbo-t_plz",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 5
    },
    "status": "finished",
    "date": "2025-08-19T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "3",
    "events": []
  },
  {
    "id": "2025-08-23-t_plz-t_kar",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-23T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-23-t_zli-t_lib",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-23T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-23-t_tep-t_jab",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-23T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-23-t_sla-t_par",
    "homeTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-23T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-24-t_hrk-t_olo",
    "homeTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-24T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-24-t_ban-t_slo",
    "homeTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-24T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-24-t_spa-t_duk",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 2
    },
    "status": "finished",
    "date": "2025-08-24T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-08-30-t_kar-t_tep",
    "homeTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 4,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-30T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-30-t_duk-t_hrk",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-30T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-30-t_par-t_boh",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-30T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-30-t_slo-t_jab",
    "homeTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 2
    },
    "status": "finished",
    "date": "2025-08-30T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-30-t_mbo-t_sla",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 3
    },
    "status": "finished",
    "date": "2025-08-30T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-31-t_lib-t_plz",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-31T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-31-t_olo-t_ban",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-08-31T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-08-31-t_spa-t_zli",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 1
    },
    "status": "finished",
    "date": "2025-08-31T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "7",
    "events": []
  },
  {
    "id": "2025-09-13-t_plz-t_olo",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-13-t_ban-t_lib",
    "homeTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-13-t_tep-t_mbo",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 3
    },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-13-t_zli-t_duk",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-13-t_sla-t_kar",
    "homeTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-14-t_jab-t_par",
    "homeTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-14T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-14-t_boh-t_slo",
    "homeTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-14T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-14-t_hrk-t_spa",
    "homeTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-14T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "8",
    "events": []
  },
  {
    "id": "2025-09-20-t_zli-t_hrk",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-20T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-20-t_olo-t_tep",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-20T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-20-t_par-t_slo",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-20T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-20-t_kar-t_jab",
    "homeTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-20T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-20-t_spa-t_plz",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-20T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-21-t_duk-t_boh",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-21T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-21-t_lib-t_sla",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-21T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-21-t_mbo-t_ban",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-21T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "9",
    "events": []
  },
  {
    "id": "2025-09-26-t_sla-t_duk",
    "homeTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-26T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-27-t_boh-t_olo",
    "homeTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-27-t_slo-t_kar",
    "homeTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-27-t_ban-t_spa",
    "homeTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 3
    },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-27-t_hrk-t_lib",
    "homeTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 3
    },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-28-t_tep-t_par",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-28T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-28-t_jab-t_mbo",
    "homeTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-09-28T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-09-28-t_plz-t_zli",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-09-28T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "10",
    "events": []
  },
  {
    "id": "2025-10-01-t_par-t_ban",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-01T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "5",
    "events": []
  },
  {
    "id": "2025-10-04-t_mbo-t_slo",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-04-t_duk-t_tep",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 3
    },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-04-t_par-t_kar",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-04-t_lib-t_boh",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-05-t_zli-t_ban",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-05T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-05-t_plz-t_hrk",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 3
    },
    "status": "finished",
    "date": "2025-10-05T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-05-t_olo-t_jab",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-05T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-05-t_spa-t_sla",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-05T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "11",
    "events": []
  },
  {
    "id": "2025-10-18-t_par-t_mbo",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-18-t_tep-t_lib",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-18-t_kar-t_olo",
    "homeTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-18-t_boh-t_plz",
    "homeTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-18-t_sla-t_zli",
    "homeTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-19-t_ban-t_hrk",
    "homeTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-19T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-19-t_slo-t_spa",
    "homeTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-19T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-19-t_jab-t_duk",
    "homeTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-19T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "12",
    "events": []
  },
  {
    "id": "2025-10-22-t_boh-t_mbo",
    "homeTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-22T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "6",
    "events": []
  },
  {
    "id": "2025-10-25-t_hrk-t_tep",
    "homeTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-25T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-25-t_mbo-t_kar",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 4
    },
    "status": "finished",
    "date": "2025-10-25T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-25-t_duk-t_slo",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-25T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-25-t_zli-t_par",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 2
    },
    "status": "finished",
    "date": "2025-10-25T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-25-t_lib-t_jab",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 2
    },
    "status": "finished",
    "date": "2025-10-25T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-26-t_olo-t_sla",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-26T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-26-t_plz-t_ban",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-10-26T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-10-28-t_spa-t_boh",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-10-28T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "13",
    "events": []
  },
  {
    "id": "2025-11-01-t_slo-t_lib",
    "homeTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 3
    },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-01-t_jab-t_zli",
    "homeTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 3
    },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-01-t_par-t_duk",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 1
    },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-01-t_sla-t_ban",
    "homeTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-02-t_mbo-t_olo",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 4
    },
    "status": "finished",
    "date": "2025-11-02T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-02-t_boh-t_hrk",
    "homeTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-11-02T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-02-t_kar-t_spa",
    "homeTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 1
    },
    "status": "finished",
    "date": "2025-11-02T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-02-t_tep-t_plz",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-11-02T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "14",
    "events": []
  },
  {
    "id": "2025-11-08-t_duk-t_mbo",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-08-t_zli-t_boh",
    "homeTeam": {
      "id": "t_zli",
      "name": "FC Zlín",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_boh",
      "name": "Bohemians Praha 1905",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-08-t_hrk-t_slo",
    "homeTeam": {
      "id": "t_hrk",
      "name": "Hradec Králové",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_slo",
      "name": "1. FC Slovácko",
      "logo": ""
    },
    "score": {
      "home": 4,
      "away": 0
    },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-08-t_ban-t_jab",
    "homeTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_jab",
      "name": "FK Jablonec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 1
    },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-09-t_lib-t_kar",
    "homeTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_kar",
      "name": "MFK Karviná",
      "logo": ""
    },
    "score": {
      "home": 6,
      "away": 0
    },
    "status": "finished",
    "date": "2025-11-09T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-09-t_spa-t_tep",
    "homeTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 2
    },
    "status": "finished",
    "date": "2025-11-09T15:00:00Z",
    "stadium": "Letná",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-09-t_olo-t_par",
    "homeTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 0
    },
    "status": "finished",
    "date": "2025-11-09T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-09-t_plz-t_sla",
    "homeTeam": {
      "id": "t_plz",
      "name": "FC Viktoria Plzeň",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_sla",
      "name": "Slavia Praha",
      "logo": ""
    },
    "score": {
      "home": 3,
      "away": 5
    },
    "status": "finished",
    "date": "2025-11-09T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "15",
    "events": []
  },
  {
    "id": "2025-11-22-t_duk-t_olo",
    "homeTeam": {
      "id": "t_duk",
      "name": "Dukla Praha",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_olo",
      "name": "SK Sigma Olomouc",
      "logo": ""
    },
    "score": {
      "home": 2,
      "away": 2
    },
    "status": "finished",
    "date": "2025-11-22T15:00:00Z",
    "stadium": "Juliska",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-22-t_sla-t_boh",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 3, "away": 1 },
    "status": "finished",
    "date": "2025-11-22T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-23-t_kar-t_hrk",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 4, "away": 3 },
    "status": "finished",
    "date": "2025-11-23T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-23-t_jab-t_plz",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 3, "away": 3 },
    "status": "finished",
    "date": "2025-11-23T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-23-t_slo-t_zli",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-11-23T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-22-t_par-t_lib",
    "homeTeam": {
      "id": "t_par",
      "name": "FK Pardubice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_lib",
      "name": "Slovan Liberec",
      "logo": ""
    },
    "score": {
      "home": 0,
      "away": 4
    },
    "status": "finished",
    "date": "2025-11-22T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-22-t_tep-t_ban",
    "homeTeam": {
      "id": "t_tep",
      "name": "FK Teplice",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_ban",
      "name": "FC Baník Ostrava",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 0
    },
    "status": "finished",
    "date": "2025-11-22T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-22-t_mbo-t_spa",
    "homeTeam": {
      "id": "t_mbo",
      "name": "FK Mladá Boleslav",
      "logo": ""
    },
    "awayTeam": {
      "id": "t_spa",
      "name": "Sparta Praha",
      "logo": ""
    },
    "score": {
      "home": 1,
      "away": 2
    },
    "status": "finished",
    "date": "2025-11-22T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": {
      "id": "chance",
      "name": "Chance Liga 2025/26"
    },
    "round": "16",
    "events": []
  },
  {
    "id": "2025-11-29-t_hrk-t_jab",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-11-29T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-29-t_ban-t_duk",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 3, "away": 1 },
    "status": "finished",
    "date": "2025-11-29T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-29-t_zli-t_kar",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 1, "away": 3 },
    "status": "finished",
    "date": "2025-11-29T15:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-29-t_sla-t_slo",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 3, "away": 0 },
    "status": "finished",
    "date": "2025-11-29T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-30-t_boh-t_tep",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-11-30T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-30-t_lib-t_olo",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 1, "away": 0 },
    "status": "finished",
    "date": "2025-11-30T15:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-30-t_plz-t_mbo",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 2, "away": 1 },
    "status": "finished",
    "date": "2025-11-30T15:00:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-11-30-t_spa-t_par",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 2, "away": 4 },
    "status": "finished",
    "date": "2025-11-30T15:00:00Z",
    "stadium": "Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "17",
    "events": []
  },
  {
    "id": "2025-12-05-t_tep-t_sla",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 1, "away": 2 },
    "status": "finished",
    "date": "2025-12-05T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-06-t_slo-t_plz",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 3, "away": 0 },
    "status": "finished",
    "date": "2025-12-06T15:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-06-t_duk-t_lib",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-12-06T15:00:00Z",
    "stadium": "Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-06-t_mbo-t_zli",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 3, "away": 1 },
    "status": "finished",
    "date": "2025-12-06T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-06-t_olo-t_spa",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-12-06T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-07-t_jab-t_boh",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 1, "away": 0 },
    "status": "finished",
    "date": "2025-12-07T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-07-t_kar-t_ban",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-12-07T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-07-t_par-t_hrk",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 1, "away": 0 },
    "status": "finished",
    "date": "2025-12-07T15:00:00Z",
    "stadium": "CFIG Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "18",
    "events": []
  },
  {
    "id": "2025-12-13-t_hrk-t_mbo",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-12-13T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 11, "team": "away", "type": "yellow_card", "player": { "id": "p_kolarik_j", "name": "Kolářík J." }, "note": "Hrubost" },
      { "id": "e2", "minute": 25, "team": "home", "type": "yellow_card", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "note": "Podražení" },
      { "id": "e3", "minute": 35, "team": "home", "type": "yellow_card", "player": { "id": "p_petrasek_t", "name": "Petrášek T." }, "note": "Podražení" },
      { "id": "e4", "minute": 43, "team": "away", "type": "goal", "player": { "id": "p_vojta_m", "name": "Vojta M." } },
      { "id": "e5", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_uhrincat_j", "name": "Uhrinčať J." }, "note": "Hrubost" },
      { "id": "e6", "minute": 64, "team": "home", "type": "goal", "player": { "id": "p_pilar_v", "name": "Pilař V." }, "note": "Penalta" },
      { "id": "e7", "minute": 65, "team": "away", "type": "substitution", "player": { "id": "p_langhamer_d", "name": "Langhamer D." }, "note": "odchod: Ševčík M." },
      { "id": "e8", "minute": 65, "team": "away", "type": "substitution", "player": { "id": "p_penner_n", "name": "Penner N." }, "note": "odchod: Kolářík J." },
      { "id": "e9", "minute": 71, "team": "home", "type": "yellow_card", "player": { "id": "p_horejs_d", "name": "Horejš D." }, "note": "Mimo hřiště" },
      { "id": "e10", "minute": 73, "team": "away", "type": "substitution", "player": { "id": "p_fulnek_j", "name": "Fulnek J." }, "note": "odchod: Prebsl F. (Zranění)" },
      { "id": "e11", "minute": 79, "team": "away", "type": "yellow_card", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "note": "Nesportovní chování" },
      { "id": "e12", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_griger_a", "name": "Griger A." }, "note": "odchod: Pilař V." },
      { "id": "e13", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_kubr_l", "name": "Kubr L." }, "note": "odchod: van Buren M." },
      { "id": "e14", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_john_s", "name": "John S." }, "note": "odchod: Zíka J." }
    ]
  },
  {
    "id": "2025-12-13-t_ban-t_par",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 1, "away": 4 },
    "status": "finished",
    "date": "2025-12-13T15:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 5, "team": "away", "type": "goal", "player": { "id": "p_noslin_j", "name": "Noslin J." }, "assistPlayer": { "id": "p_mahuta_r", "name": "Mahuta R." } },
      { "id": "e2", "minute": 9, "team": "away", "type": "yellow_card", "player": { "id": "p_mahuta_r", "name": "Mahuta R." }, "note": "Zdržování hry" },
      { "id": "e3", "minute": 15, "team": "home", "type": "goal", "player": { "id": "p_kricfalusi_o", "name": "Kričfaluši O." }, "assistPlayer": { "id": "p_havran_m", "name": "Havran M." } },
      { "id": "e4", "minute": 27, "team": "away", "type": "goal", "player": { "id": "p_tanko_a", "name": "Tanko A." }, "assistPlayer": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e5", "minute": 32, "team": "away", "type": "yellow_card", "player": { "id": "p_simek_s", "name": "Šimek S." }, "note": "Podražení" },
      { "id": "e6", "minute": 36, "team": "away", "type": "yellow_card", "player": { "id": "p_konecny_m", "name": "Konečný M." }, "note": "Faul" },
      { "id": "e7", "minute": 50, "team": "away", "type": "yellow_card", "player": { "id": "p_tanko_a", "name": "Tanko A." }, "note": "Podražení" },
      { "id": "e8", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_munksgaard_a", "name": "Munksgaard A." }, "note": "odchod: Pojezný K." },
      { "id": "e9", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_tiehi_c", "name": "Tiéhi C." }, "note": "odchod: Chaluš M." },
      { "id": "e10", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_buchta_d", "name": "Buchta D." }, "note": "odchod: Plavšič S." },
      { "id": "e11", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "note": "odchod: Smékal D." },
      { "id": "e12", "minute": 51, "team": "away", "type": "goal", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "assistPlayer": { "id": "p_mahuta_r", "name": "Mahuta R." } },
      { "id": "e13", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_reznicek_j", "name": "Řezníček J." }, "note": "odchod: Solil T." },
      { "id": "e14", "minute": 63, "team": "away", "type": "yellow_card", "player": { "id": "p_reznicek_j", "name": "Řezníček J." }, "note": "Hrubost" },
      { "id": "e15", "minute": 64, "team": "home", "type": "yellow_card", "player": { "id": "p_boula_j", "name": "Boula J." }, "note": "Nesportovní chování" },
      { "id": "e16", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_owusu_d", "name": "Owusu D." }, "note": "odchod: Havran M." },
      { "id": "e17", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_pira_j", "name": "Pira J." }, "note": "odchod: Zlatohlávek T." },
      { "id": "e18", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "note": "odchod: Botos G." },
      { "id": "e19", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_sychra_v", "name": "Sychra V." }, "note": "odchod: Tanko A." },
      { "id": "e20", "minute": 85, "team": "away", "type": "yellow_card", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "note": "Držení" },
      { "id": "e21", "minute": 89, "team": "away", "type": "substitution", "player": { "id": "p_misek_s", "name": "Míšek Š." }, "note": "odchod: Mahuta R." },
      { "id": "e22", "minute": 92, "team": "away", "type": "goal", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "assistPlayer": { "id": "p_sychra_v", "name": "Sychra V." } }
    ]
  },
  {
    "id": "2025-12-13-t_tep-t_slo",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 1, "away": 0 },
    "status": "finished",
    "date": "2025-12-13T15:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": []
  },
  {
    "id": "2025-12-13-t_sla-t_jab",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 4, "away": 3 },
    "status": "finished",
    "date": "2025-12-13T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 10, "team": "home", "type": "goal", "player": { "id": "p_provod_l", "name": "Provod L." }, "assistPlayer": { "id": "p_chory_t", "name": "Chorý T." } },
      { "id": "e2", "minute": 34, "team": "away", "type": "goal", "player": { "id": "p_tekijaski_n", "name": "Tekijaški N." }, "assistPlayer": { "id": "p_rusek_a", "name": "Růsek A." } },
      { "id": "e3", "minute": 38, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "note": "Penalta" },
      { "id": "e4", "minute": 47, "team": "away", "type": "goal", "player": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e5", "minute": 46, "team": "away", "type": "yellow_card", "player": { "id": "p_innocenti_n", "name": "Innocenti N." }, "note": "Držení" },
      { "id": "e6", "minute": 55, "team": "home", "type": "goal", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "assistPlayer": { "id": "p_vlcek_t", "name": "Vlček T." } },
      { "id": "e7", "minute": 56, "team": "away", "type": "substitution", "player": { "id": "p_jawo_l", "name": "Jawo L." }, "note": "odchod: Chramosta J." },
      { "id": "e8", "minute": 57, "team": "away", "type": "goal", "player": { "id": "p_jawo_l", "name": "Jawo L." } },
      { "id": "e9", "minute": 61, "team": "home", "type": "yellow_card", "player": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "note": "Nafilmovaný pád" },
      { "id": "e10", "minute": 71, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "assistPlayer": { "id": "p_holes_t", "name": "Holeš T." } },
      { "id": "e11", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_cham_m", "name": "Cham M." }, "note": "odchod: Chytil M." },
      { "id": "e12", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_boril_j", "name": "Bořil J." }, "note": "odchod: Sanyang Y." },
      { "id": "e13", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "note": "odchod: Zafeiris C." },
      { "id": "e14", "minute": 77, "team": "away", "type": "yellow_card", "player": { "id": "p_jawo_l", "name": "Jawo L." }, "note": "Faul, Stop na další zápas" },
      { "id": "e15", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_malensek_m", "name": "Malensek M." }, "note": "odchod: Alegue A." },
      { "id": "e16", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_soucek_d", "name": "Souček D." }, "note": "odchod: Pantalon R." },
      { "id": "e17", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "note": "odchod: Růsek A." },
      { "id": "e18", "minute": 86, "team": "away", "type": "substitution", "player": { "id": "p_suchan_j", "name": "Suchan J." }, "note": "odchod: Sedláček R." },
      { "id": "e19", "minute": 86, "team": "home", "type": "substitution", "player": { "id": "p_schranz_i", "name": "Schranz I." }, "note": "odchod: Chorý T." },
      { "id": "e20", "minute": 91, "team": "away", "type": "yellow_card", "player": { "id": "p_cedidla_m", "name": "Cedidla M." }, "note": "Držení" },
      { "id": "e21", "minute": 94, "team": "home", "type": "substitution", "player": { "id": "p_ogbu_i", "name": "Ogbu I." }, "note": "odchod: Douděra D." }
    ]
  },
  {
    "id": "2025-12-14-t_boh-t_kar",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 3 },
    "status": "finished",
    "date": "2025-12-14T13:00:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_plestil_d", "name": "Pleštil D." }, "note": "odchod: Drchal V." },
      { "id": "e2", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_yusuf", "name": "Yusuf" }, "note": "odchod: Ramirez E." },
      { "id": "e3", "minute": 70, "team": "away", "type": "goal", "player": { "id": "p_singhateh_e", "name": "Singhateh E." }, "note": "Penalta" },
      { "id": "e4", "minute": 71, "team": "away", "type": "substitution", "player": { "id": "p_ezeh_l", "name": "Ezeh L." }, "note": "odchod: Singhateh E." },
      { "id": "e5", "minute": 79, "team": "away", "type": "goal", "player": { "id": "p_ezeh_l", "name": "Ezeh L." }, "assistPlayer": { "id": "p_sigut_s", "name": "Šigut S." } },
      { "id": "e6", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_kareem_p", "name": "Kareem P." }, "note": "odchod: Kadlec A." },
      { "id": "e7", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_kovarik_j", "name": "Kovařík J." }, "note": "odchod: Zeman V." },
      { "id": "e8", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "note": "odchod: Sakala B." },
      { "id": "e9", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_conde_o", "name": "Conde O." }, "note": "odchod: Gning A." },
      { "id": "e10", "minute": 87, "team": "away", "type": "goal", "player": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "assistPlayer": { "id": "p_ezeh_l", "name": "Ezeh L." } },
      { "id": "e11", "minute": 92, "team": "away", "type": "substitution", "player": { "id": "p_valosek_v", "name": "Valošek V." }, "note": "odchod: Samko D." },
      { "id": "e12", "minute": 92, "team": "away", "type": "substitution", "player": { "id": "p_kacor_p", "name": "Kačor P." }, "note": "odchod: Šigut S." },
      { "id": "e13", "minute": 92, "team": "away", "type": "substitution", "player": { "id": "p_fiala_j", "name": "Fiala J." }, "note": "odchod: Ayaosi E." }
    ]
  },
  {
    "id": "2025-12-14-t_plz-t_duk",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-12-14T15:30:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 8, "team": "home", "type": "substitution", "player": { "id": "p_dweh_s", "name": "Dweh S." }, "note": "odchod: Markovič S. (Zranění)" },
      { "id": "e2", "minute": 41, "team": "home", "type": "goal", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "assistPlayer": { "id": "p_vydra_m", "name": "Vydra M." } },
      { "id": "e3", "minute": 58, "team": "away", "type": "yellow_card", "player": { "id": "p_svozil_j", "name": "Svozil J." }, "note": "Hrubost" },
      { "id": "e4", "minute": 63, "team": "away", "type": "substitution", "player": { "id": "p_kozma_d", "name": "Kozma D." }, "note": "odchod: Kroupa M." },
      { "id": "e5", "minute": 63, "team": "away", "type": "substitution", "player": { "id": "p_cernak_m", "name": "Černák M." }, "note": "odchod: Gaszcyk P." },
      { "id": "e6", "minute": 65, "team": "home", "type": "goal", "player": { "id": "p_jemelka_v", "name": "Jemelka V." }, "assistPlayer": { "id": "p_adu_p", "name": "Adu P." } },
      { "id": "e7", "minute": 68, "team": "home", "type": "substitution", "player": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "note": "odchod: Valenta M." },
      { "id": "e8", "minute": 73, "team": "away", "type": "yellow_card", "player": { "id": "p_hunal_e", "name": "Hunal E." }, "note": "Faul" },
      { "id": "e9", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_velasquez_d", "name": "Velasquez D." }, "note": "odchod: Hašek D." },
      { "id": "e10", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "note": "odchod: Cisse N." },
      { "id": "e11", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_traore_m", "name": "Traore M." }, "note": "odchod: Pourzitidis M." },
      { "id": "e12", "minute": 89, "team": "home", "type": "substitution", "player": { "id": "p_panos_j", "name": "Panoš J." }, "note": "odchod: Červ L." }
    ]
  },
  {
    "id": "2025-12-14-t_zli-t_olo",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 5, "away": 0 },
    "status": "finished",
    "date": "2025-12-14T15:30:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "e1", "minute": 3, "team": "home", "type": "goal", "player": { "id": "p_kanu_s", "name": "Kanu S." }, "assistPlayer": { "id": "p_ulbrich_t", "name": "Ulbrich T." } },
      { "id": "e2", "minute": 13, "team": "home", "type": "goal", "player": { "id": "p_cupak_m", "name": "Cupák M." }, "assistPlayer": { "id": "p_kanu_s", "name": "Kanu S." } },
      { "id": "e3", "minute": 36, "team": "home", "type": "substitution", "player": { "id": "p_machalik_d", "name": "Machalík D." }, "note": "odchod: Didiba J. (Zranění)" },
      { "id": "e4", "minute": 46, "team": "away", "type": "yellow_card", "player": { "id": "p_kral_j", "name": "Král J." }, "note": "Faul" },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_tijani_m", "name": "Tijani M." }, "note": "odchod: Šíp J." },
      { "id": "e6", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_janosek_d", "name": "Janošek D." }, "note": "odchod: Beran M." },
      { "id": "e7", "minute": 55, "team": "home", "type": "goal", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "assistPlayer": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e8", "minute": 58, "team": "away", "type": "yellow_card", "player": { "id": "p_huk_t", "name": "Huk T." }, "note": "Nesportovní chování" },
      { "id": "e9", "minute": 59, "team": "away", "type": "substitution", "player": { "id": "p_kliment_j", "name": "Kliment J." }, "note": "odchod: Kostadinov T." },
      { "id": "e10", "minute": 59, "team": "away", "type": "substitution", "player": { "id": "p_ghali_a", "name": "Ghali A." }, "note": "odchod: Michez S." },
      { "id": "e11", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "note": "odchod: Ulbrich T." },
      { "id": "e12", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "note": "odchod: Bartošák L." },
      { "id": "e13", "minute": 73, "team": "home", "type": "goal", "player": { "id": "p_petruta_s", "name": "Petruta S." } },
      { "id": "e14", "minute": 75, "team": "home", "type": "goal", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "assistPlayer": { "id": "p_hellebrand_t", "name": "Hellebrand T." } },
      { "id": "e15", "minute": 75, "team": "home", "type": "yellow_card", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "note": "Nesportovní chování" },
      { "id": "e16", "minute": 85, "team": "away", "type": "substitution", "player": { "id": "p_langer_s", "name": "Langer Š." }, "note": "odchod: Huk T. (Zranění)" },
      { "id": "e17", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_branecky_l", "name": "Bránecký L." }, "note": "odchod: Petruta S." },
      { "id": "e18", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_poznar_t", "name": "Poznar T." }, "note": "odchod: Kanu S." },
      { "id": "e19", "minute": 91, "team": "home", "type": "yellow_card", "player": { "id": "p_branecky_l", "name": "Bránecký L." }, "note": "Faul" },
      { "id": "e20", "minute": 92, "team": "away", "type": "yellow_card", "player": { "id": "p_kliment_j", "name": "Kliment J." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-12-14-t_spa-t_lib",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 2, "away": 2 },
    "status": "finished",
    "date": "2025-12-14T15:00:00Z",
    "stadium": "Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "19",
    "events": [
      { "id": "evt-2025-12-14-29-icha-foul", "type": "yellow_card", "minute": 29, "team": "away", "player": { "id": "p_icha", "name": "Icha M." }, "note": "Faul" },
      { "id": "evt-2025-12-14-34-krollis-goal", "type": "goal", "minute": 34, "team": "away", "player": { "id": "p_krollis", "name": "Krollis R." }, "assistPlayer": { "id": "p_kayondo", "name": "Kayondo A." } },
      { "id": "evt-2025-12-14-42-nglessan-og", "type": "goal", "minute": 42, "team": "home", "player": { "id": "p_nglessan", "name": "N'Guessan A." }, "note": "Vlastní gól" },
      { "id": "evt-2025-12-14-47-kayondo-timewaste", "type": "yellow_card", "minute": 47, "team": "away", "player": { "id": "p_kayondo", "name": "Kayondo A." }, "note": "Zdržování hry, Stop na další zápas" },
      { "id": "evt-2025-12-14-48-mercado-hrubost", "type": "yellow_card", "minute": 48, "team": "home", "player": { "id": "p_mercado", "name": "Mercado J." }, "note": "Hrubost" },
      { "id": "evt-2025-12-14-55-sorensen-drzeni", "type": "yellow_card", "minute": 55, "team": "home", "player": { "id": "p_sorensen", "name": "Sørensen A." }, "note": "Držení" },
      { "id": "evt-2025-12-14-57-mannsverk-eneme", "type": "substitution", "minute": 57, "team": "home", "player": { "id": "p_mannsverk", "name": "Mannsverk S." }, "assistPlayer": { "id": "p_eneme", "name": "Eneme S." }, "note": "Zranění" },
      { "id": "evt-2025-12-14-57-letenay-soliu", "type": "substitution", "minute": 57, "team": "away", "player": { "id": "p_letenay", "name": "Letenay L." }, "assistPlayer": { "id": "p_soliu", "name": "Soliu A." } },
      { "id": "evt-2025-12-14-68-mahmic-krollis", "type": "substitution", "minute": 68, "team": "away", "player": { "id": "p_mahmic", "name": "Mahmič E." }, "assistPlayer": { "id": "p_krollis", "name": "Krollis R." } },
      { "id": "evt-2025-12-14-68-kozelluh-hodous", "type": "substitution", "minute": 68, "team": "away", "player": { "id": "p_kozelluh", "name": "Koželuh J." }, "assistPlayer": { "id": "p_hodous", "name": "Hodouš P." } },
      { "id": "evt-2025-12-14-68-kuchta-zeleny", "type": "substitution", "minute": 68, "team": "home", "player": { "id": "p_kuchta", "name": "Kuchta J." }, "assistPlayer": { "id": "p_zeleny", "name": "Zelený J." } },
      { "id": "evt-2025-12-14-68-birmancevic-mercado", "type": "substitution", "minute": 68, "team": "home", "player": { "id": "p_birmancevic", "name": "Birmančevič V." }, "assistPlayer": { "id": "p_mercado", "name": "Mercado J." } },
      { "id": "evt-2025-12-14-76-kaderabek-rynes", "type": "substitution", "minute": 76, "team": "home", "player": { "id": "p_kaderabek", "name": "Kadeřábek P." }, "assistPlayer": { "id": "p_rynes", "name": "Ryneš M." } },
      { "id": "evt-2025-12-14-77-masek-podraz", "type": "yellow_card", "minute": 77, "team": "home", "player": { "id": "p_masek", "name": "Mašek L." }, "note": "Podražení, Stop na další zápas" },
      { "id": "evt-2025-12-14-79-letenay-goal", "type": "goal", "minute": 79, "team": "away", "player": { "id": "p_letenay", "name": "Letenay L." } },
      { "id": "evt-2025-12-14-84-julis-masek", "type": "substitution", "minute": 84, "team": "home", "player": { "id": "p_julis", "name": "Juliš P." }, "assistPlayer": { "id": "p_masek", "name": "Mašek L." } },
      { "id": "evt-2025-12-14-85-kuchta-goal", "type": "goal", "minute": 85, "team": "home", "player": { "id": "p_kuchta", "name": "Kuchta J." }, "assistPlayer": { "id": "p_birmancevic", "name": "Birmančevič V." } },
      { "id": "evt-2025-12-14-87-nglessan-unsport", "type": "red_card", "minute": 87, "team": "away", "player": { "id": "p_nglessan", "name": "N'Guessan A." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "evt-2025-12-14-94-kayondo-drzeni", "type": "yellow_card", "minute": 94, "team": "away", "player": { "id": "p_kayondo", "name": "Kayondo A." }, "note": "Držení" },
      { "id": "evt-2025-12-14-94-kuchta-unsport", "type": "yellow_card", "minute": 94, "team": "home", "player": { "id": "p_kuchta", "name": "Kuchta J." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-01-31-t_mbo-t_boh",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-01-31T15:00:00Z",
    "stadium": "Městský stadion Mladá Boleslav",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-01-31-t_olo-t_hrk",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-01-31T15:00:00Z",
    "stadium": "Andrův stadion",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-01-31-t_jab-t_tep",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-01-31T15:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-01-31-t_duk-t_spa",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-01-31T18:00:00Z",
    "stadium": "Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-02-01-t_slo-t_ban",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-01T13:00:00Z",
    "stadium": "Městský stadion Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-02-01-t_lib-t_zli",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-01T15:30:00Z",
    "stadium": "Stadion U Nisy",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-02-01-t_kar-t_plz",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-01T15:30:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-02-01-t_par-t_sla",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-01T18:30:00Z",
    "stadium": "CFIG Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "20",
    "events": []
  },
  {
    "id": "2025-02-07-t_zli-t_spa",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Stadion Letná Zlín",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_tep-t_kar",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Stadion Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_ban-t_olo",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_sla-t_mbo",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Eden Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_boh-t_par",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_jab-t_slo",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Stadion Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_plz-t_lib",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  },
  {
    "id": "2025-02-07-t_duk-t_hrk",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2025-02-07T12:00:00Z",
    "stadium": "Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "21",
    "events": []
  }
];

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      return MANUAL_MATCHES;
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst zápasy');
    }
  }
);

export const fetchLiveMatches = createAsyncThunk(
  'matches/fetchLiveMatches',
  async (_, { rejectWithValue }) => {
    try {
      return MANUAL_MATCHES.filter(m => m.status === 'live');
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst živé zápasy');
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const found = MANUAL_MATCHES.find(m => m.id === id);
      if (found) return found;
      return rejectWithValue('Zápas nenalezen');
    } catch (error) {
      return rejectWithValue('Nepodařilo se načíst detail zápasu');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    updateLiveMatch: (state, action) => {
      const updatedMatch = action.payload;
      state.liveMatches = state.liveMatches.map(match => 
        match.id === updatedMatch.id ? updatedMatch : match
      );
      if (state.currentMatch && state.currentMatch.id === updatedMatch.id) {
        state.currentMatch = updatedMatch;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLiveMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.liveMatches = action.payload;
      })
      .addCase(fetchLiveMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentMatch, updateLiveMatch } = matchesSlice.actions;
export default matchesSlice.reducer;
