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
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'goal_disallowed' | 'missed_penalty';
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
    playerIn?: {
      id: string;
      name: string;
    };
    playerOut?: {
      id: string;
      name: string;
    };
    scoreUpdate?: string;
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
    "id": "2025-11-08-t_duk-t_bol",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_bol", "name": "Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 12, "team": "away", "type": "yellow_card", "player": { "id": "p_langhamer_d", "name": "Langhamer D." }, "note": "Držení" },
      { "id": "e2", "minute": 33, "team": "away", "type": "goal", "player": { "id": "p_zika_j", "name": "Zíka J." }, "assistPlayer": { "id": "p_langhamer_d", "name": "Langhamer D." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 46, "team": "home", "type": "yellow_card", "player": { "id": "p_pourzitidis_m", "name": "Pourzitidis M." }, "note": "Hrubost" },
      { "id": "e4", "minute": 55, "team": "home", "type": "substitution", "player": { "id": "p_kozma_d", "name": "Kozma D." }, "playerIn": { "id": "p_kozma_d", "name": "Kozma D." }, "playerOut": { "id": "p_svozil_j", "name": "Svozil J." } },
      { "id": "e5", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_kroupa_m", "name": "Kroupa M." }, "playerIn": { "id": "p_kroupa_m", "name": "Kroupa M." }, "playerOut": { "id": "p_jedlicka_t", "name": "Jedlička T." } },
      { "id": "e6", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_cisse_n", "name": "Cisse N." }, "playerIn": { "id": "p_cisse_n", "name": "Cisse N." }, "playerOut": { "id": "p_kadak_j", "name": "Kadák J." } },
      { "id": "e7", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_gaszczyk_p", "name": "Gaszczyk P." }, "playerIn": { "id": "p_gaszczyk_p", "name": "Gaszczyk P." }, "playerOut": { "id": "p_cernak_m", "name": "Černák M." } },
      { "id": "e8", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_subert_m", "name": "Šubert M." }, "playerIn": { "id": "p_subert_m", "name": "Šubert M." }, "playerOut": { "id": "p_kolarik_j", "name": "Kolářík J." } },
      { "id": "e9", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_donat_d", "name": "Donát D." }, "playerIn": { "id": "p_donat_d", "name": "Donát D." }, "playerOut": { "id": "p_fulnek_j", "name": "Fulnek J." } },
      { "id": "e10", "minute": 76, "team": "away", "type": "yellow_card", "player": { "id": "p_matousek_f", "name": "Matoušek F." }, "note": "Hrubost" },
      { "id": "e11", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "playerIn": { "id": "p_vojta_m", "name": "Vojta M." }, "playerOut": { "id": "p_klima_j", "name": "Klíma J." } },
      { "id": "e12", "minute": 85, "team": "home", "type": "substitution", "player": { "id": "p_velasquez_d", "name": "Velasquez D." }, "playerIn": { "id": "p_velasquez_d", "name": "Velasquez D." }, "playerOut": { "id": "p_isife_s", "name": "Isife S." } },
      { "id": "e13", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_lehky_f", "name": "Lehký F." }, "playerIn": { "id": "p_lehky_f", "name": "Lehký F." }, "playerOut": { "id": "p_langhamer_d", "name": "Langhamer D." } },
      { "id": "e14", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_hora_v", "name": "Hora V." }, "playerIn": { "id": "p_hora_v", "name": "Hora V." }, "playerOut": { "id": "p_matousek_f", "name": "Matoušek F." } }
    ]
  },
  {
    "id": "2025-11-09-t_plz-t_sla",
    "homeTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 3, "away": 5 },
    "status": "finished",
    "date": "2025-11-09T18:30:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 13, "team": "home", "type": "yellow_card", "player": { "id": "p_spacil_k", "name": "Spáčil K." }, "note": "Hrubost" },
      { "id": "e2", "minute": 27, "team": "away", "type": "goal", "player": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "assistPlayer": { "id": "p_provod_l", "name": "Provod L." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 32, "team": "home", "type": "yellow_card", "player": { "id": "p_dweh_s", "name": "Dweh S." }, "note": "Faul" },
      { "id": "e4", "minute": 32, "team": "home", "type": "goal", "player": { "id": "p_ladra_t", "name": "Ladra T." }, "scoreUpdate": "1-1" },
      { "id": "e5", "minute": 42, "team": "away", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "assistPlayer": { "id": "p_zima_d", "name": "Zima D." }, "scoreUpdate": "1-2" },
      { "id": "e6", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_cerv_l", "name": "Červ L." }, "note": "Podražení" },
      { "id": "e7", "minute": 45, "team": "away", "type": "goal", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "assistPlayer": { "id": "p_zima_d", "name": "Zima D." }, "scoreUpdate": "1-3" },
      { "id": "e8", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_doski_m", "name": "Doski M." }, "note": "Podražení" },
      { "id": "e9", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_sadilek_m", "name": "Sadílek M." }, "note": "Nesportovní chování" },
      { "id": "e10", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_markovic_s", "name": "Markovič S." }, "note": "Hrubost" },
      { "id": "e11", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_vlcek_t", "name": "Vlček T." }, "note": "Podražení" },
      { "id": "e12", "minute": 49, "team": "away", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "scoreUpdate": "1-4" },
      { "id": "e13", "minute": 56, "team": "home", "type": "substitution", "player": { "id": "p_valenta_m", "name": "Valenta M." }, "playerIn": { "id": "p_valenta_m", "name": "Valenta M." }, "playerOut": { "id": "p_spacil_k", "name": "Spáčil K." } },
      { "id": "e14", "minute": 56, "team": "home", "type": "substitution", "player": { "id": "p_souare_c", "name": "Souaré C." }, "playerIn": { "id": "p_souare_c", "name": "Souaré C." }, "playerOut": { "id": "p_vilinaky_d", "name": "Vilinaky D." } },
      { "id": "e15", "minute": 57, "team": "away", "type": "yellow_card", "player": { "id": "p_moses_d", "name": "Moses D." }, "note": "Zdržování hry" },
      { "id": "e16", "minute": 61, "team": "home", "type": "goal", "player": { "id": "p_cerv_l", "name": "Červ L." }, "scoreUpdate": "2-4" },
      { "id": "e17", "minute": 62, "team": "away", "type": "yellow_card", "player": { "id": "p_zima_d", "name": "Zima D." }, "note": "Hrubost" },
      { "id": "e18", "minute": 66, "team": "away", "type": "substitution", "player": { "id": "p_doudera_d", "name": "Douděra D." }, "playerIn": { "id": "p_doudera_d", "name": "Douděra D." }, "playerOut": { "id": "p_moses_d", "name": "Moses D." } },
      { "id": "e19", "minute": 66, "team": "away", "type": "substitution", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "playerIn": { "id": "p_kusej_v", "name": "Kušej V." }, "playerOut": { "id": "p_sanyang_y", "name": "Sanyang Y." } },
      { "id": "e20", "minute": 68, "team": "away", "type": "yellow_card", "player": { "id": "p_mbodji_y", "name": "Mbodji Y." }, "note": "Faul" },
      { "id": "e21", "minute": 71, "team": "home", "type": "goal", "player": { "id": "p_memic_a", "name": "Memič A." }, "assistPlayer": { "id": "p_ladra_t", "name": "Ladra T." }, "scoreUpdate": "3-4" },
      { "id": "e22", "minute": 75, "team": "home", "type": "yellow_card", "player": { "id": "p_memic_a", "name": "Memič A." }, "note": "Podražení" },
      { "id": "e23", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_holes_t", "name": "Holeš T." }, "playerIn": { "id": "p_holes_t", "name": "Holeš T." }, "playerOut": { "id": "p_vlcek_t", "name": "Vlček T." } },
      { "id": "e24", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_schranz_i", "name": "Schranz I." }, "playerIn": { "id": "p_schranz_i", "name": "Schranz I." }, "playerOut": { "id": "p_mbodji_y", "name": "Mbodji Y." } },
      { "id": "e25", "minute": 77, "team": "away", "type": "yellow_card", "player": { "id": "p_doudera_d", "name": "Douděra D." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e26", "minute": 84, "team": "away", "type": "goal", "player": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "scoreUpdate": "3-5" },
      { "id": "e27", "minute": 86, "team": "away", "type": "substitution", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "playerIn": { "id": "p_chytil_m", "name": "Chytil M." }, "playerOut": { "id": "p_chory_t", "name": "Chorý T." } },
      { "id": "e28", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_kabongo_c", "name": "Kabongo C." }, "playerIn": { "id": "p_kabongo_c", "name": "Kabongo C." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } }
    ]
  },
  {
    "id": "2025-11-08-t_hra-t_slo",
    "homeTeam": { "id": "t_hra", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "score": { "home": 4, "away": 0 },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 21, "team": "home", "type": "goal", "player": { "id": "p_pilar_v", "name": "Pilař V." }, "assistPlayer": { "id": "p_vlkanova_a", "name": "Vlkanova A." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerIn": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerOut": { "id": "p_van_buren_m", "name": "van Buren M." } },
      { "id": "e3", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "playerIn": { "id": "p_sloncik_t", "name": "Slončík T." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "e4", "minute": 65, "team": "away", "type": "yellow_card", "player": { "id": "p_danicek_v", "name": "Daníček V." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e5", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerIn": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerOut": { "id": "p_marinelli_a", "name": "Marinelli A." } },
      { "id": "e6", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_petrzela_m", "name": "Petržela M." }, "playerIn": { "id": "p_petrzela_m", "name": "Petržela M." }, "playerOut": { "id": "p_danicek_v", "name": "Daníček V." } },
      { "id": "e7", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_barat_d", "name": "Barát D." }, "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_ndefe_g", "name": "Ndefe G." } },
      { "id": "e8", "minute": 72, "team": "home", "type": "goal", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "scoreUpdate": "2-0" },
      { "id": "e9", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_hamza_j", "name": "Hamza J." }, "playerIn": { "id": "p_hamza_j", "name": "Hamza J." }, "playerOut": { "id": "p_stojcevski_a", "name": "Stojcevski A." } },
      { "id": "e10", "minute": 79, "team": "away", "type": "yellow_card", "player": { "id": "p_sumulikoski_v", "name": "Šumulikoski V." }, "note": "Mimo hřiště" },
      { "id": "e11", "minute": 80, "team": "home", "type": "goal", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "assistPlayer": { "id": "p_kucera_j", "name": "Kučera J." }, "scoreUpdate": "3-0" },
      { "id": "e12", "minute": 83, "team": "home", "type": "yellow_card", "player": { "id": "p_dancak_s", "name": "Dancák S." }, "note": "Hrubost" },
      { "id": "e13", "minute": 84, "team": "away", "type": "yellow_card", "player": { "id": "p_petrzela_m", "name": "Petržela M." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e14", "minute": 86, "team": "home", "type": "substitution", "player": { "id": "p_griger_a", "name": "Griger A." }, "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_vlkanova_a", "name": "Vlkanova A." } },
      { "id": "e15", "minute": 86, "team": "home", "type": "substitution", "player": { "id": "p_horak_d", "name": "Horák D." }, "playerIn": { "id": "p_horak_d", "name": "Horák D." }, "playerOut": { "id": "p_dancak_s", "name": "Dancák S." } },
      { "id": "e16", "minute": 88, "team": "away", "type": "substitution", "player": { "id": "p_mulder_j", "name": "Mulder J." }, "playerIn": { "id": "p_mulder_j", "name": "Mulder J." }, "playerOut": { "id": "p_reinberk_p", "name": "Reinberk P." } },
      { "id": "e17", "minute": 89, "team": "home", "type": "substitution", "player": { "id": "p_kubr_l", "name": "Kubr L." }, "playerIn": { "id": "p_kubr_l", "name": "Kubr L." }, "playerOut": { "id": "p_sojka_a", "name": "Sojka A." } },
      { "id": "e18", "minute": 90, "team": "home", "type": "goal", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "assistPlayer": { "id": "p_kubr_l", "name": "Kubr L." }, "scoreUpdate": "4-0" }
    ]
  },
  {
    "id": "2025-11-08-t_ban-t_jab",
    "homeTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-11-08T18:00:00Z",
    "stadium": "Městský stadion Vítkovice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 25, "team": "away", "type": "goal", "player": { "id": "p_jawo_l", "name": "Jawo L." }, "assistPlayer": { "id": "p_novak_f", "name": "Novák F." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 42, "team": "away", "type": "yellow_card", "player": { "id": "p_jawo_l", "name": "Jawo L." }, "note": "Faul" },
      { "id": "e3", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_frydrych_m", "name": "Frydrych M." }, "playerIn": { "id": "p_frydrych_m", "name": "Frydrych M." }, "playerOut": { "id": "p_sehic_e", "name": "Šehić E." } },
      { "id": "e4", "minute": 55, "team": "away", "type": "substitution", "player": { "id": "p_rusek_a", "name": "Růsek A." }, "playerIn": { "id": "p_rusek_a", "name": "Růsek A." }, "playerOut": { "id": "p_puskac_d", "name": "Puškáč D." } },
      { "id": "e5", "minute": 61, "team": "away", "type": "yellow_card", "player": { "id": "p_tekijaski_n", "name": "Tekijaški N." }, "note": "Faul, Stop na další zápas" },
      { "id": "e6", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_alegue_a", "name": "Alegue A." }, "playerIn": { "id": "p_alegue_a", "name": "Alegue A." }, "playerOut": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerIn": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerOut": { "id": "p_soucek_d", "name": "Souček D." } },
      { "id": "e8", "minute": 74, "team": "home", "type": "substitution", "player": { "id": "p_almasi_l", "name": "Almási L." }, "playerIn": { "id": "p_almasi_l", "name": "Almási L." }, "playerOut": { "id": "p_musak_a", "name": "Musák A." } },
      { "id": "e9", "minute": 86, "team": "home", "type": "yellow_card", "player": { "id": "p_pojezny_k", "name": "Pojezný K." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e10", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_innocenti_n", "name": "Innocenti N." }, "playerIn": { "id": "p_innocenti_n", "name": "Innocenti N." }, "playerOut": { "id": "p_sedlacek_r", "name": "Sedláček R." } },
      { "id": "e11", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_malensek_m", "name": "Malensek M." }, "playerIn": { "id": "p_malensek_m", "name": "Malensek M." }, "playerOut": { "id": "p_jawo_l", "name": "Jawo L." } }
    ]
  },
  {
    "id": "2025-11-09-t_olo-t_par",
    "homeTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-11-09T15:30:00Z",
    "stadium": "Andrův stadion",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 28, "team": "home", "type": "yellow_card", "player": { "id": "p_kostadinov_t", "name": "Kostadinov T." }, "note": "Podražení" },
      { "id": "e2", "minute": 44, "team": "home", "type": "yellow_card", "player": { "id": "p_kral_j", "name": "Král J." }, "note": "Hrubost" },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_solil_t", "name": "Solil T." }, "playerIn": { "id": "p_solil_t", "name": "Solil T." }, "playerOut": { "id": "p_saarma_r", "name": "Saarma R." } },
      { "id": "e4", "minute": 49, "team": "away", "type": "yellow_card", "player": { "id": "p_lurvink_l", "name": "Lurvink L." }, "note": "Faul, Stop na další zápas" },
      { "id": "e5", "minute": 56, "team": "away", "type": "substitution", "player": { "id": "p_tredl_j", "name": "Trédl J." }, "playerIn": { "id": "p_tredl_j", "name": "Trédl J." }, "playerOut": { "id": "p_botos_g", "name": "Botoš G." } },
      { "id": "e6", "minute": 66, "team": "home", "type": "substitution", "player": { "id": "p_janousek_d", "name": "Janoušek D." }, "playerIn": { "id": "p_janousek_d", "name": "Janoušek D." }, "playerOut": { "id": "p_kostadinov_t", "name": "Kostadinov T." } },
      { "id": "e7", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_huk_t", "name": "Huk T." }, "playerIn": { "id": "p_huk_t", "name": "Huk T." }, "playerOut": { "id": "p_kral_j", "name": "Král J." } },
      { "id": "e8", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_dolnikov_a", "name": "Dolníkov A." }, "playerIn": { "id": "p_dolnikov_a", "name": "Dolníkov A." }, "playerOut": { "id": "p_sip_j", "name": "Šíp J." } },
      { "id": "e9", "minute": 75, "team": "away", "type": "substitution", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "playerIn": { "id": "p_vecheta_f", "name": "Vecheta F." }, "playerOut": { "id": "p_krobot_l", "name": "Krobot L." } },
      { "id": "e10", "minute": 78, "team": "home", "type": "goal", "player": { "id": "p_vasulin_d", "name": "Vašulín D." }, "assistPlayer": { "id": "p_ghali_a", "name": "Ghali A." }, "scoreUpdate": "1-0" },
      { "id": "e11", "minute": 78, "team": "away", "type": "yellow_card", "player": { "id": "p_sevcik_j", "name": "Ševčík J." }, "note": "Nesportovní chování" },
      { "id": "e12", "minute": 84, "team": "away", "type": "yellow_card", "player": { "id": "p_surzyn_m", "name": "Surzyn M." }, "note": "Držení" },
      { "id": "e13", "minute": 88, "team": "away", "type": "red_card", "player": { "id": "p_lurvink_l", "name": "Lurvink L." }, "note": "Hra rukou" },
      { "id": "e14", "minute": 89, "team": "home", "type": "goal", "player": { "id": "p_janousek_d", "name": "Janoušek D." }, "scoreUpdate": "2-0", "note": "Penalta" },
      { "id": "e15", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_simek_d", "name": "Šimek D." }, "playerIn": { "id": "p_simek_d", "name": "Šimek D." }, "playerOut": { "id": "p_surzyn_m", "name": "Surzyn M." } },
      { "id": "e16", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_leza_m", "name": "Leza M." }, "playerIn": { "id": "p_leza_m", "name": "Leza M." }, "playerOut": { "id": "p_simek_s", "name": "Šimek S." } },
      { "id": "e17", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_langer_s", "name": "Langer Š." }, "playerIn": { "id": "p_langer_s", "name": "Langer Š." }, "playerOut": { "id": "p_mikulenka_m", "name": "Mikulenka M." } },
      { "id": "e18", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_tijani_m", "name": "Tijani M." }, "playerIn": { "id": "p_tijani_m", "name": "Tijani M." }, "playerOut": { "id": "p_vasulin_d", "name": "Vašulín D." } },
      { "id": "e19", "minute": 90, "team": "home", "type": "red_card", "player": { "id": "p_dolnikov_a", "name": "Dolníkov A." }, "note": "Hrubost" },
      { "id": "e20", "minute": 90, "team": "away", "type": "red_card", "player": { "id": "p_mahuta_r", "name": "Mahuta R." }, "note": "Hrubost" },
      { "id": "e21", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_tredl_j", "name": "Trédl J." }, "note": "Nesportovní chování" },
      { "id": "e22", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_tijani_m", "name": "Tijani M." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-11-08-t_zli-t_boh",
    "homeTeam": { "id": "t_zli", "name": "Zlín", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-11-08T15:00:00Z",
    "stadium": "Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 65, "team": "away", "type": "substitution", "player": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_yusuf", "name": "Yusuf" } },
      { "id": "e2", "minute": 69, "team": "away", "type": "goal", "player": { "id": "p_sakala_b", "name": "Sakala B." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_poznar_t", "name": "Poznar T." }, "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s", "name": "Kanu S." } },
      { "id": "e4", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerIn": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerOut": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e5", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerIn": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerOut": { "id": "p_ulbrich_t", "name": "Ulbrich T." } },
      { "id": "e6", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "playerIn": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "playerOut": { "id": "p_pisoja_m", "name": "Pišoja M." } },
      { "id": "e7", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_krapka_a", "name": "Křapka A." }, "playerIn": { "id": "p_krapka_a", "name": "Křapka A." }, "playerOut": { "id": "p_didiba_j", "name": "Didiba J." } },
      { "id": "e8", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_drchal_v", "name": "Drchal V." }, "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_vondra_j", "name": "Vondra J." } },
      { "id": "e9", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_kadlec_m", "name": "Kadlec M." }, "playerIn": { "id": "p_kadlec_m", "name": "Kadlec M." }, "playerOut": { "id": "p_kovarik_j", "name": "Kovařík J." } },
      { "id": "e10", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_koubek_m", "name": "Koubek M." }, "playerIn": { "id": "p_koubek_m", "name": "Koubek M." }, "playerOut": { "id": "p_kopecny_m", "name": "Kopečný M." } },
      { "id": "e11", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_reichl_m", "name": "Reichl M." }, "note": "Zdržování hry" },
      { "id": "e12", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "playerIn": { "id": "p_smrz_v", "name": "Smrž V." }, "playerOut": { "id": "p_cermak_a", "name": "Čermák A." } },
      { "id": "e13", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "note": "Faul" }
    ]
  },
  {
    "id": "2025-11-09-t_spa-t_tep",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "score": { "home": 2, "away": 2 },
    "status": "finished",
    "date": "2025-11-09T15:30:00Z",
    "stadium": "epet ARENA",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 6, "team": "home", "type": "goal", "player": { "id": "p_marecek_d", "name": "Mareček D." }, "scoreUpdate": "1-0", "note": "Vlastní gól" },
      { "id": "e2", "minute": 9, "team": "away", "type": "yellow_card", "player": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "note": "Hrubost" },
      { "id": "e3", "minute": 18, "team": "away", "type": "goal", "player": { "id": "p_vecerka_d", "name": "Večerka D." }, "assistPlayer": { "id": "p_halinsky_d", "name": "Halinský D." }, "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 25, "team": "away", "type": "yellow_card", "player": { "id": "p_bilek_m", "name": "Bílek M." }, "note": "Držení" },
      { "id": "e5", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_preciado_a", "name": "Preciado A." }, "note": "Nafilmovaný pád, Stop na další zápas" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_rynes_m", "name": "Ryneš M." }, "playerIn": { "id": "p_rynes_m", "name": "Ryneš M." }, "playerOut": { "id": "p_mercado_j", "name": "Mercado J." } },
      { "id": "e7", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerIn": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerOut": { "id": "p_kuchta_j", "name": "Kuchta J." } },
      { "id": "e8", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_vydra_p", "name": "Vydra P." }, "playerIn": { "id": "p_vydra_p", "name": "Vydra P." }, "playerOut": { "id": "p_mannsverk_s", "name": "Mannsverk S." } },
      { "id": "e9", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerIn": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." } },
      { "id": "e10", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerIn": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerOut": { "id": "p_pulkrab_m", "name": "Pulkrab M." } },
      { "id": "e11", "minute": 64, "team": "away", "type": "goal", "player": { "id": "p_radosta_m", "name": "Radosta M." }, "assistPlayer": { "id": "p_halinsky_d", "name": "Halinský D." }, "scoreUpdate": "1-2" },
      { "id": "e12", "minute": 71, "team": "away", "type": "yellow_card", "player": { "id": "p_auta_j", "name": "Auta J." }, "note": "Nesportovní chování" },
      { "id": "e13", "minute": 76, "team": "home", "type": "goal", "player": { "id": "p_vydra_p", "name": "Vydra P." }, "assistPlayer": { "id": "p_haraslin_l", "name": "Haraslín L." }, "scoreUpdate": "2-2" },
      { "id": "e14", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_trubac_d", "name": "Trubač D." }, "playerIn": { "id": "p_trubac_d", "name": "Trubač D." }, "playerOut": { "id": "p_auta_j", "name": "Auta J." } },
      { "id": "e15", "minute": 78, "team": "home", "type": "substitution", "player": { "id": "p_kuol_g", "name": "Kuol G." }, "playerIn": { "id": "p_kuol_g", "name": "Kuol G." }, "playerOut": { "id": "p_panak_f", "name": "Panák F." } },
      { "id": "e16", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_jukl_r", "name": "Jukl R." }, "playerIn": { "id": "p_jukl_r", "name": "Jukl R." }, "playerOut": { "id": "p_bilek_m", "name": "Bílek M." } },
      { "id": "e17", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_audinis_n", "name": "Audinis N." }, "playerIn": { "id": "p_audinis_n", "name": "Audinis N." }, "playerOut": { "id": "p_danihel_d", "name": "Danihel D." } },
      { "id": "e18", "minute": 87, "team": "away", "type": "yellow_card", "player": { "id": "p_nyarko_b", "name": "Nyarko B." }, "note": "Hrubost" },
      { "id": "e19", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_vindahl_p", "name": "Vindahl P." }, "note": "Mimo hřiště" }
    ]
  },
  {
    "id": "2025-11-09-t_lib-t_kar",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "Karviná", "logo": "" },
    "score": { "home": 6, "away": 0 },
    "status": "finished",
    "date": "2025-11-09T13:00:00Z",
    "stadium": "Stadion U Nisy",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "15",
    "events": [
      { "id": "e1", "minute": 9, "team": "home", "type": "goal", "player": { "id": "p_krollis_r", "name": "Krollis R." }, "assistPlayer": { "id": "p_icha_m", "name": "Icha M." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 13, "team": "away", "type": "red_card", "player": { "id": "p_traore_a", "name": "Traore A." }, "note": "Tvrdý faul" },
      { "id": "e3", "minute": 16, "team": "home", "type": "substitution", "player": { "id": "p_kozeluh_j", "name": "Koželuh J." }, "playerIn": { "id": "p_kozeluh_j", "name": "Koželuh J." }, "playerOut": { "id": "p_kayondo_a", "name": "Kayondo A." } },
      { "id": "e4", "minute": 26, "team": "home", "type": "yellow_card", "player": { "id": "p_kozeluh_j", "name": "Koželuh J." }, "note": "Podražení" },
      { "id": "e5", "minute": 26, "team": "home", "type": "yellow_card", "player": { "id": "p_plechaty_d", "name": "Plechatý D." }, "note": "Faul" },
      { "id": "e6", "minute": 29, "team": "home", "type": "goal", "player": { "id": "p_mahmic_e", "name": "Mahmić E." }, "assistPlayer": { "id": "p_icha_m", "name": "Icha M." }, "scoreUpdate": "2-0" },
      { "id": "e7", "minute": 39, "team": "home", "type": "goal", "player": { "id": "p_stransky_v", "name": "Stránský V." }, "assistPlayer": { "id": "p_mahmic_e", "name": "Mahmić E." }, "scoreUpdate": "3-0" },
      { "id": "e8", "minute": 43, "team": "home", "type": "goal", "player": { "id": "p_mahmic_e", "name": "Mahmić E." }, "assistPlayer": { "id": "p_dulay_p", "name": "Dulay P." }, "scoreUpdate": "4-0" },
      { "id": "e9", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_masek_l", "name": "Mašek L." }, "playerIn": { "id": "p_masek_l", "name": "Mašek L." }, "playerOut": { "id": "p_mahmic_e", "name": "Mahmić E." } },
      { "id": "e10", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_singhateh_e", "name": "Singhateh E." }, "playerIn": { "id": "p_singhateh_e", "name": "Singhateh E." }, "playerOut": { "id": "p_sigut_s", "name": "Šigut S." } },
      { "id": "e11", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_ezeh_l", "name": "Ezeh L." }, "playerIn": { "id": "p_ezeh_l", "name": "Ezeh L." }, "playerOut": { "id": "p_gning_a", "name": "Gning A." } },
      { "id": "e12", "minute": 59, "team": "away", "type": "substitution", "player": { "id": "p_storman_r", "name": "Štorman R." }, "playerIn": { "id": "p_storman_r", "name": "Štorman R." }, "playerOut": { "id": "p_samko_d", "name": "Samko D." } },
      { "id": "e13", "minute": 60, "team": "home", "type": "substitution", "player": { "id": "p_letenay_l", "name": "Letenay L." }, "playerIn": { "id": "p_letenay_l", "name": "Letenay L." }, "playerOut": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "e14", "minute": 60, "team": "home", "type": "substitution", "player": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerIn": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerOut": { "id": "p_soliu_a", "name": "Soliu A." } },
      { "id": "e15", "minute": 68, "team": "home", "type": "substitution", "player": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "playerIn": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "playerOut": { "id": "p_diakite_t", "name": "Diakite T." } },
      { "id": "e16", "minute": 68, "team": "home", "type": "substitution", "player": { "id": "p_rus_d", "name": "Rus D." }, "playerIn": { "id": "p_rus_d", "name": "Rus D." }, "playerOut": { "id": "p_dulay_p", "name": "Dulay P." } },
      { "id": "e17", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_kacor_p", "name": "Kačor P." }, "playerIn": { "id": "p_kacor_p", "name": "Kačor P." }, "playerOut": { "id": "p_ayaosi_e", "name": "Ayaosi E." } },
      { "id": "e18", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_kristan_j", "name": "Křišťan J." }, "playerIn": { "id": "p_kristan_j", "name": "Křišťan J." }, "playerOut": { "id": "p_labik_a", "name": "Labík A." } },
      { "id": "e19", "minute": 83, "team": "home", "type": "goal", "player": { "id": "p_masek_l", "name": "Mašek L." }, "assistPlayer": { "id": "p_stransky_v", "name": "Stránský V." }, "scoreUpdate": "5-0" },
      { "id": "e20", "minute": 90, "team": "home", "type": "goal", "player": { "id": "p_masek_l", "name": "Mašek L." }, "assistPlayer": { "id": "p_letenay_l", "name": "Letenay L." }, "scoreUpdate": "6-0" }
    ]
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
    "events": [
      { "id": "mbs-23-haraslin-pen", "minute": 23, "team": "away", "type": "goal", "player": { "id": "p_haraslin_l", "name": "Haraslín L." }, "note": "Penalta", "scoreUpdate": "0-1" },
      { "id": "mbs-28-kuol-yellow", "minute": 28, "team": "away", "type": "yellow_card", "player": { "id": "p_kuol_g", "name": "Kuol G." }, "note": "Držení" },
      { "id": "mbs-33-kairinen-goal", "minute": 33, "team": "away", "type": "goal", "player": { "id": "p_kairinen_k", "name": "Kairinen K." }, "assistPlayer": { "id": "p_haraslin_l", "name": "Haraslín L." }, "scoreUpdate": "0-2" },
      { "id": "mbs-58-vojta-klima-sub", "minute": 58, "team": "home", "type": "substitution", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "playerIn": { "id": "p_vojta_m", "name": "Vojta M." }, "playerOut": { "id": "p_klima_j", "name": "Klíma J." } },
      { "id": "mbs-58-subert-fulnek-sub", "minute": 58, "team": "home", "type": "substitution", "player": { "id": "p_subert_m", "name": "Šubert M." }, "playerIn": { "id": "p_subert_m", "name": "Šubert M." }, "playerOut": { "id": "p_fulnek_j", "name": "Fulnek J." } },
      { "id": "mbs-58-kolarik-lehky-sub", "minute": 58, "team": "home", "type": "substitution", "player": { "id": "p_kolarik_j", "name": "Kolářík J." }, "playerIn": { "id": "p_kolarik_j", "name": "Kolářík J." }, "playerOut": { "id": "p_lehky_f", "name": "Lehký F." } },
      { "id": "mbs-61-majer-yellow", "minute": 61, "team": "home", "type": "yellow_card", "player": { "id": "p_majer_a", "name": "Majer A." }, "note": "Mimo hřiště" },
      { "id": "mbs-63-kuchta-rrahmani-sub", "minute": 63, "team": "away", "type": "substitution", "player": { "id": "p_kuchta_j", "name": "Kuchta J." }, "playerIn": { "id": "p_kuchta_j", "name": "Kuchta J." }, "playerOut": { "id": "p_rrahmani_a", "name": "Rrahmani A." } },
      { "id": "mbs-64-macek-yellow", "minute": 64, "team": "home", "type": "yellow_card", "player": { "id": "p_macek_r", "name": "Macek R." }, "note": "Hrubost" },
      { "id": "mbs-75-vojta-goal", "minute": 75, "team": "home", "type": "goal", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "assistPlayer": { "id": "p_macek_r", "name": "Macek R." }, "scoreUpdate": "1-2" },
      { "id": "mbs-76-penxa-kuol-sub", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_penxa_o", "name": "Penxa O." }, "playerIn": { "id": "p_penxa_o", "name": "Penxa O." }, "playerOut": { "id": "p_kuol_g", "name": "Kuol G." } },
      { "id": "mbs-76-eneme-vydra-sub", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_eneme_s", "name": "Eneme S." }, "playerIn": { "id": "p_eneme_s", "name": "Eneme S." }, "playerOut": { "id": "p_vydra_p", "name": "Vydra P." } },
      { "id": "mbs-80-kralik-yellow", "minute": 80, "team": "home", "type": "yellow_card", "player": { "id": "p_kralik_m", "name": "Králík M." }, "note": "Držení" },
      { "id": "mbs-80-martinec-panak-sub", "minute": 80, "team": "away", "type": "substitution", "player": { "id": "p_martinec_j", "name": "Martinec J." }, "playerIn": { "id": "p_martinec_j", "name": "Martinec J." }, "playerOut": { "id": "p_panak_f", "name": "Panák F." } },
      { "id": "mbs-85-penner-kostka-sub", "minute": 85, "team": "home", "type": "substitution", "player": { "id": "p_penner_n", "name": "Penner N." }, "playerIn": { "id": "p_penner_n", "name": "Penner N." }, "playerOut": { "id": "p_kostka_d", "name": "Kostka D." } },
      { "id": "mbs-90-krulich-matousek-sub", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_krulich_m", "name": "Krulich M." }, "playerIn": { "id": "p_krulich_m", "name": "Krulich M." }, "playerOut": { "id": "p_matousek_f", "name": "Matoušek F." } }
    ]
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
    "events": [
      { "id": "jab-6-doski-goal", "minute": 6, "team": "away", "type": "goal", "player": { "id": "p_doski_m", "name": "Doski M." }, "assistPlayer": { "id": "p_memic_a", "name": "Memič A." }, "scoreUpdate": "0-1" },
      { "id": "jab-10-valenta-goal", "minute": 10, "team": "away", "type": "goal", "player": { "id": "p_valenta_m", "name": "Valenta M." }, "assistPlayer": { "id": "p_ladra_t", "name": "Ladra T." }, "scoreUpdate": "0-2" },
      { "id": "jab-17-spacil-yellow", "minute": 17, "team": "away", "type": "yellow_card", "player": { "id": "p_spacil_k", "name": "Spáčil K." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "jab-20-rusek-goal", "minute": 20, "team": "home", "type": "goal", "player": { "id": "p_rusek_a", "name": "Růsek A." }, "assistPlayer": { "id": "p_novak_f", "name": "Novák F." }, "scoreUpdate": "1-2" },
      { "id": "jab-23-alegue-goal", "minute": 23, "team": "home", "type": "goal", "player": { "id": "p_alegue_a", "name": "Alegue A." }, "scoreUpdate": "2-2" },
      { "id": "jab-60-rusek-goal", "minute": 60, "team": "home", "type": "goal", "player": { "id": "p_rusek_a", "name": "Růsek A." }, "assistPlayer": { "id": "p_alegue_a", "name": "Alegue A." }, "scoreUpdate": "3-2" },
      { "id": "jab-62-souare-goal", "minute": 62, "team": "away", "type": "goal", "player": { "id": "p_souare_c", "name": "Souaré C." }, "assistPlayer": { "id": "p_valenta_m", "name": "Valenta M." }, "scoreUpdate": "3-3" },
      { "id": "jab-63-soucek-yellow", "minute": 63, "team": "home", "type": "yellow_card", "player": { "id": "p_soucek_d", "name": "Souček D." }, "note": "Hrubost" },
      { "id": "jab-63-puskac-jawo-sub", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerIn": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerOut": { "id": "p_jawo_l", "name": "Jawo L." } },
      { "id": "jab-63-zorvan-sedlacek-sub", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_zorvan_f", "name": "Zorvan F." }, "playerIn": { "id": "p_zorvan_f", "name": "Zorvan F." }, "playerOut": { "id": "p_sedlacek_r", "name": "Sedláček R." } },
      { "id": "jab-73-stepanek-soucek-sub", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerIn": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerOut": { "id": "p_soucek_d", "name": "Souček D." } },
      { "id": "jab-77-adu-durosinmi-sub", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_adu_p", "name": "Adu P." }, "playerIn": { "id": "p_adu_p", "name": "Adu P." }, "playerOut": { "id": "p_durosinmi_r", "name": "Durosinmi R." } },
      { "id": "jab-77-visinsky-ladra-sub", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_visinsky_d", "name": "Višinský D." }, "playerIn": { "id": "p_visinsky_d", "name": "Višinský D." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } },
      { "id": "jab-83-suchan-rusek-sub", "minute": 83, "team": "home", "type": "substitution", "player": { "id": "p_suchan_j", "name": "Suchan J." }, "playerIn": { "id": "p_suchan_j", "name": "Suchan J." }, "playerOut": { "id": "p_rusek_a", "name": "Růsek A." } },
      { "id": "jab-83-chramosta-alegue-sub", "minute": 83, "team": "home", "type": "substitution", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerIn": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerOut": { "id": "p_alegue_a", "name": "Alegue A." } },
      { "id": "jab-85-vydra-souare-sub", "minute": 85, "team": "away", "type": "substitution", "player": { "id": "p_vydra_m", "name": "Vydra M." }, "playerIn": { "id": "p_vydra_m", "name": "Vydra M." }, "playerOut": { "id": "p_souare_c", "name": "Souaré C." } },
      { "id": "jab-88-kozel-yellow", "minute": 88, "team": "home", "type": "yellow_card", "player": { "id": "p_kozel_l", "name": "Kozel L." }, "note": "Mimo hřiště" },
      { "id": "jab-90-zorvan-yellow", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_zorvan_f", "name": "Zorvan F." }, "note": "Faul" },
      { "id": "jab-91-chanturish-yellow", "minute": 91, "team": "home", "type": "yellow_card", "player": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "note": "Faul" },
      { "id": "jab-91-havel-valenta-sub", "minute": 91, "team": "away", "type": "substitution", "player": { "id": "p_havel_m", "name": "Havel M." }, "playerIn": { "id": "p_havel_m", "name": "Havel M." }, "playerOut": { "id": "p_valenta_m", "name": "Valenta M." } },
      { "id": "jab-97-hysky-yellow", "minute": 97, "team": "away", "type": "yellow_card", "player": { "id": "p_hysky_m", "name": "Hyský M." }, "note": "Mimo hřiště" }
    ]
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
    "events": [
      { "id": "par-27-soliu-goal", "minute": 27, "team": "away", "type": "goal", "player": { "id": "p_soliu_a", "name": "Soliu A." }, "assistPlayer": { "id": "p_krollis_r", "name": "Krollis R." }, "scoreUpdate": "0-1" },
      { "id": "par-28-saarma-misek-sub", "minute": 28, "team": "home", "type": "substitution", "player": { "id": "p_saarma_r", "name": "Saarma R." }, "playerIn": { "id": "p_saarma_r", "name": "Saarma R." }, "playerOut": { "id": "p_misek_s", "name": "Míšek Š." }, "note": "Zranění" },
      { "id": "par-40-dulay-goal", "minute": 40, "team": "away", "type": "goal", "player": { "id": "p_dulay_p", "name": "Dulay P." }, "assistPlayer": { "id": "p_mahmic_e", "name": "Mahmič E." }, "scoreUpdate": "0-2" },
      { "id": "par-46-vecheta-tanko-sub", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_vecheta_f", "name": "Vecheta F." }, "playerIn": { "id": "p_vecheta_f", "name": "Vecheta F." }, "playerOut": { "id": "p_tanko_a", "name": "Tanko A." } },
      { "id": "par-46-solil-sancl-sub", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_solil_t", "name": "Solil T." }, "playerIn": { "id": "p_solil_t", "name": "Solil T." }, "playerOut": { "id": "p_sancl_f", "name": "Šancl F." } },
      { "id": "par-46-mahmic-yellow", "minute": 46, "team": "away", "type": "yellow_card", "player": { "id": "p_mahmic_e", "name": "Mahmič E." }, "note": "Nafilmovaný pád, Stop na další zápas" },
      { "id": "par-47-solil-yellow", "minute": 47, "team": "home", "type": "yellow_card", "player": { "id": "p_solil_t", "name": "Solil T." }, "note": "Hrubost" },
      { "id": "par-55-simek-yellow", "minute": 55, "team": "home", "type": "yellow_card", "player": { "id": "p_simek_s", "name": "Šimek S." }, "note": "Hrubost" },
      { "id": "par-58-hodous-dulay-sub", "minute": 58, "team": "away", "type": "substitution", "player": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerIn": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerOut": { "id": "p_dulay_p", "name": "Dulay P." } },
      { "id": "par-58-masek-mahmic-sub", "minute": 58, "team": "away", "type": "substitution", "player": { "id": "p_masek_l", "name": "Mašek L." }, "playerIn": { "id": "p_masek_l", "name": "Mašek L." }, "playerOut": { "id": "p_mahmic_e", "name": "Mahmič E." } },
      { "id": "par-68-tredl-yellow", "minute": 68, "team": "home", "type": "yellow_card", "player": { "id": "p_tredl_j", "name": "Trédl J." }, "note": "Podražení" },
      { "id": "par-68-smekal-noslin-sub", "minute": 68, "team": "home", "type": "substitution", "player": { "id": "p_smekal_d", "name": "Smékal D." }, "playerIn": { "id": "p_smekal_d", "name": "Smékal D." }, "playerOut": { "id": "p_noslin_j", "name": "Noslin J." } },
      { "id": "par-68-masek-goal", "minute": 68, "team": "away", "type": "goal", "player": { "id": "p_masek_l", "name": "Mašek L." }, "assistPlayer": { "id": "p_kayondo_a", "name": "Kayondo A." }, "scoreUpdate": "0-3" },
      { "id": "par-71-krollis-yellow", "minute": 71, "team": "away", "type": "yellow_card", "player": { "id": "p_krollis_r", "name": "Krollis R." }, "note": "Nesportovní chování" },
      { "id": "par-73-letenay-soliu-sub", "minute": 73, "team": "away", "type": "substitution", "player": { "id": "p_letenay_l", "name": "Letenay L." }, "playerIn": { "id": "p_letenay_l", "name": "Letenay L." }, "playerOut": { "id": "p_soliu_a", "name": "Soliu A." } },
      { "id": "par-73-hlavaty-stransky-sub", "minute": 73, "team": "away", "type": "substitution", "player": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "playerIn": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "playerOut": { "id": "p_stransky_v", "name": "Stránský V." } },
      { "id": "par-73-krobot-yellow", "minute": 73, "team": "home", "type": "yellow_card", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "note": "Hrubost" },
      { "id": "par-79-julis-krollis-sub", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_julis_p", "name": "Juliš P." }, "playerIn": { "id": "p_julis_p", "name": "Juliš P." }, "playerOut": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "par-80-plechaty-goal", "minute": 80, "team": "away", "type": "goal", "player": { "id": "p_plechaty_d", "name": "Plechatý D." }, "scoreUpdate": "0-4" },
      { "id": "par-82-samuel-krobot-sub", "minute": 82, "team": "home", "type": "substitution", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "playerIn": { "id": "p_samuel_v", "name": "Samuel V." }, "playerOut": { "id": "p_krobot_l", "name": "Krobot L." } },
      { "id": "par-92-koubek-yellow", "minute": 92, "team": "home", "type": "yellow_card", "player": { "id": "p_koubek_t", "name": "Koubek T." }, "note": "Nesportovní chování" }
    ]
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
    "events": [
      { "id": "slo-36-tetour-goal", "minute": 36, "team": "home", "type": "goal", "player": { "id": "p_tetour_d", "name": "Tetour D." }, "assistPlayer": { "id": "p_havlik_m", "name": "Havlík M." }, "scoreUpdate": "1-0" },
      { "id": "slo-40-kim-goal", "minute": 40, "team": "home", "type": "goal", "player": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "assistPlayer": { "id": "p_travnik_m", "name": "Trávník M." }, "scoreUpdate": "2-0" },
      { "id": "slo-46-kanu-pisoja-sub", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_kanu_s", "name": "Kanu S." }, "playerIn": { "id": "p_kanu_s", "name": "Kanu S." }, "playerOut": { "id": "p_pisoja_m", "name": "Pišoja M." } },
      { "id": "slo-55-hellebrand-cernin-sub", "minute": 55, "team": "away", "type": "substitution", "player": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerIn": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerOut": { "id": "p_cernin_j", "name": "Černín J." }, "note": "Zranění" },
      { "id": "slo-55-branecky-poznar-sub", "minute": 55, "team": "away", "type": "substitution", "player": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerIn": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerOut": { "id": "p_poznar_t", "name": "Poznar T." } },
      { "id": "slo-60-krmencik-gd", "minute": 60, "team": "home", "type": "goal_disallowed", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "slo-65-rundic-stojcevski-sub", "minute": 65, "team": "home", "type": "substitution", "player": { "id": "p_rundic_m", "name": "Rundič M." }, "playerIn": { "id": "p_rundic_m", "name": "Rundič M." }, "playerOut": { "id": "p_stojcevski_a", "name": "Stojcevski A." }, "note": "Zranění" },
      { "id": "slo-65-kim-svidersky-sub", "minute": 65, "team": "home", "type": "substitution", "player": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerIn": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerOut": { "id": "p_svidersky_m", "name": "Šviderský M." } },
      { "id": "slo-68-natchkebia-kalabiska-sub", "minute": 68, "team": "away", "type": "substitution", "player": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "playerIn": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "playerOut": { "id": "p_kalabiska_j", "name": "Kalabiška J." } },
      { "id": "slo-71-krmencik-yellow", "minute": 71, "team": "home", "type": "yellow_card", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "note": "Hrubost" },
      { "id": "slo-76-reinberk-ndefe-sub", "minute": 76, "team": "home", "type": "substitution", "player": { "id": "p_reinberk_p", "name": "Reinberk P." }, "playerIn": { "id": "p_reinberk_p", "name": "Reinberk P." }, "playerOut": { "id": "p_ndefe_g", "name": "Ndefe G." } },
      { "id": "slo-78-ulbrich-cupak-sub", "minute": 78, "team": "away", "type": "substitution", "player": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerIn": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerOut": { "id": "p_cupak_m", "name": "Cupák M." } },
      { "id": "slo-81-natchkebia-yellow", "minute": 81, "team": "away", "type": "yellow_card", "player": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "note": "Hrubost" },
      { "id": "slo-84-tetour-koscelnik-sub", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_tetour_d", "name": "Tetour D." }, "playerIn": { "id": "p_tetour_d", "name": "Tetour D." }, "playerOut": { "id": "p_koscelnik_m", "name": "Koscelník M." } },
      { "id": "slo-84-krmencik-barat-sub", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerIn": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerOut": { "id": "p_barat_d", "name": "Barát D." } }
    ]
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
    "events": [
      { "id": "kar-8-vanburen-goal", "minute": 8, "team": "away", "type": "goal", "player": { "id": "p_van_buren_m", "name": "van Buren M." }, "assistPlayer": { "id": "p_sloncik_t", "name": "Slončík T." }, "scoreUpdate": "0-1" },
      { "id": "kar-31-horak-kucera-sub", "minute": 31, "team": "away", "type": "substitution", "player": { "id": "p_horak_d", "name": "Horák D." }, "playerIn": { "id": "p_horak_d", "name": "Horák D." }, "playerOut": { "id": "p_kucera_j", "name": "Kučera J." }, "note": "Zranění" },
      { "id": "kar-41-ayaosi-goal", "minute": 41, "team": "home", "type": "goal", "player": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "assistPlayer": { "id": "p_krcik_d", "name": "Krčík D." }, "scoreUpdate": "1-1" },
      { "id": "kar-47-bohac-yellow", "minute": 47, "team": "home", "type": "yellow_card", "player": { "id": "p_bohac_s", "name": "Boháč S." }, "note": "Faul" },
      { "id": "kar-45p2-sigut-goal", "minute": 47, "team": "home", "type": "goal", "player": { "id": "p_sigut_s", "name": "Šigut S." }, "assistPlayer": { "id": "p_samko_d", "name": "Samko D." }, "scoreUpdate": "2-1" },
      { "id": "kar-46-buzek-kristan-sub", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_buzek_a", "name": "Bužek A." }, "playerIn": { "id": "p_buzek_a", "name": "Bužek A." }, "playerOut": { "id": "p_kristan_j", "name": "Křišťan J." } },
      { "id": "kar-54-darida-goal", "minute": 54, "team": "away", "type": "goal", "player": { "id": "p_darida_v", "name": "Darida V." }, "assistPlayer": { "id": "p_pilar_v", "name": "Pilař V." }, "scoreUpdate": "2-2" },
      { "id": "kar-60-ayaosi-goal", "minute": 60, "team": "home", "type": "goal", "player": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "assistPlayer": { "id": "p_samko_d", "name": "Samko D." }, "scoreUpdate": "3-2" },
      { "id": "kar-65-mihalik-pilar-sub", "minute": 65, "team": "away", "type": "substitution", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerIn": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "kar-74-griger-vanburen-sub", "minute": 74, "team": "away", "type": "substitution", "player": { "id": "p_griger_a", "name": "Griger A." }, "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_van_buren_m", "name": "van Buren M." } },
      { "id": "kar-75-dancak-yellow", "minute": 75, "team": "away", "type": "yellow_card", "player": { "id": "p_dancak_s", "name": "Dancák S." }, "note": "Faul" },
      { "id": "kar-85-samko-conde-sub", "minute": 85, "team": "home", "type": "substitution", "player": { "id": "p_samko_d", "name": "Samko D." }, "playerIn": { "id": "p_samko_d", "name": "Samko D." }, "playerOut": { "id": "p_conde_o", "name": "Conde O." } },
      { "id": "kar-85-gning-ezeh-sub", "minute": 85, "team": "home", "type": "substitution", "player": { "id": "p_gning_a", "name": "Gning A." }, "playerIn": { "id": "p_gning_a", "name": "Gning A." }, "playerOut": { "id": "p_ezeh_l", "name": "Ezeh L." } },
      { "id": "kar-87-ayaosi-goal", "minute": 87, "team": "home", "type": "goal", "player": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "assistPlayer": { "id": "p_ezeh_l", "name": "Ezeh L." }, "scoreUpdate": "4-2" },
      { "id": "kar-89-darida-goal", "minute": 89, "team": "away", "type": "goal", "player": { "id": "p_darida_v", "name": "Darida V." }, "scoreUpdate": "4-3" },
      { "id": "kar-93-sigut-chytry-sub", "minute": 93, "team": "home", "type": "substitution", "player": { "id": "p_sigut_s", "name": "Šigut S." }, "playerIn": { "id": "p_sigut_s", "name": "Šigut S." }, "playerOut": { "id": "p_chytry_j", "name": "Chytrý J." } }
    ]
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
    "events": [
      { "id": "sla-17-chory-goal", "minute": 17, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "assistPlayer": { "id": "p_provod_l", "name": "Provod L." }, "scoreUpdate": "1-0" },
      { "id": "sla-30-boril-yellow", "minute": 30, "team": "home", "type": "yellow_card", "player": { "id": "p_boril_j", "name": "Bořil J." }, "note": "Hrubost" },
      { "id": "sla-36-drchal-yellow", "minute": 36, "team": "away", "type": "yellow_card", "player": { "id": "p_drchal_v", "name": "Drchal V." }, "note": "Hrubost" },
      { "id": "sla-41-okeke-og", "minute": 41, "team": "home", "type": "goal", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "note": "Vlastní gól", "scoreUpdate": "2-0" },
      { "id": "sla-46-kusej-zafeiris-sub", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "playerIn": { "id": "p_kusej_v", "name": "Kušej V." }, "playerOut": { "id": "p_zafeiris_c", "name": "Zafeiris C." } },
      { "id": "sla-60-zeman-drchal-sub", "minute": 60, "team": "away", "type": "substitution", "player": { "id": "p_zeman_v", "name": "Zeman V." }, "playerIn": { "id": "p_zeman_v", "name": "Zeman V." }, "playerOut": { "id": "p_drchal_v", "name": "Drchal V." } },
      { "id": "sla-60-ristovski-yusuf-sub", "minute": 60, "team": "away", "type": "substitution", "player": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_yusuf", "name": "Yusuf" } },
      { "id": "sla-73-provod-goal", "minute": 73, "team": "home", "type": "goal", "player": { "id": "p_provod_l", "name": "Provod L." }, "assistPlayer": { "id": "p_moses_d", "name": "Moses D." }, "scoreUpdate": "3-0" },
      { "id": "sla-75-sanyang-chytil-sub", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "playerIn": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "playerOut": { "id": "p_chytil_m", "name": "Chytil M." } },
      { "id": "sla-75-moses-holes-sub", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_moses_d", "name": "Moses D." }, "playerIn": { "id": "p_moses_d", "name": "Moses D." }, "playerOut": { "id": "p_holes_t", "name": "Holeš T." } },
      { "id": "sla-76-kadlec-kovarik-sub", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerIn": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerOut": { "id": "p_kovarik_j", "name": "Kovařík J." } },
      { "id": "sla-77-kadlec-goal", "minute": 77, "team": "away", "type": "goal", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "assistPlayer": { "id": "p_zeman_v", "name": "Zeman V." }, "scoreUpdate": "3-1" },
      { "id": "sla-78-prekop-chory-sub", "minute": 78, "team": "home", "type": "substitution", "player": { "id": "p_prekop_e", "name": "Prekop E." }, "playerIn": { "id": "p_prekop_e", "name": "Prekop E." }, "playerOut": { "id": "p_chory_t", "name": "Chorý T." } },
      { "id": "sla-84-cham-vlcek-sub", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_cham_m", "name": "Cham M." }, "playerIn": { "id": "p_cham_m", "name": "Cham M." }, "playerOut": { "id": "p_vlcek_t", "name": "Vlček T." } },
      { "id": "sla-86-cerny-cermak-sub", "minute": 86, "team": "away", "type": "substitution", "player": { "id": "p_cerny_s", "name": "Černý Š." }, "playerIn": { "id": "p_cerny_s", "name": "Černý Š." }, "playerOut": { "id": "p_cermak_a", "name": "Čermák A." } },
      { "id": "sla-86-smrz-okeke-sub", "minute": 86, "team": "away", "type": "substitution", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "playerIn": { "id": "p_smrz_v", "name": "Smrž V." }, "playerOut": { "id": "p_okeke_n", "name": "Okeke N." } },
      { "id": "sla-89-kareem-yellow", "minute": 89, "team": "away", "type": "yellow_card", "player": { "id": "p_kareem_p", "name": "Kareem P." }, "note": "Hrubost" }
    ]
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
    "events": [
      { "id": "duk-5-sylla-yellow", "minute": 5, "team": "away", "type": "yellow_card", "player": { "id": "p_sylla_a", "name": "Sylla A." }, "note": "Hra rukou" },
      { "id": "duk-5-cermak-pen", "minute": 5, "team": "home", "type": "goal", "player": { "id": "p_cermak_m", "name": "Čermák M." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "duk-30-svozil-hasek-sub", "minute": 30, "team": "home", "type": "substitution", "player": { "id": "p_svozil_j", "name": "Svozil J." }, "playerIn": { "id": "p_svozil_j", "name": "Svozil J." }, "playerOut": { "id": "p_hasek_d", "name": "Hašek D." }, "note": "Zranění" },
      { "id": "duk-41-ghali-goal", "minute": 41, "team": "away", "type": "goal", "player": { "id": "p_ghali_a", "name": "Ghali A." }, "scoreUpdate": "1-1" },
      { "id": "duk-46-maly-sylla-sub", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_maly_m", "name": "Malý M." }, "playerIn": { "id": "p_maly_m", "name": "Malý M." }, "playerOut": { "id": "p_sylla_a", "name": "Sylla A." } },
      { "id": "duk-56-cermak-goal", "minute": 56, "team": "home", "type": "goal", "player": { "id": "p_cermak_m", "name": "Čermák M." }, "assistPlayer": { "id": "p_sehovic_z", "name": "Šehovič Z." }, "scoreUpdate": "2-1" },
      { "id": "duk-59-tijani-yellow", "minute": 59, "team": "home", "type": "yellow_card", "player": { "id": "p_tijani_s", "name": "Tijani S." }, "note": "Podražení" },
      { "id": "duk-62-vasulin-goal", "minute": 62, "team": "away", "type": "goal", "player": { "id": "p_vasulin_d", "name": "Vašulín D." }, "assistPlayer": { "id": "p_sip_j", "name": "Šíp J." }, "scoreUpdate": "2-2" },
      { "id": "duk-62-janosek-langer-sub", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_janosek_d", "name": "Janošek D." }, "playerIn": { "id": "p_janosek_d", "name": "Janošek D." }, "playerOut": { "id": "p_langer_s", "name": "Langer Š." } },
      { "id": "duk-70-isife-sehovic-sub", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_isife_s", "name": "Isife S." }, "playerIn": { "id": "p_isife_s", "name": "Isife S." }, "playerOut": { "id": "p_sehovic_z", "name": "Šehovič Z." } },
      { "id": "duk-70-sebrle-cernak-sub", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "playerIn": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "playerOut": { "id": "p_cernak_m", "name": "Černák M." } },
      { "id": "duk-76-hadas-yellow", "minute": 76, "team": "away", "type": "yellow_card", "player": { "id": "p_hadas_m", "name": "Hadaš M." }, "note": "Držení" },
      { "id": "duk-76-mikulenka-sip-sub", "minute": 76, "team": "away", "type": "substitution", "player": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "playerIn": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "playerOut": { "id": "p_sip_j", "name": "Šíp J." } },
      { "id": "duk-84-tijani-breite-sub", "minute": 84, "team": "away", "type": "substitution", "player": { "id": "p_tijani_m", "name": "Tijani M." }, "playerIn": { "id": "p_tijani_m", "name": "Tijani M." }, "playerOut": { "id": "p_breite_r", "name": "Breite R." } },
      { "id": "duk-91-dumitrescu-slavicek-sub", "minute": 91, "team": "away", "type": "substitution", "player": { "id": "p_dumitrescu_a", "name": "Dumitrescu A." }, "playerIn": { "id": "p_dumitrescu_a", "name": "Dumitrescu A." }, "playerOut": { "id": "p_slavicek_f", "name": "Slavíček F." } },
      { "id": "duk-92-zitny-gaszczyk-sub", "minute": 92, "team": "home", "type": "substitution", "player": { "id": "p_zitny_m", "name": "Žitný M." }, "playerIn": { "id": "p_zitny_m", "name": "Žitný M." }, "playerOut": { "id": "p_gaszczyk_p", "name": "Gaszczyk P." } }
    ]
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
    "events": [
      { "id": "tep-6-marecek-yellow", "minute": 6, "team": "home", "type": "yellow_card", "player": { "id": "p_marecek_l", "name": "Mareček L." }, "note": "Podražení" },
      { "id": "tep-13-bilek-pen", "minute": 13, "team": "home", "type": "goal", "player": { "id": "p_bilek_m", "name": "Bílek M." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "tep-46-munksgaard-sehic-sub", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_munksgaard_a", "name": "Munksgaard A." }, "playerIn": { "id": "p_munksgaard_a", "name": "Munksgaard A." }, "playerOut": { "id": "p_sehic_e", "name": "Šehič E." } },
      { "id": "tep-46-pira-jaron-sub", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_pira_j", "name": "Pira J." }, "playerIn": { "id": "p_pira_j", "name": "Pira J." }, "playerOut": { "id": "p_jaron_p", "name": "Jaroň P." } },
      { "id": "tep-60-marecek-yellow", "minute": 60, "team": "home", "type": "yellow_card", "player": { "id": "p_marecek_d", "name": "Mareček D." }, "note": "Nesportovní chování" },
      { "id": "tep-62-pulkrab-yellow", "minute": 62, "team": "home", "type": "yellow_card", "player": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "note": "Nafilmovaný pád" },
      { "id": "tep-66-owusu-musak-sub", "minute": 66, "team": "away", "type": "substitution", "player": { "id": "p_owusu_d", "name": "Owusu D." }, "playerIn": { "id": "p_owusu_d", "name": "Owusu D." }, "playerOut": { "id": "p_musak_a", "name": "Musák A." } },
      { "id": "tep-72-kohut-buchta-sub", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_kohut_m", "name": "Kohút M." }, "playerIn": { "id": "p_kohut_m", "name": "Kohút M." }, "playerOut": { "id": "p_buchta_d", "name": "Buchta D." } },
      { "id": "tep-73-audinis-takacs-sub", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_audinis_n", "name": "Audinis N." }, "playerIn": { "id": "p_audinis_n", "name": "Audinis N." }, "playerOut": { "id": "p_takacs_l", "name": "Takács L." } },
      { "id": "tep-73-kozak-auta-sub", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "playerIn": { "id": "p_kozak_m", "name": "Kozák M." }, "playerOut": { "id": "p_auta_j", "name": "Auta J." } },
      { "id": "tep-73-svanda-riznic-sub", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_svanda_j", "name": "Švanda J." }, "playerIn": { "id": "p_svanda_j", "name": "Švanda J." }, "playerOut": { "id": "p_riznic_m", "name": "Riznič M." } },
      { "id": "tep-74-kozak-yellow", "minute": 74, "team": "home", "type": "yellow_card", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "note": "Hrubost" },
      { "id": "tep-83-drozd-bewene-sub", "minute": 83, "team": "away", "type": "substitution", "player": { "id": "p_drozd_s", "name": "Drozd Š." }, "playerIn": { "id": "p_drozd_s", "name": "Drozd Š." }, "playerOut": { "id": "p_bewene_a", "name": "Bewene A." } },
      { "id": "tep-84-jukl-marecek-sub", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_jukl_r", "name": "Jukl R." }, "playerIn": { "id": "p_jukl_r", "name": "Jukl R." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." }, "note": "Zranění" },
      { "id": "tep-88-fiala-yellow", "minute": 88, "team": "home", "type": "yellow_card", "player": { "id": "p_fiala_z", "name": "Fiala Z." }, "note": "Mimo hřiště" },
      { "id": "tep-90-krejci-pulkrab-sub", "minute": 90, "team": "home", "type": "substitution", "player": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerIn": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerOut": { "id": "p_pulkrab_m", "name": "Pulkrab M." } },
      { "id": "tep-92-owusu-yellow", "minute": 92, "team": "away", "type": "yellow_card", "player": { "id": "p_owusu_d", "name": "Owusu D." }, "note": "Držení" },
      { "id": "tep-96-frydrych-yellow", "minute": 96, "team": "away", "type": "yellow_card", "player": { "id": "p_frydrych_m", "name": "Frydrych M." }, "note": "Nesportovní chování" }
    ]
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
    "events": [
      { "id": "e1", "minute": 53, "team": "home", "type": "goal", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 58, "team": "away", "type": "substitution", "player": { "id": "p_zorvan_f", "name": "Zorvan F." }, "playerIn": { "id": "p_zorvan_f", "name": "Zorvan F." }, "playerOut": { "id": "p_jawo_l", "name": "Jawo L." } },
      { "id": "e3", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerIn": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerOut": { "id": "p_van_buren_m", "name": "van Buren M." } },
      { "id": "e4", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_vlkanova_a", "name": "Vlkanova A." }, "playerIn": { "id": "p_vlkanova_a", "name": "Vlkanova A." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "e5", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerIn": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerOut": { "id": "p_novak_f", "name": "Novák F." } },
      { "id": "e6", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerIn": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerOut": { "id": "p_alegue_a", "name": "Alegue A." } },
      { "id": "e7", "minute": 73, "team": "home", "type": "substitution", "player": { "id": "p_ludvicek_d", "name": "Ludvíček D." }, "playerIn": { "id": "p_ludvicek_d", "name": "Ludvíček D." }, "playerOut": { "id": "p_elbel_j", "name": "Elbel J." }, "note": "Zranění" },
      { "id": "e8", "minute": 83, "team": "away", "type": "substitution", "player": { "id": "p_malensek_m", "name": "Malensek M." }, "playerIn": { "id": "p_malensek_m", "name": "Malensek M." }, "playerOut": { "id": "p_soucek_d", "name": "Souček D." } },
      { "id": "e9", "minute": 83, "team": "away", "type": "substitution", "player": { "id": "p_lavrincik_s", "name": "Lavrinčík S." }, "playerIn": { "id": "p_lavrincik_s", "name": "Lavrinčík S." }, "playerOut": { "id": "p_sedlacek_r", "name": "Sedláček R." } },
      { "id": "e10", "minute": 84, "team": "home", "type": "goal", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "assistPlayer": { "id": "p_darida_v", "name": "Darida V." }, "scoreUpdate": "2-0" },
      { "id": "e11", "minute": 87, "team": "away", "type": "yellow_card", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "note": "Nesportovní chování" },
      { "id": "e12", "minute": 88, "team": "home", "type": "yellow_card", "player": { "id": "p_petrasek_t", "name": "Petrášek T." }, "note": "Faul" },
      { "id": "e13", "minute": 89, "team": "home", "type": "substitution", "player": { "id": "p_griger_a", "name": "Griger A." }, "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_sloncik_t", "name": "Slončík T." } },
      { "id": "e14", "minute": 93, "team": "home", "type": "yellow_card", "player": { "id": "p_horejs_d", "name": "Horejš D." }, "note": "Mimo hřiště" }
    ]
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
    "events": [
      { "id": "e1", "minute": 14, "team": "home", "type": "yellow_card", "player": { "id": "p_frydrych_m", "name": "Frydrych M." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e2", "minute": 31, "team": "away", "type": "substitution", "player": { "id": "p_kadak_j", "name": "Kadák J." }, "playerIn": { "id": "p_kadak_j", "name": "Kadák J." }, "playerOut": { "id": "p_cermak_m", "name": "Čermák M." }, "note": "Zranění" },
      { "id": "e3", "minute": 33, "team": "away", "type": "yellow_card", "player": { "id": "p_hunal_e", "name": "Hunal E." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e4", "minute": 33, "team": "home", "type": "goal", "player": { "id": "p_kricfalusi_o", "name": "Kričfaluši O." }, "assistPlayer": { "id": "p_planka_d", "name": "Planka D." }, "scoreUpdate": "1-0" },
      { "id": "e5", "minute": 40, "team": "home", "type": "goal", "player": { "id": "p_kohut_m", "name": "Kohút M." }, "assistPlayer": { "id": "p_boula_j", "name": "Boula J." }, "scoreUpdate": "2-0" },
      { "id": "e6", "minute": 46, "team": "home", "type": "yellow_card", "player": { "id": "p_kricfalusi_o", "name": "Kričfaluši O." }, "note": "Hrubost" },
      { "id": "e7", "minute": 53, "team": "home", "type": "yellow_card", "player": { "id": "p_kohut_m", "name": "Kohút M." }, "note": "Podražení" },
      { "id": "e8", "minute": 54, "team": "home", "type": "substitution", "player": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "playerIn": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "playerOut": { "id": "p_kohut_m", "name": "Kohút M." } },
      { "id": "e9", "minute": 59, "team": "home", "type": "goal", "player": { "id": "p_boula_j", "name": "Boula J." }, "assistPlayer": { "id": "p_buchta_d", "name": "Buchta D." }, "scoreUpdate": "3-0" },
      { "id": "e10", "minute": 68, "team": "home", "type": "substitution", "player": { "id": "p_owusu_d", "name": "Owusu D." }, "playerIn": { "id": "p_owusu_d", "name": "Owusu D." }, "playerOut": { "id": "p_kricfalusi_o", "name": "Kričfaluši O." } },
      { "id": "e11", "minute": 70, "team": "away", "type": "substitution", "player": { "id": "p_isife_s", "name": "Isife S." }, "playerIn": { "id": "p_isife_s", "name": "Isife S." }, "playerOut": { "id": "p_cernak_m", "name": "Černák M." } },
      { "id": "e12", "minute": 70, "team": "away", "type": "substitution", "player": { "id": "p_kroupa_m", "name": "Kroupa M." }, "playerIn": { "id": "p_kroupa_m", "name": "Kroupa M." }, "playerOut": { "id": "p_pourzitidis_m", "name": "Pourzitidis M." } },
      { "id": "e13", "minute": 70, "team": "away", "type": "substitution", "player": { "id": "p_velasquez_d", "name": "Velasquez D." }, "playerIn": { "id": "p_velasquez_d", "name": "Velasquez D." }, "playerOut": { "id": "p_sehovic_z", "name": "Šehovič Z." } },
      { "id": "e14", "minute": 75, "team": "away", "type": "substitution", "player": { "id": "p_ambler_m", "name": "Ambler M." }, "playerIn": { "id": "p_ambler_m", "name": "Ambler M." }, "playerOut": { "id": "p_gaszczyk_p", "name": "Gaszczyk P." } },
      { "id": "e15", "minute": 83, "team": "home", "type": "substitution", "player": { "id": "p_frydek_ch", "name": "Frýdek Ch." }, "playerIn": { "id": "p_frydek_ch", "name": "Frýdek Ch." }, "playerOut": { "id": "p_buchta_d", "name": "Buchta D." } },
      { "id": "e16", "minute": 83, "team": "home", "type": "substitution", "player": { "id": "p_musak_a", "name": "Musák A." }, "playerIn": { "id": "p_musak_a", "name": "Musák A." }, "playerOut": { "id": "p_pira_j", "name": "Pira J." } },
      { "id": "e17", "minute": 90, "team": "away", "type": "goal", "player": { "id": "p_kroupa_m", "name": "Kroupa M." }, "assistPlayer": { "id": "p_isife_s", "name": "Isife S." }, "scoreUpdate": "3-1" }
    ]
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
    "events": [
      { "id": "e1", "minute": 6, "team": "home", "type": "yellow_card", "player": { "id": "p_bartosak_l", "name": "Bartošák L." }, "note": "Držení" },
      { "id": "e2", "minute": 12, "team": "away", "type": "yellow_card", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "note": "Držení" },
      { "id": "e3", "minute": 33, "team": "home", "type": "yellow_card", "player": { "id": "p_didiba_j", "name": "Didiba J." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e4", "minute": 34, "team": "home", "type": "yellow_card", "player": { "id": "p_cernin_j", "name": "Černín J." }, "note": "Mimo hřiště" },
      { "id": "e5", "minute": 48, "team": "home", "type": "yellow_card", "player": { "id": "p_nombil_c", "name": "Nombil C." }, "note": "Podražení" },
      { "id": "e6", "minute": 54, "team": "away", "type": "goal", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "note": "Penalta", "scoreUpdate": "0-1" },
      { "id": "e7", "minute": 57, "team": "away", "type": "goal", "player": { "id": "p_samko_d", "name": "Samko D." }, "assistPlayer": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "scoreUpdate": "0-2" },
      { "id": "e8", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerIn": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerOut": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e9", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerIn": { "id": "p_hellebrand_t", "name": "Hellebrand T." }, "playerOut": { "id": "p_cupak_m", "name": "Cupák M." } },
      { "id": "e10", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerIn": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerOut": { "id": "p_didiba_j", "name": "Didiba J." } },
      { "id": "e11", "minute": 71, "team": "away", "type": "goal", "player": { "id": "p_bohac_s", "name": "Boháč S." }, "assistPlayer": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "scoreUpdate": "0-3" },
      { "id": "e12", "minute": 74, "team": "home", "type": "goal", "player": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "assistPlayer": { "id": "p_koubek_m", "name": "Koubek M." }, "scoreUpdate": "1-3" },
      { "id": "e13", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerIn": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerOut": { "id": "p_natchkebia_z", "name": "Natchkebia Z." } },
      { "id": "e14", "minute": 76, "team": "away", "type": "yellow_card", "player": { "id": "p_samko_d", "name": "Samko D." }, "note": "Hrubost" },
      { "id": "e15", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_singhateh_e", "name": "Singhateh E." }, "playerIn": { "id": "p_singhateh_e", "name": "Singhateh E." }, "playerOut": { "id": "p_samko_d", "name": "Samko D." } },
      { "id": "e16", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_ezeh_l", "name": "Ezeh L." }, "playerIn": { "id": "p_ezeh_l", "name": "Ezeh L." }, "playerOut": { "id": "p_gning_a", "name": "Gning A." } },
      { "id": "e17", "minute": 83, "team": "home", "type": "substitution", "player": { "id": "p_poznar_t", "name": "Poznar T." }, "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_nombil_c", "name": "Nombil C." } },
      { "id": "e18", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_conde_o", "name": "Conde O." }, "playerIn": { "id": "p_conde_o", "name": "Conde O." }, "playerOut": { "id": "p_sigut_s", "name": "Šigut S." } },
      { "id": "e19", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_chytry_j", "name": "Chytrý J." }, "playerIn": { "id": "p_chytry_j", "name": "Chytrý J." }, "playerOut": { "id": "p_bohac_s", "name": "Boháč S." } },
      { "id": "e20", "minute": 92, "team": "home", "type": "yellow_card", "player": { "id": "p_fukala_m", "name": "Fukala M." }, "note": "Hrubost" },
      { "id": "e21", "minute": 93, "team": "away", "type": "substitution", "player": { "id": "p_valosek_v", "name": "Valošek V." }, "playerIn": { "id": "p_valosek_v", "name": "Valošek V." }, "playerOut": { "id": "p_ayaosi_e", "name": "Ayaosi E." } }
    ]
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
    "events": [
      { "id": "e1", "minute": 13, "team": "home", "type": "yellow_card", "player": { "id": "p_boril_j", "name": "Bořil J." }, "note": "Podražení" },
      { "id": "e2", "minute": 17, "team": "home", "type": "goal", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 37, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "assistPlayer": { "id": "p_doudera_d", "name": "Douděra D." }, "scoreUpdate": "2-0" },
      { "id": "e4", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_svidersky_m", "name": "Šviderský M." }, "playerIn": { "id": "p_svidersky_m", "name": "Šviderský M." }, "playerOut": { "id": "p_ndefe_g", "name": "Ndefe G." } },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerIn": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerOut": { "id": "p_mulder_j", "name": "Mulder J." } },
      { "id": "e6", "minute": 51, "team": "home", "type": "goal_disallowed", "player": { "id": "p_chory_t", "name": "Chorý T." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e7", "minute": 63, "team": "home", "type": "goal", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "assistPlayer": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "scoreUpdate": "3-0" },
      { "id": "e8", "minute": 65, "team": "away", "type": "substitution", "player": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerIn": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerOut": { "id": "p_krmencik_m", "name": "Krmenčík M." } },
      { "id": "e9", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "playerIn": { "id": "p_kusej_v", "name": "Kušej V." }, "playerOut": { "id": "p_provod_l", "name": "Provod L." } },
      { "id": "e10", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_ogbu_i", "name": "Ogbu I." }, "playerIn": { "id": "p_ogbu_i", "name": "Ogbu I." }, "playerOut": { "id": "p_zima_d", "name": "Zima D." } },
      { "id": "e11", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_cham_m", "name": "Cham M." }, "playerIn": { "id": "p_cham_m", "name": "Cham M." }, "playerOut": { "id": "p_jelinek_t", "name": "Jelínek T." } },
      { "id": "e12", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_prekop_e", "name": "Prekop E." }, "playerIn": { "id": "p_prekop_e", "name": "Prekop E." }, "playerOut": { "id": "p_chory_t", "name": "Chorý T." } },
      { "id": "e13", "minute": 76, "team": "home", "type": "yellow_card", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e14", "minute": 79, "team": "away", "type": "substitution", "player": { "id": "p_barat_d", "name": "Barát D." }, "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_reinberk_p", "name": "Reinberk P." } },
      { "id": "e15", "minute": 83, "team": "home", "type": "goal_disallowed", "player": { "id": "p_prekop_e", "name": "Prekop E." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e16", "minute": 84, "team": "home", "type": "substitution", "player": { "id": "p_hashioka_d", "name": "Hashioka D." }, "playerIn": { "id": "p_hashioka_d", "name": "Hashioka D." }, "playerOut": { "id": "p_boril_j", "name": "Bořil J." } }
    ]
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
    "events": [
      { "id": "e1", "minute": 64, "team": "away", "type": "substitution", "player": { "id": "p_auta_j", "name": "Auta J." }, "playerIn": { "id": "p_auta_j", "name": "Auta J." }, "playerOut": { "id": "p_naprstek_m", "name": "Náprstek M." } },
      { "id": "e2", "minute": 66, "team": "home", "type": "substitution", "player": { "id": "p_drchal_v", "name": "Drchal V." }, "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_ramirez_e", "name": "Ramirez E." } },
      { "id": "e3", "minute": 66, "team": "home", "type": "substitution", "player": { "id": "p_kovarik_j", "name": "Kovařík J." }, "playerIn": { "id": "p_kovarik_j", "name": "Kovařík J." }, "playerOut": { "id": "p_zeman_v", "name": "Zeman V." } },
      { "id": "e4", "minute": 73, "team": "away", "type": "substitution", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "playerIn": { "id": "p_kozak_m", "name": "Kozák M." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." } },
      { "id": "e5", "minute": 77, "team": "away", "type": "goal", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "assistPlayer": { "id": "p_jukl_r", "name": "Jukl R." }, "scoreUpdate": "0-1" },
      { "id": "e6", "minute": 79, "team": "home", "type": "substitution", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerIn": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerOut": { "id": "p_kareem_p", "name": "Kareem P." } },
      { "id": "e7", "minute": 79, "team": "home", "type": "substitution", "player": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_sakala_b", "name": "Sakala B." } },
      { "id": "e8", "minute": 81, "team": "away", "type": "yellow_card", "player": { "id": "p_trmal_m", "name": "Trmal M." }, "note": "Nesportovní chování" },
      { "id": "e9", "minute": 81, "team": "home", "type": "yellow_card", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e10", "minute": 85, "team": "away", "type": "substitution", "player": { "id": "p_takacs_l", "name": "Takács L." }, "playerIn": { "id": "p_takacs_l", "name": "Takács L." }, "playerOut": { "id": "p_radosta_m", "name": "Radosta M." } },
      { "id": "e11", "minute": 97, "team": "home", "type": "yellow_card", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "note": "Mimo hřiště" },
      { "id": "e12", "minute": 97, "team": "away", "type": "yellow_card", "player": { "id": "p_auta_j", "name": "Auta J." }, "note": "Mimo hřiště" }
    ]
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
    "events": [
      { "id": "e1", "minute": 12, "team": "away", "type": "yellow_card", "player": { "id": "p_beran_m", "name": "Beran M." }, "note": "Hrubost" },
      { "id": "e2", "minute": 30, "team": "home", "type": "yellow_card", "player": { "id": "p_kayondo_a", "name": "Kayondo A." }, "note": "Hrubost" },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_tijani_m", "name": "Tijani M." }, "playerIn": { "id": "p_tijani_m", "name": "Tijani M." }, "playerOut": { "id": "p_vasulin_d", "name": "Vašulín D." } },
      { "id": "e4", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerIn": { "id": "p_hodous_p", "name": "Hodouš P." }, "playerOut": { "id": "p_dulay_p", "name": "Dulay P." } },
      { "id": "e5", "minute": 63, "team": "away", "type": "yellow_card", "player": { "id": "p_huk_t", "name": "Huk T." }, "note": "Držení, Stop na další zápas" },
      { "id": "e6", "minute": 70, "team": "away", "type": "yellow_card", "player": { "id": "p_sylla_a", "name": "Sylla A." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e7", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_julis_p", "name": "Juliš P." }, "playerIn": { "id": "p_julis_p", "name": "Juliš P." }, "playerOut": { "id": "p_soliu_a", "name": "Soliu A." } },
      { "id": "e8", "minute": 71, "team": "home", "type": "substitution", "player": { "id": "p_letenay_l", "name": "Letenay L." }, "playerIn": { "id": "p_letenay_l", "name": "Letenay L." }, "playerOut": { "id": "p_masek_l", "name": "Mašek L." } },
      { "id": "e9", "minute": 75, "team": "away", "type": "substitution", "player": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "playerIn": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "playerOut": { "id": "p_navratil_j", "name": "Navrátil J." } },
      { "id": "e10", "minute": 75, "team": "away", "type": "substitution", "player": { "id": "p_kliment_j", "name": "Kliment J." }, "playerIn": { "id": "p_kliment_j", "name": "Kliment J." }, "playerOut": { "id": "p_langer_s", "name": "Langer Š." } },
      { "id": "e11", "minute": 79, "team": "home", "type": "substitution", "player": { "id": "p_masopust_l", "name": "Masopust L." }, "playerIn": { "id": "p_masopust_l", "name": "Masopust L." }, "playerOut": { "id": "p_diakite_t", "name": "Diakite T." } },
      { "id": "e12", "minute": 80, "team": "away", "type": "substitution", "player": { "id": "p_slama_j", "name": "Sláma J." }, "playerIn": { "id": "p_slama_j", "name": "Sláma J." }, "playerOut": { "id": "p_sip_j", "name": "Šíp J." } },
      { "id": "e13", "minute": 83, "team": "home", "type": "goal", "player": { "id": "p_icha_m", "name": "Icha M." }, "scoreUpdate": "1-0" },
      { "id": "e14", "minute": 83, "team": "away", "type": "yellow_card", "player": { "id": "p_slama_j", "name": "Sláma J." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e15", "minute": 90, "team": "away", "type": "substitution", "player": { "id": "p_kral_j", "name": "Král J." }, "playerIn": { "id": "p_kral_j", "name": "Král J." }, "playerOut": { "id": "p_slavicek_f", "name": "Slavíček F." } }
    ]
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
    "events": [
      { "id": "e1", "minute": 8, "team": "home", "type": "yellow_card", "player": { "id": "p_cerv_l", "name": "Červ L." }, "note": "Podražení" },
      { "id": "e2", "minute": 25, "team": "away", "type": "yellow_card", "player": { "id": "p_zika_j", "name": "Zíka J." }, "note": "Faul, Stop na další zápas" },
      { "id": "e3", "minute": 26, "team": "home", "type": "yellow_card", "player": { "id": "p_jemelka_v", "name": "Jemelka V." }, "note": "Nesportovní chování" },
      { "id": "e4", "minute": 26, "team": "away", "type": "yellow_card", "player": { "id": "p_langhamer_d", "name": "Langhamer D." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e5", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_valenta_m", "name": "Valenta M." }, "note": "Podražení" },
      { "id": "e6", "minute": 47, "team": "away", "type": "red_card", "player": { "id": "p_langhamer_d", "name": "Langhamer D." }, "note": "Hrubost" },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_memic_a", "name": "Memič A." }, "playerIn": { "id": "p_memic_a", "name": "Memič A." }, "playerOut": { "id": "p_cerv_l", "name": "Červ L." } },
      { "id": "e8", "minute": 47, "team": "home", "type": "goal_disallowed", "player": { "id": "p_souare_c", "name": "Souaré C." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e9", "minute": 59, "team": "home", "type": "goal", "player": { "id": "p_adu_p", "name": "Adu P." }, "assistPlayer": { "id": "p_dweh_s", "name": "Dweh S." }, "scoreUpdate": "1-0" },
      { "id": "e10", "minute": 60, "team": "away", "type": "substitution", "player": { "id": "p_john_s", "name": "John S." }, "playerIn": { "id": "p_john_s", "name": "John S." }, "playerOut": { "id": "p_lehky_f", "name": "Lehký F." } },
      { "id": "e11", "minute": 71, "team": "away", "type": "substitution", "player": { "id": "p_penner_n", "name": "Penner N." }, "playerIn": { "id": "p_penner_n", "name": "Penner N." }, "playerOut": { "id": "p_kostka_d", "name": "Kostka D." } },
      { "id": "e12", "minute": 71, "team": "away", "type": "substitution", "player": { "id": "p_sevcik_m", "name": "Ševčík M." }, "playerIn": { "id": "p_sevcik_m", "name": "Ševčík M." }, "playerOut": { "id": "p_zika_j", "name": "Zíka J." } },
      { "id": "e13", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_vydra_m", "name": "Vydra M." }, "playerIn": { "id": "p_vydra_m", "name": "Vydra M." }, "playerOut": { "id": "p_visinsky_d", "name": "Višinský D." } },
      { "id": "e14", "minute": 72, "team": "home", "type": "substitution", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "playerIn": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "playerOut": { "id": "p_adu_p", "name": "Adu P." } },
      { "id": "e15", "minute": 79, "team": "home", "type": "yellow_card", "player": { "id": "p_havel_m", "name": "Havel M." }, "note": "Faul" },
      { "id": "e16", "minute": 82, "team": "home", "type": "goal", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "assistPlayer": { "id": "p_vydra_m", "name": "Vydra M." }, "scoreUpdate": "2-0" },
      { "id": "e17", "minute": 85, "team": "home", "type": "substitution", "player": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerIn": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerOut": { "id": "p_valenta_m", "name": "Valenta M." } },
      { "id": "e18", "minute": 87, "team": "away", "type": "goal", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "assistPlayer": { "id": "p_sevcik_m", "name": "Ševčík M." }, "scoreUpdate": "2-1" },
      { "id": "e19", "minute": 88, "team": "away", "type": "substitution", "player": { "id": "p_krulich_m", "name": "Krulich M." }, "playerIn": { "id": "p_krulich_m", "name": "Krulich M." }, "playerOut": { "id": "p_vojta_m", "name": "Vojta M." } },
      { "id": "e20", "minute": 88, "team": "away", "type": "substitution", "player": { "id": "p_klima_j", "name": "Klíma J." }, "playerIn": { "id": "p_klima_j", "name": "Klíma J." }, "playerOut": { "id": "p_donat_d", "name": "Donát D." } },
      { "id": "e21", "minute": 89, "team": "away", "type": "yellow_card", "player": { "id": "p_kralik_m", "name": "Králík M." }, "note": "Faul" },
      { "id": "e22", "minute": 96, "team": "home", "type": "substitution", "player": { "id": "p_markovic_s", "name": "Markovič S." }, "playerIn": { "id": "p_markovic_s", "name": "Markovič S." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } }
    ]
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
    "events": [
      { "id": "e1", "minute": 22, "team": "away", "type": "goal", "player": { "id": "p_patrak_v", "name": "Patrák V." }, "assistPlayer": { "id": "p_tanko_a", "name": "Tanko A." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 34, "team": "away", "type": "goal", "player": { "id": "p_smekal_d", "name": "Smékal D." }, "assistPlayer": { "id": "p_tanko_a", "name": "Tanko A." }, "scoreUpdate": "0-2" },
      { "id": "e3", "minute": 35, "team": "home", "type": "substitution", "player": { "id": "p_kaderabek_p", "name": "Kadeřábek P." }, "playerIn": { "id": "p_kaderabek_p", "name": "Kadeřábek P." }, "playerOut": { "id": "p_panak_f", "name": "Panák F." } },
      { "id": "e4", "minute": 35, "team": "home", "type": "substitution", "player": { "id": "p_eneme_s", "name": "Eneme S." }, "playerIn": { "id": "p_eneme_s", "name": "Eneme S." }, "playerOut": { "id": "p_vydra_p", "name": "Vydra P." } },
      { "id": "e5", "minute": 42, "team": "away", "type": "yellow_card", "player": { "id": "p_trouil_j", "name": "Trouil J." }, "note": "Mimo hřiště" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerIn": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerOut": { "id": "p_preciado_a", "name": "Preciado A." } },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_rynes_m", "name": "Ryneš M." }, "playerIn": { "id": "p_rynes_m", "name": "Ryneš M." }, "playerOut": { "id": "p_birmancevic_v", "name": "Birmančevič V." } },
      { "id": "e8", "minute": 47, "team": "home", "type": "yellow_card", "player": { "id": "p_vindahl_p", "name": "Vindahl P." }, "note": "Nesportovní chování" },
      { "id": "e9", "minute": 57, "team": "away", "type": "substitution", "player": { "id": "p_misek_s", "name": "Míšek Š." }, "playerIn": { "id": "p_misek_s", "name": "Míšek Š." }, "playerOut": { "id": "p_solil_t", "name": "Solil T." } },
      { "id": "e10", "minute": 57, "team": "away", "type": "substitution", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "playerIn": { "id": "p_krobot_l", "name": "Krobot L." }, "playerOut": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e11", "minute": 60, "team": "home", "type": "yellow_card", "player": { "id": "p_sevinsky_a", "name": "Ševínský A." }, "note": "Hrubost" },
      { "id": "e12", "minute": 64, "team": "away", "type": "substitution", "player": { "id": "p_masek_d", "name": "Mašek D." }, "playerIn": { "id": "p_masek_d", "name": "Mašek D." }, "playerOut": { "id": "p_saarma_r", "name": "Saarma R." } },
      { "id": "e13", "minute": 64, "team": "away", "type": "yellow_card", "player": { "id": "p_patrak_v", "name": "Patrák V." }, "note": "Zdržování hry" },
      { "id": "e14", "minute": 64, "team": "away", "type": "substitution", "player": { "id": "p_botos_g", "name": "Botos G." }, "playerIn": { "id": "p_botos_g", "name": "Botos G." }, "playerOut": { "id": "p_patrak_v", "name": "Patrák V." } },
      { "id": "e15", "minute": 65, "team": "home", "type": "yellow_card", "player": { "id": "p_kuchta_j", "name": "Kuchta J." }, "note": "Nesportovní chování" },
      { "id": "e16", "minute": 65, "team": "away", "type": "goal", "player": { "id": "p_simek_s", "name": "Šimek S." }, "scoreUpdate": "0-3" },
      { "id": "e17", "minute": 66, "team": "home", "type": "yellow_card", "player": { "id": "p_rynes_m", "name": "Ryneš M." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e18", "minute": 66, "team": "home", "type": "yellow_card", "player": { "id": "p_haraslin_l", "name": "Haraslín L." }, "note": "Nesportovní chování" },
      { "id": "e19", "minute": 66, "team": "away", "type": "yellow_card", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "note": "Nesportovní chování" },
      { "id": "e20", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_kuol_g", "name": "Kuol G." }, "playerIn": { "id": "p_kuol_g", "name": "Kuol G." }, "playerOut": { "id": "p_mercado_j", "name": "Mercado J." } },
      { "id": "e21", "minute": 84, "team": "away", "type": "substitution", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "playerIn": { "id": "p_samuel_v", "name": "Samuel V." }, "playerOut": { "id": "p_tanko_a", "name": "Tanko A." }, "note": "Zranění" },
      { "id": "e22", "minute": 87, "team": "away", "type": "yellow_card", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "note": "Podražení" },
      { "id": "e23", "minute": 90, "team": "home", "type": "goal", "player": { "id": "p_kuchta_j", "name": "Kuchta J." }, "assistPlayer": { "id": "p_kuol_g", "name": "Kuol G." }, "scoreUpdate": "1-3" },
      { "id": "e24", "minute": 95, "team": "home", "type": "goal", "player": { "id": "p_haraslin_l", "name": "Haraslín L." }, "note": "Penalta", "scoreUpdate": "2-3" },
      { "id": "e25", "minute": 98, "team": "away", "type": "goal", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "assistPlayer": { "id": "p_botos_g", "name": "Botos G." }, "scoreUpdate": "2-4" }
    ]
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
    "events": [
      { "id": "e1", "minute": 24, "team": "home", "type": "yellow_card", "player": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e2", "minute": 29, "team": "home", "type": "substitution", "player": { "id": "p_jakubko_j", "name": "Jakubko J." }, "playerIn": { "id": "p_jakubko_j", "name": "Jakubko J." }, "playerOut": { "id": "p_takacs_l", "name": "Takács L." }, "note": "Zranění" },
      { "id": "e3", "minute": 39, "team": "home", "type": "substitution", "player": { "id": "p_trubac_d", "name": "Trubač D." }, "playerIn": { "id": "p_trubac_d", "name": "Trubač D." }, "playerOut": { "id": "p_krejci_l", "name": "Krejčí L." }, "note": "Zranění" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_svanda_j", "name": "Švanda J." }, "playerIn": { "id": "p_svanda_j", "name": "Švanda J." }, "playerOut": { "id": "p_auta_j", "name": "Auta J." } },
      { "id": "e5", "minute": 62, "team": "away", "type": "goal", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "assistPlayer": { "id": "p_provod_l", "name": "Provod L." }, "scoreUpdate": "0-1" },
      { "id": "e6", "minute": 67, "team": "home", "type": "yellow_card", "player": { "id": "p_vecerka_d", "name": "Večerka D." }, "note": "Držení" },
      { "id": "e7", "minute": 68, "team": "away", "type": "goal", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "note": "Penalta", "scoreUpdate": "0-2" },
      { "id": "e8", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerIn": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerOut": { "id": "p_pulkrab_m", "name": "Pulkrab M." } },
      { "id": "e9", "minute": 70, "team": "home", "type": "substitution", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "playerIn": { "id": "p_kozak_m", "name": "Kozák M." }, "playerOut": { "id": "p_radosta_m", "name": "Radosta M." } },
      { "id": "e10", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_vlcek_t", "name": "Vlček T." }, "playerIn": { "id": "p_vlcek_t", "name": "Vlček T." }, "playerOut": { "id": "p_zima_d", "name": "Zima D." } },
      { "id": "e11", "minute": 72, "team": "away", "type": "substitution", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "playerIn": { "id": "p_kusej_v", "name": "Kušej V." }, "playerOut": { "id": "p_prekop_e", "name": "Prekop E." } },
      { "id": "e12", "minute": 77, "team": "away", "type": "yellow_card", "player": { "id": "p_holes_t", "name": "Holeš T." }, "note": "Hrubost" },
      { "id": "e13", "minute": 77, "team": "away", "type": "yellow_card", "player": { "id": "p_sadilek_m", "name": "Sadílek M." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e14", "minute": 81, "team": "away", "type": "substitution", "player": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "playerIn": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "playerOut": { "id": "p_boril_j", "name": "Bořil J." } },
      { "id": "e15", "minute": 81, "team": "away", "type": "substitution", "player": { "id": "p_cham_m", "name": "Cham M." }, "playerIn": { "id": "p_cham_m", "name": "Cham M." }, "playerOut": { "id": "p_moses_d", "name": "Moses D." } },
      { "id": "e16", "minute": 86, "team": "home", "type": "goal", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "assistPlayer": { "id": "p_riznic_m", "name": "Riznič M." }, "scoreUpdate": "1-2" },
      { "id": "e17", "minute": 87, "team": "away", "type": "substitution", "player": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "playerIn": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "playerOut": { "id": "p_chytil_m", "name": "Chytil M." } }
    ]
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
    "events": [
      { "id": "evt-2025-12-06-slo-plz-13-valenta-yellow", "minute": 13, "team": "away", "type": "yellow_card", "player": { "id": "p_valenta_m", "name": "Valenta M." }, "note": "Podražení" },
      { "id": "evt-2025-12-06-slo-plz-22-travnik-yellow", "minute": 22, "team": "home", "type": "yellow_card", "player": { "id": "p_travnik_m", "name": "Trávník M." }, "note": "Podražení" },
      { "id": "evt-2025-12-06-slo-plz-31-mulder-rundic-sub", "minute": 31, "team": "home", "type": "substitution", "player": { "id": "p_mulder_j", "name": "Mulder J." }, "playerIn": { "id": "p_mulder_j", "name": "Mulder J." }, "playerOut": { "id": "p_rundic_m", "name": "Rundič M." }, "note": "Zranění" },
      { "id": "evt-2025-12-06-slo-plz-33-petrzela-goal", "minute": 33, "team": "home", "type": "goal", "player": { "id": "p_petrzela_m", "name": "Petržela M." }, "scoreUpdate": "1-0" },
      { "id": "evt-2025-12-06-slo-plz-48-blahut-goal", "minute": 48, "team": "home", "type": "goal", "player": { "id": "p_blahut_p", "name": "Blahút P." }, "assistPlayer": { "id": "p_danicek_v", "name": "Daníček V." }, "scoreUpdate": "2-0" },
      { "id": "evt-2025-12-06-slo-plz-46-adu-duros-sub", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_adu_p", "name": "Adu P." }, "playerIn": { "id": "p_adu_p", "name": "Adu P." }, "playerOut": { "id": "p_durosinmi_r", "name": "Durosinmi R." } },
      { "id": "evt-2025-12-06-slo-plz-51-adu-yellow", "minute": 51, "team": "away", "type": "yellow_card", "player": { "id": "p_adu_p", "name": "Adu P." }, "note": "Hrubost" },
      { "id": "evt-2025-12-06-slo-plz-54-reinberk-yellow", "minute": 54, "team": "home", "type": "yellow_card", "player": { "id": "p_reinberk_p", "name": "Reinberk P." }, "note": "Hrubost" },
      { "id": "evt-2025-12-06-slo-plz-59-ndefe-reinberk-sub", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_ndefe_g", "name": "Ndefe G." }, "playerIn": { "id": "p_ndefe_g", "name": "Ndefe G." }, "playerOut": { "id": "p_reinberk_p", "name": "Reinberk P." } },
      { "id": "evt-2025-12-06-slo-plz-59-barat-petrzela-sub", "minute": 59, "team": "home", "type": "substitution", "player": { "id": "p_barat_d", "name": "Barát D." }, "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_petrzela_m", "name": "Petržela M." } },
      { "id": "evt-2025-12-06-slo-plz-62-memic-yellow", "minute": 62, "team": "away", "type": "yellow_card", "player": { "id": "p_memic_a", "name": "Memič A." }, "note": "Nesportovní chování" },
      { "id": "evt-2025-12-06-slo-plz-66-zeljkovic-valenta-sub", "minute": 66, "team": "away", "type": "substitution", "player": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerIn": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerOut": { "id": "p_valenta_m", "name": "Valenta M." } },
      { "id": "evt-2025-12-06-slo-plz-66-visinsky-ladra-sub", "minute": 66, "team": "away", "type": "substitution", "player": { "id": "p_visinsky_d", "name": "Višinský D." }, "playerIn": { "id": "p_visinsky_d", "name": "Višinský D." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } },
      { "id": "evt-2025-12-06-slo-plz-68-danicek-goal", "minute": 68, "team": "home", "type": "goal", "player": { "id": "p_danicek_v", "name": "Daníček V." }, "assistPlayer": { "id": "p_ndefe_g", "name": "Ndefe G." }, "scoreUpdate": "3-0" },
      { "id": "evt-2025-12-06-slo-plz-78-svidersky-havlik-sub", "minute": 78, "team": "home", "type": "substitution", "player": { "id": "p_svidersky_m", "name": "Šviderský M." }, "playerIn": { "id": "p_svidersky_m", "name": "Šviderský M." }, "playerOut": { "id": "p_havlik_m", "name": "Havlík M." } },
      { "id": "evt-2025-12-06-slo-plz-78-krmencik-danicek-sub", "minute": 78, "team": "home", "type": "substitution", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerIn": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerOut": { "id": "p_danicek_v", "name": "Daníček V." } },
      { "id": "evt-2025-12-06-slo-plz-82-kabongo-vydra-sub", "minute": 82, "team": "away", "type": "substitution", "player": { "id": "p_kabongo_c", "name": "Kabongo C." }, "playerIn": { "id": "p_kabongo_c", "name": "Kabongo C." }, "playerOut": { "id": "p_vydra_m", "name": "Vydra M." } },
      { "id": "evt-2025-12-06-slo-plz-84-stojcevski-yellow", "minute": 84, "team": "home", "type": "yellow_card", "player": { "id": "p_stojcevski_a", "name": "Stojcevski A." }, "note": "Držení, Stop na další zápas" },
      { "id": "evt-2025-12-06-slo-plz-86-doski-yellow", "minute": 86, "team": "away", "type": "yellow_card", "player": { "id": "p_doski_m", "name": "Doski M." }, "note": "Podražení, Stop na další zápas" },
      { "id": "evt-2025-12-06-slo-plz-90-visinsky-yellow", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_visinsky_d", "name": "Višinský D." }, "note": "Držení, Stop na další zápas" }
    ]
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
    "events": [
      { "id": "e1", "minute": 11, "team": "away", "type": "yellow_card", "player": { "id": "p_kollis_r", "name": "Kollis R." }, "note": "Podražení" },
      { "id": "e2", "minute": 21, "team": "home", "type": "goal_disallowed", "player": { "id": "p_svosil_a", "name": "Svosil A." }, "assistPlayer": { "id": "p_asist", "name": "Asist." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e3", "minute": 24, "team": "home", "type": "yellow_card", "player": { "id": "p_scholz_a", "name": "Scholz A." }, "note": "Podražení" },
      { "id": "e4", "minute": 31, "team": "home", "type": "yellow_card", "player": { "id": "p_kayamba_m", "name": "Kayamba M." }, "note": "Podražení" },
      { "id": "e5", "minute": 34, "team": "home", "type": "goal", "player": { "id": "p_bohac_d", "name": "Boháč D." }, "assistPlayer": { "id": "p_havran_r", "name": "Havran R." }, "scoreUpdate": "1-0" },
      { "id": "e6", "minute": 52, "team": "away", "type": "goal", "player": { "id": "p_kayondo_a", "name": "Kayondo A." }, "assistPlayer": { "id": "p_krollis_r", "name": "Krollis R." }, "scoreUpdate": "1-1" },
      { "id": "e7", "minute": 68, "team": "home", "type": "substitution", "playerIn": { "id": "p_dulby_p", "name": "Dulby P." }, "playerOut": { "id": "p_hodous_p", "name": "Hodouš P." }, "player": { "id": "p_dulby_p", "name": "Dulby P." }, "note": "odchod: Hodouš P." },
      { "id": "e8", "minute": 68, "team": "home", "type": "substitution", "playerIn": { "id": "p_mansak_b", "name": "Mansak B." }, "playerOut": { "id": "p_kayamba_m", "name": "Kayamba M." }, "player": { "id": "p_mansak_b", "name": "Mansak B." }, "note": "odchod: Kayamba M." },
      { "id": "e9", "minute": 74, "team": "away", "type": "yellow_card", "player": { "id": "p_kayondo_a", "name": "Kayondo A." }, "note": "Faul" },
      { "id": "e10", "minute": 75, "team": "home", "type": "yellow_card", "player": { "id": "p_havran_r", "name": "Havran R." }, "note": "Držení" },
      { "id": "e11", "minute": 84, "team": "home", "type": "goal", "player": { "id": "p_buchta_d", "name": "Buchta D." }, "assistPlayer": { "id": "p_havran_r", "name": "Havran R." }, "scoreUpdate": "2-1" },
      { "id": "e12", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_fiala_j", "name": "Fiala J." }, "playerOut": { "id": "p_kristan_j", "name": "Krištan J." }, "player": { "id": "p_fiala_j", "name": "Fiala J." }, "note": "odchod: Krištan J." }
    ]
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
    "events": [
      { "id": "e1", "minute": 6, "team": "home", "type": "goal", "player": { "id": "p_kolarik_j", "name": "Kolářík J." }, "assistPlayer": { "id": "p_vojta_m", "name": "Vojta M." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 23, "team": "away", "type": "goal", "player": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "assistPlayer": { "id": "p_kanu_s", "name": "Kanu S." }, "scoreUpdate": "1-1" },
      { "id": "e3", "minute": 38, "team": "home", "type": "goal", "player": { "id": "p_subert_m", "name": "Šubert M." }, "assistPlayer": { "id": "p_prebsl_f", "name": "Prebsl F." }, "scoreUpdate": "2-1" },
      { "id": "e4", "minute": 41, "team": "away", "type": "yellow_card", "player": { "id": "p_kanu_s", "name": "Kanu S." }, "note": "Podražení" },
      { "id": "e5", "minute": 42, "team": "home", "type": "yellow_card", "player": { "id": "p_sevcik_m", "name": "Ševčík M." }, "note": "Podražení" },
      { "id": "e6", "minute": 43, "team": "home", "type": "goal", "player": { "id": "p_kostka_d", "name": "Kostka D." }, "assistPlayer": { "id": "p_vojta_m", "name": "Vojta M." }, "scoreUpdate": "3-1" },
      { "id": "e7", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "playerIn": { "id": "p_petruta_s", "name": "Petruta S." }, "playerOut": { "id": "p_koubek_m", "name": "Koubek M." } },
      { "id": "e8", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerIn": { "id": "p_branecky_l", "name": "Bránecký L." }, "playerOut": { "id": "p_ulbrich_t", "name": "Ulbrich T." } },
      { "id": "e9", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_poznar_t", "name": "Poznar T." }, "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s", "name": "Kanu S." } },
      { "id": "e10", "minute": 63, "team": "away", "type": "yellow_card", "player": { "id": "p_nombil_c", "name": "Nombil C." }, "note": "Podražení" },
      { "id": "e11", "minute": 66, "team": "away", "type": "yellow_card", "player": { "id": "p_cervenka_b", "name": "Červenka B." }, "note": "Mimo hřiště" },
      { "id": "e12", "minute": 67, "team": "home", "type": "substitution", "player": { "id": "p_john_s", "name": "John S." }, "playerIn": { "id": "p_john_s", "name": "John S." }, "playerOut": { "id": "p_sevcik_m", "name": "Ševčík M." } },
      { "id": "e13", "minute": 67, "team": "home", "type": "substitution", "player": { "id": "p_penner_n", "name": "Penner N." }, "playerIn": { "id": "p_penner_n", "name": "Penner N." }, "playerOut": { "id": "p_matousek_f", "name": "Matoušek F." } },
      { "id": "e14", "minute": 69, "team": "away", "type": "substitution", "player": { "id": "p_machalik_d", "name": "Machalík D." }, "playerIn": { "id": "p_machalik_d", "name": "Machalík D." }, "playerOut": { "id": "p_natchkebia_z", "name": "Natchkebia Z." } },
      { "id": "e15", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_fulnek_j", "name": "Fulnek J." }, "playerIn": { "id": "p_fulnek_j", "name": "Fulnek J." }, "playerOut": { "id": "p_subert_m", "name": "Šubert M." } },
      { "id": "e16", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_klima_j", "name": "Klíma J." }, "playerIn": { "id": "p_klima_j", "name": "Klíma J." }, "playerOut": { "id": "p_vojta_m", "name": "Vojta M." } },
      { "id": "e17", "minute": 83, "team": "away", "type": "substitution", "player": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerIn": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerOut": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e18", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_haliti_j", "name": "Haliti J." }, "playerIn": { "id": "p_haliti_j", "name": "Haliti J." }, "playerOut": { "id": "p_kolarik_j", "name": "Kolářík J." } },
      { "id": "e19", "minute": 89, "team": "home", "type": "yellow_card", "player": { "id": "p_prebsl_f", "name": "Prebsl F." }, "note": "Nesportovní chování" }
    ]
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
    "events": [
      { "id": "e1", "minute": 40, "team": "home", "type": "goal_disallowed", "player": { "id": "p_slavicek_f", "name": "Slavíček F." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e2", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_navratil_j", "name": "Navrátil J." }, "playerIn": { "id": "p_navratil_j", "name": "Navrátil J." }, "playerOut": { "id": "p_mikulenka_m", "name": "Mikulenka M." } },
      { "id": "e3", "minute": 52, "team": "home", "type": "yellow_card", "player": { "id": "p_slavicek_f", "name": "Slavíček F." }, "note": "Držení" },
      { "id": "e4", "minute": 56, "team": "home", "type": "yellow_card", "player": { "id": "p_breite_r", "name": "Breite R." }, "note": "Nesportovní chování, Stop na další zápas" },
      { "id": "e5", "minute": 62, "team": "away", "type": "substitution", "player": { "id": "p_kuol_g", "name": "Kuol G." }, "playerIn": { "id": "p_kuol_g", "name": "Kuol G." }, "playerOut": { "id": "p_birmancevic_v", "name": "Birmančevič V." } },
      { "id": "e6", "minute": 63, "team": "home", "type": "substitution", "player": { "id": "p_kliment_j", "name": "Kliment J." }, "playerIn": { "id": "p_kliment_j", "name": "Kliment J." }, "playerOut": { "id": "p_tijani_m", "name": "Tijani M." } },
      { "id": "e7", "minute": 69, "team": "home", "type": "substitution", "player": { "id": "p_michez_s", "name": "Michez S." }, "playerIn": { "id": "p_michez_s", "name": "Michez S." }, "playerOut": { "id": "p_sip_j", "name": "Šíp J." } },
      { "id": "e8", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_mannsverk_s", "name": "Mannsverk S." }, "playerIn": { "id": "p_mannsverk_s", "name": "Mannsverk S." }, "playerOut": { "id": "p_martinec_j", "name": "Martinec J." }, "note": "Zranění" },
      { "id": "e9", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_sadilek_l", "name": "Sadílek L." }, "playerIn": { "id": "p_sadilek_l", "name": "Sadílek L." }, "playerOut": { "id": "p_eneme_s", "name": "Eneme S." } },
      { "id": "e10", "minute": 78, "team": "home", "type": "substitution", "player": { "id": "p_janosek_d", "name": "Janošek D." }, "playerIn": { "id": "p_janosek_d", "name": "Janošek D." }, "playerOut": { "id": "p_langer_s", "name": "Langer Š." } },
      { "id": "e11", "minute": 82, "team": "away", "type": "yellow_card", "player": { "id": "p_mannsverk_s", "name": "Mannsverk S." }, "note": "Podražení" },
      { "id": "e12", "minute": 83, "team": "away", "type": "substitution", "player": { "id": "p_mercado_j", "name": "Mercado J." }, "playerIn": { "id": "p_mercado_j", "name": "Mercado J." }, "playerOut": { "id": "p_kaderabek_p", "name": "Kadeřábek P." } },
      { "id": "e13", "minute": 88, "team": "away", "type": "goal", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "assistPlayer": { "id": "p_mercado_j", "name": "Mercado J." }, "scoreUpdate": "0-1" }
    ]
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
    "events": [
      { "id": "e1", "minute": 8, "team": "home", "type": "goal_disallowed", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e2", "minute": 21, "team": "away", "type": "yellow_card", "player": { "id": "p_sakala_b", "name": "Sakala B." }, "note": "Hrubost" },
      { "id": "e3", "minute": 43, "team": "away", "type": "yellow_card", "player": { "id": "p_kovarik_j", "name": "Kovařík J." }, "note": "Podražení" },
      { "id": "e4", "minute": 47, "team": "home", "type": "goal", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "scoreUpdate": "1-0" },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_yusuf", "name": "Yusuf" }, "playerIn": { "id": "p_yusuf", "name": "Yusuf" }, "playerOut": { "id": "p_ristovski_m", "name": "Ristovski M." } },
      { "id": "e6", "minute": 46, "team": "away", "type": "substitution", "player": { "id": "p_ramirez_e", "name": "Ramirez E." }, "playerIn": { "id": "p_ramirez_e", "name": "Ramirez E." }, "playerOut": { "id": "p_zeman_v", "name": "Zeman V." } },
      { "id": "e7", "minute": 62, "team": "home", "type": "goal_disallowed", "player": { "id": "p_alegue_a", "name": "Alegue A." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e8", "minute": 66, "team": "home", "type": "substitution", "player": { "id": "p_soucek_d", "name": "Souček D." }, "playerIn": { "id": "p_soucek_d", "name": "Souček D." }, "playerOut": { "id": "p_innocenti_n", "name": "Innocenti N." } },
      { "id": "e9", "minute": 66, "team": "home", "type": "substitution", "player": { "id": "p_rusek_a", "name": "Růsek A." }, "playerIn": { "id": "p_rusek_a", "name": "Růsek A." }, "playerOut": { "id": "p_chramosta_j", "name": "Chramosta J." } },
      { "id": "e10", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_drchal_v", "name": "Drchal V." }, "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_kadlec_a", "name": "Kadlec A." } },
      { "id": "e11", "minute": 67, "team": "away", "type": "substitution", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "playerIn": { "id": "p_smrz_v", "name": "Smrž V." }, "playerOut": { "id": "p_kovarik_j", "name": "Kovařík J." } },
      { "id": "e12", "minute": 75, "team": "home", "type": "substitution", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerIn": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerOut": { "id": "p_jawo_l", "name": "Jawo L." } },
      { "id": "e13", "minute": 80, "team": "away", "type": "yellow_card", "player": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "note": "Držení" },
      { "id": "e14", "minute": 84, "team": "away", "type": "substitution", "player": { "id": "p_plestil_d", "name": "Pleštil D." }, "playerIn": { "id": "p_plestil_d", "name": "Pleštil D." }, "playerOut": { "id": "p_sakala_b", "name": "Sakala B." } },
      { "id": "e15", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_suchan_j", "name": "Suchan J." }, "playerIn": { "id": "p_suchan_j", "name": "Suchan J." }, "playerOut": { "id": "p_alegue_a", "name": "Alegue A." } },
      { "id": "e16", "minute": 87, "team": "home", "type": "substitution", "player": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerIn": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerOut": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e17", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_rusek_a", "name": "Růsek A." }, "note": "Nesportovní chování" }
    ]
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
    "events": [
      { "id": "e1", "minute": 17, "team": "home", "type": "yellow_card", "player": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "note": "Nafilmovaný pád" },
      { "id": "e2", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_kolak_k", "name": "Kolák K." }, "note": "Hrubost" },
      { "id": "e3", "minute": 57, "team": "away", "type": "yellow_card", "player": { "id": "p_bucha_d", "name": "Buchta D." }, "note": "Faul" },
      { "id": "e4", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_zitny_m", "name": "Žitný M." }, "playerOut": { "id": "p_kayamba_m", "name": "Kayamba M." }, "player": { "id": "p_zitny_m", "name": "Žitný M." }, "note": "odchod: Kayamba M." },
      { "id": "e5", "minute": 70, "team": "home", "type": "substitution", "playerIn": { "id": "p_hunal_e", "name": "Hunal E." }, "playerOut": { "id": "p_kollis_r", "name": "Kollis R." }, "player": { "id": "p_hunal_e", "name": "Hunal E." }, "note": "odchod: Kollis R." },
      { "id": "e6", "minute": 80, "team": "away", "type": "yellow_card", "player": { "id": "p_pokorny_v", "name": "Pokorný V." }, "note": "Držení" }
    ]
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
    "events": [
      { "id": "e1", "minute": 32, "team": "home", "type": "yellow_card", "player": { "id": "p_bammens_s", "name": "Bammens S." }, "note": "Držení" },
      { "id": "e2", "minute": 44, "team": "away", "type": "yellow_card", "player": { "id": "p_cech_f", "name": "Čech F." }, "note": "Nesportovní chování" },
      { "id": "e3", "minute": 47, "team": "home", "type": "substitution", "player": { "id": "p_botos_g", "name": "Botos G." }, "playerIn": { "id": "p_botos_g", "name": "Botos G." }, "playerOut": { "id": "p_patrak_v", "name": "Patrák V." }, "note": "Zranění" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "player": { "id": "p_solil_t", "name": "Solil T." }, "playerIn": { "id": "p_solil_t", "name": "Solil T." }, "playerOut": { "id": "p_reznicek_j", "name": "Řezníček J." } },
      { "id": "e5", "minute": 52, "team": "home", "type": "yellow_card", "player": { "id": "p_solil_t", "name": "Solil T." }, "note": "Hrubost" },
      { "id": "e6", "minute": 60, "team": "home", "type": "substitution", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "playerIn": { "id": "p_krobot_l", "name": "Krobot L." }, "playerOut": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e7", "minute": 60, "team": "home", "type": "substitution", "player": { "id": "p_saarma_r", "name": "Saarma R." }, "playerIn": { "id": "p_saarma_r", "name": "Saarma R." }, "playerOut": { "id": "p_sychra_v", "name": "Sychra V." } },
      { "id": "e8", "minute": 70, "team": "away", "type": "substitution", "player": { "id": "p_griger_a", "name": "Griger A." }, "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "e9", "minute": 74, "team": "away", "type": "yellow_card", "player": { "id": "p_elbel_j", "name": "Elbel J." }, "note": "Hrubost" },
      { "id": "e10", "minute": 77, "team": "away", "type": "red_card", "player": { "id": "p_cech_f", "name": "Čech F." }, "note": "Podražení (druhá žlutá)" },
      { "id": "e11", "minute": 79, "team": "home", "type": "goal", "player": { "id": "p_lurvink_l", "name": "Lurvink L." }, "assistPlayer": { "id": "p_simek_s", "name": "Šimek S." }, "scoreUpdate": "1-0" },
      { "id": "e12", "minute": 85, "team": "away", "type": "substitution", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerIn": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerOut": { "id": "p_dancak_s", "name": "Dancák S." } },
      { "id": "e13", "minute": 85, "team": "away", "type": "substitution", "player": { "id": "p_kubr_l", "name": "Kubr L." }, "playerIn": { "id": "p_kubr_l", "name": "Kubr L." }, "playerOut": { "id": "p_ludvicek_d", "name": "Ludvíček D." } },
      { "id": "e14", "minute": 88, "team": "home", "type": "substitution", "player": { "id": "p_misek_s", "name": "Míšek Š." }, "playerIn": { "id": "p_misek_s", "name": "Míšek Š." }, "playerOut": { "id": "p_konecny_m", "name": "Konečný M." } },
      { "id": "e15", "minute": 92, "team": "home", "type": "substitution", "player": { "id": "p_samuel_v", "name": "Samuel V." }, "playerIn": { "id": "p_samuel_v", "name": "Samuel V." }, "playerOut": { "id": "p_tanko_a", "name": "Tanko A." } },
      { "id": "e16", "minute": 94, "team": "home", "type": "yellow_card", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "note": "Zdržování hry, Stop na další zápas" }
    ]
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
    "events": [
      { "id": "e1", "minute": 40, "team": "away", "type": "yellow_card", "player": { "id": "p_mulder_j", "name": "Mulder J." }, "note": "Držení" },
      { "id": "e2", "minute": 41, "team": "away", "type": "yellow_card", "player": { "id": "p_travnik_m", "name": "Trávník M." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e3", "minute": 53, "team": "home", "type": "missed_penalty", "player": { "id": "p_bilek_m", "name": "Bílek M." }, "note": "Neproměněná penalta" },
      { "id": "e4", "minute": 65, "team": "home", "type": "substitution", "player": { "id": "p_naprstek_m", "name": "Náprstek M." }, "playerIn": { "id": "p_naprstek_m", "name": "Náprstek M." }, "playerOut": { "id": "p_trubac_d", "name": "Trubač D." } },
      { "id": "e5", "minute": 65, "team": "home", "type": "substitution", "player": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerIn": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerOut": { "id": "p_auta_j", "name": "Auta J." } },
      { "id": "e6", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerIn": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerOut": { "id": "p_petrzela_m", "name": "Petržela M." } },
      { "id": "e7", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerIn": { "id": "p_kim_seung_bin", "name": "Kim Seung-Bin" }, "playerOut": { "id": "p_danicek_v", "name": "Daníček V." } },
      { "id": "e8", "minute": 77, "team": "away", "type": "substitution", "player": { "id": "p_ndefe_g", "name": "Ndefe G." }, "playerIn": { "id": "p_ndefe_g", "name": "Ndefe G." }, "playerOut": { "id": "p_koscelnik_m", "name": "Koscelník M." } },
      { "id": "e9", "minute": 81, "team": "home", "type": "substitution", "player": { "id": "p_tsykalo_y", "name": "Tsykalo Y." }, "playerIn": { "id": "p_tsykalo_y", "name": "Tsykalo Y." }, "playerOut": { "id": "p_kozak_m", "name": "Kozák M." } },
      { "id": "e10", "minute": 82, "team": "away", "type": "yellow_card", "player": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "note": "Nesportovní chování" },
      { "id": "e11", "minute": 84, "team": "home", "type": "goal", "player": { "id": "p_marecek_d", "name": "Mareček D." }, "scoreUpdate": "1-0" },
      { "id": "e12", "minute": 89, "team": "away", "type": "substitution", "player": { "id": "p_barat_d", "name": "Barát D." }, "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_rundic_m", "name": "Rundič M." } },
      { "id": "e13", "minute": 91, "team": "home", "type": "substitution", "player": { "id": "p_jukl_r", "name": "Jukl R." }, "playerIn": { "id": "p_jukl_r", "name": "Jukl R." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." } }
    ]
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
  },
  {
    "id": "2026-02-14-t_slo-t_boh",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-14T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-14-t_duk-t_zli",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-14T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-14-t_kar-t_sla",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-14T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-14-t_olo-t_plz",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-14T18:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-15-t_par-t_jab",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-15T13:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-15-t_lib-t_ban",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-15T15:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-15-t_mbo-t_tep",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-15T15:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-15-t_spa-t_hrk",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-15T18:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "22",
    "events": []
  },
  {
    "id": "2026-02-21-t_jab-t_kar",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-21T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-21-t_hrk-t_zli",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-21T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-21-t_slo-t_par",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-21T15:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-21-t_sla-t_lib",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-21T18:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-22-t_boh-t_duk",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-22T13:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-22-t_ban-t_mbo",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-22T15:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-22-t_tep-t_olo",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-22T15:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-22-t_plz-t_spa",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-22T18:30:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "23",
    "events": []
  },
  {
    "id": "2026-02-28-t_duk-t_sla",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_spa-t_ban",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_zli-t_plz",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_mbo-t_jab",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_kar-t_slo",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_par-t_tep",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_lib-t_hrk",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-02-28-t_olo-t_boh",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-02-28T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "24",
    "events": []
  },
  {
    "id": "2026-03-07-t_kar-t_par",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_jab-t_olo",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_tep-t_duk",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_hrk-t_plz",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_boh-t_lib",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_ban-t_zli",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_sla-t_spa",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-07-t_slo-t_mbo",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-07T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "25",
    "events": []
  },
  {
    "id": "2026-03-14-t_plz-t_boh",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_duk-t_jab",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_spa-t_slo",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_hrk-t_ban",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_zli-t_sla",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_mbo-t_par",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_olo-t_kar",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-14-t_lib-t_tep",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-14T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "26",
    "events": []
  },
  {
    "id": "2026-03-21-t_slo-t_duk",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_kar-t_mbo",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_boh-t_spa",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_par-t_zli",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_jab-t_lib",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_ban-t_plz",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_tep-t_hrk",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-03-21-t_sla-t_olo",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-03-21T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "27",
    "events": []
  },
  {
    "id": "2026-04-04-t_plz-t_tep",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_spa-t_kar",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_lib-t_slo",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_duk-t_par",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_hrk-t_boh",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_olo-t_mbo",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_ban-t_sla",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-04-t_zli-t_jab",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-04T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "28",
    "events": []
  },
  {
    "id": "2026-04-11-t_boh-t_zli",
    "homeTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_tep-t_spa",
    "homeTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_jab-t_ban",
    "homeTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_slo-t_hrk",
    "homeTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_mbo-t_duk",
    "homeTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_sla-t_plz",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_kar-t_lib",
    "homeTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-11-t_par-t_olo",
    "homeTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-11T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "29",
    "events": []
  },
  {
    "id": "2026-04-18-t_ban-t_boh",
    "homeTeam": { "id": "t_ban", "name": "FC Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians Praha 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_zli-t_tep",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "FK Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_lib-t_mbo",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "FK Mladá Boleslav", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_duk-t_kar",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "MFK Karviná", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_spa-t_jab",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "FK Jablonec", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_olo-t_slo",
    "homeTeam": { "id": "t_olo", "name": "SK Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "1. FC Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_hrk-t_sla",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
    "events": []
  },
  {
    "id": "2026-04-18-t_plz-t_par",
    "homeTeam": { "id": "t_plz", "name": "FC Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "FK Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "scheduled",
    "date": "2026-04-18T12:00:00Z",
    "stadium": "",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "30",
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
