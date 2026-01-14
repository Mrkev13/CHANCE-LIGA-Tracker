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
    player?: {
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
    "events": [
      { "id": "e1", "minute": 5, "team": "away", "type": "goal", "player": { "id": "p_cedidla_m", "name": "Cedidla M." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 60, "team": "home", "type": "substitution", "playerIn": { "id": "p_jawo_l", "name": "Jawo L." }, "playerOut": { "id": "p_puskac_d", "name": "Puškač D." } },
      { "id": "e3", "minute": 60, "team": "home", "type": "substitution", "playerIn": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerOut": { "id": "p_alegue_a", "name": "Alegue A." } },
      { "id": "e4", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_flala_j", "name": "Flala J." }, "playerOut": { "id": "p_samko_d", "name": "Samko D." } },
      { "id": "e5", "minute": 77, "team": "away", "type": "goal", "player": { "id": "p_rusek_a", "name": "Růšek A." }, "assistPlayer": { "id": "p_novak_f", "name": "Novák F." }, "scoreUpdate": "0-2" },
      { "id": "e6", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_conde_o", "name": "Conde O." }, "playerOut": { "id": "p_singhateh_e", "name": "Singhateh E." } },
      { "id": "e7", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_fleisman_j", "name": "Fleisman J." }, "playerOut": { "id": "p_chytry_j", "name": "Chytrý J." } },
      { "id": "e8", "minute": 85, "team": "home", "type": "goal", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "note": "Penalta", "scoreUpdate": "1-2" },
      { "id": "e9", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_innocenti_n", "name": "Innocenti N." }, "playerOut": { "id": "p_tekijaski_n", "name": "Tekijaški N." }, "note": "Zranění" },
      { "id": "e10", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_stepanek_d", "name": "Štěpánek D." }, "playerOut": { "id": "p_sedlacek_r", "name": "Sedláček R." } },
      { "id": "e11", "minute": 95, "team": "away", "type": "yellow_card", "player": { "id": "p_puskac_d", "name": "Puškač D." }, "note": "Hrubost" }
    ]
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
    "events": [
      { "id": "e1", "minute": 6, "team": "away", "type": "yellow_card", "player": { "id": "p_dweh_s", "name": "Dweh S." }, "note": "Hrubost" },
      { "id": "e2", "minute": 42, "team": "home", "type": "yellow_card", "player": { "id": "p_preciado_a", "name": "Preciado A." }, "note": "Hrubost" },
      { "id": "e3", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_adu_p", "name": "Adu P." }, "note": "Podražení" },
      { "id": "e4", "minute": 53, "team": "away", "type": "goal", "player": { "id": "p_vydra_m", "name": "Vydra M." }, "assistPlayer": { "id": "p_memic_a", "name": "Memič A." }, "scoreUpdate": "0-1" },
      { "id": "e5", "minute": 56, "team": "home", "type": "goal", "player": { "id": "p_mercado_j", "name": "Mercado J." }, "assistPlayer": { "id": "p_vydra_p", "name": "Vydra P." }, "scoreUpdate": "1-1" },
      { "id": "e6", "minute": 60, "team": "home", "type": "yellow_card", "player": { "id": "p_sorensen_a", "name": "Sørensen A." }, "note": "Držení" },
      { "id": "e7", "minute": 64, "team": "home", "type": "substitution", "playerIn": { "id": "p_kuchta_j", "name": "Kuchta J." }, "playerOut": { "id": "p_zeleny_j", "name": "Zelený J." } },
      { "id": "e8", "minute": 64, "team": "away", "type": "substitution", "playerIn": { "id": "p_vlisinsky_d", "name": "Vlisinský D." }, "playerOut": { "id": "p_adu_p", "name": "Adu P." } },
      { "id": "e9", "minute": 76, "team": "away", "type": "red_card", "player": { "id": "p_vydra_m", "name": "Vydra M." }, "note": "Podražení" },
      { "id": "e10", "minute": 78, "team": "home", "type": "goal", "player": { "id": "p_birmancevic_v", "name": "Birmančevič V." }, "note": "Penalta", "scoreUpdate": "2-1" },
      { "id": "e11", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_kaderabek_p", "name": "Kadeřábek P." }, "playerOut": { "id": "p_preciado_a", "name": "Preciado A." } },
      { "id": "e12", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_spacil_k", "name": "Spáčil K." }, "playerOut": { "id": "p_doski_m", "name": "Doski M." } },
      { "id": "e13", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_memic_a", "name": "Memič A." }, "playerOut": { "id": "p_havel_m", "name": "Havel M." } },
      { "id": "e14", "minute": 80, "team": "home", "type": "yellow_card", "player": { "id": "p_mercado_j", "name": "Mercado J." }, "note": "Hrubost" },
      { "id": "e15", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_souare_c", "name": "Souaré C." }, "playerOut": { "id": "p_valenta_m", "name": "Valenta M." } },
      { "id": "e16", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_dweh_s", "name": "Dweh S." }, "playerOut": { "id": "p_kabongo_c", "name": "Kabongo C." } },
      { "id": "e17", "minute": 87, "team": "home", "type": "substitution", "playerIn": { "id": "p_eneme_s", "name": "Eneme S." }, "playerOut": { "id": "p_rrahmani_a", "name": "Rrahmani A." } },
      { "id": "e18", "minute": 87, "team": "home", "type": "substitution", "playerIn": { "id": "p_rynes_m", "name": "Rynes M." }, "playerOut": { "id": "p_mercado_j", "name": "Mercado J." }, "note": "Zranění" }
    ]
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
    "events": [
      { "id": "e1", "minute": 24, "team": "home", "type": "yellow_card", "player": { "id": "p_sehovis_z", "name": "Šehovič Z." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e2", "minute": 26, "team": "away", "type": "goal", "player": { "id": "p_cermak_a", "name": "Čermák A." }, "assistPlayer": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 32, "team": "away", "type": "yellow_card", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "note": "Podražení" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_diallo_b", "name": "Diallo B." }, "playerOut": { "id": "p_cisse_n", "name": "Cisse N." } },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_ambler_m", "name": "Ambler M." }, "playerOut": { "id": "p_sehovis_z", "name": "Šehovič Z." } },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_jedlicka_t", "name": "Jedlička T." }, "playerOut": { "id": "p_zitny_m", "name": "Žitný M." } },
      { "id": "e7", "minute": 60, "team": "away", "type": "substitution", "playerIn": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerOut": { "id": "p_hybs_m", "name": "Hybš M." } },
      { "id": "e8", "minute": 67, "team": "away", "type": "goal", "player": { "id": "p_zeman_v", "name": "Zeman V." }, "assistPlayer": { "id": "p_cermak_a", "name": "Čermák A." }, "scoreUpdate": "0-2" },
      { "id": "e9", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_fokam_j", "name": "Fokam J." }, "playerOut": { "id": "p_isife_s", "name": "Isife S." } },
      { "id": "e10", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_plestil_d", "name": "Pleštil D." }, "playerOut": { "id": "p_zeman_v", "name": "Zeman V." } },
      { "id": "e11", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_okeke_n", "name": "Okeke N." } },
      { "id": "e12", "minute": 77, "team": "home", "type": "yellow_card", "player": { "id": "p_diallo_b", "name": "Diallo B." }, "note": "Podražení" },
      { "id": "e13", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "playerOut": { "id": "p_kadak_j", "name": "Kadák J." } },
      { "id": "e14", "minute": 83, "team": "home", "type": "red_card", "player": { "id": "p_pourzitlidis_m", "name": "Pourzitlidis M." }, "note": "Hrubost" },
      { "id": "e15", "minute": 85, "team": "away", "type": "yellow_card", "player": { "id": "p_hybs_m", "name": "Hybš M." }, "note": "Podražení" },
      { "id": "e16", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_hruby_r", "name": "Hrubý R." }, "playerOut": { "id": "p_cermak_a", "name": "Čermák A." } },
      { "id": "e17", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_kareem_p", "name": "Kareem P." } }
    ]
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
    "events": [
      { "id": "e1", "minute": 9, "team": "away", "type": "yellow_card", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Podražení" },
      { "id": "e2", "minute": 14, "team": "home", "type": "goal", "player": { "id": "p_hodous_p", "name": "Hodouš P." }, "assistPlayer": { "id": "p_mikula_j", "name": "Mikula J." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 20, "team": "home", "type": "yellow_card", "player": { "id": "p_kozeluh_j", "name": "Koželuh J." }, "note": "Držení, Stop na další zápas" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_spatenka_f", "name": "Špatenka F." }, "playerOut": { "id": "p_soliu_a", "name": "Soliu A." } },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_sadilek_m", "name": "Sadílek M." }, "playerOut": { "id": "p_cham_m", "name": "Cham M." } },
      { "id": "e6", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_moses_d", "name": "Moses D." }, "playerOut": { "id": "p_vorlicky_l", "name": "Vorlický L." } },
      { "id": "e7", "minute": 58, "team": "home", "type": "yellow_card", "player": { "id": "p_n_guessan_a", "name": "N'Guessan A." }, "note": "Nesportovní chování" },
      { "id": "e8", "minute": 58, "team": "home", "type": "substitution", "playerIn": { "id": "p_kayondo_a", "name": "Kayondo A." }, "playerOut": { "id": "p_hodous_p", "name": "Hodouš P." } },
      { "id": "e9", "minute": 58, "team": "home", "type": "substitution", "playerIn": { "id": "p_krollis_r", "name": "Krollis R." }, "playerOut": { "id": "p_masek_l", "name": "Mašek L." } },
      { "id": "e10", "minute": 59, "team": "away", "type": "substitution", "playerIn": { "id": "p_chytil_m", "name": "Chytil M." }, "playerOut": { "id": "p_schranz_i", "name": "Schranz I." } },
      { "id": "e11", "minute": 59, "team": "away", "type": "substitution", "playerIn": { "id": "p_hashioka_d", "name": "Hashioka D." }, "playerOut": { "id": "p_provod_l", "name": "Provod L." } },
      { "id": "e12", "minute": 60, "team": "away", "type": "substitution", "playerIn": { "id": "p_mbodji_y", "name": "Mbodji Y." }, "playerOut": { "id": "p_zmrzly_o", "name": "Zmrzlý O." } },
      { "id": "e13", "minute": 69, "team": "home", "type": "substitution", "playerIn": { "id": "p_mahmic_e", "name": "Mahmić E." }, "playerOut": { "id": "p_stransky_v", "name": "Stránský V." } },
      { "id": "e14", "minute": 70, "team": "away", "type": "yellow_card", "player": { "id": "p_zmrzly_o", "name": "Zmrzlý O." }, "note": "Hrubost" },
      { "id": "e15", "minute": 75, "team": "away", "type": "substitution", "playerIn": { "id": "p_prekop_e", "name": "Prekop E." }, "playerOut": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Zraněn" },
      { "id": "e16", "minute": 79, "team": "away", "type": "yellow_card", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "note": "Hrubost" },
      { "id": "e17", "minute": 81, "team": "home", "type": "substitution", "playerIn": { "id": "p_icha_m", "name": "Icha M." }, "playerOut": { "id": "p_hlavaty_m", "name": "Hlavatý M." } },
      { "id": "e18", "minute": 81, "team": "home", "type": "substitution", "playerIn": { "id": "p_plechaty_d", "name": "Plechatý D." }, "playerOut": { "id": "p_masopust_l", "name": "Masopust L." } },
      { "id": "e19", "minute": 87, "team": "away", "type": "goal", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "assistPlayer": { "id": "p_prekop_e", "name": "Prekop E." }, "scoreUpdate": "1-1" },
      { "id": "e20", "minute": 97, "team": "home", "type": "yellow_card", "player": { "id": "p_kayondo_a", "name": "Kayondo A." }, "note": "Nesportovní chování" }
    ]
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
    "events": [
      { "id": "e1", "minute": 2, "team": "away", "type": "goal", "player": { "id": "p_pira_j", "name": "Pira J." }, "assistPlayer": { "id": "p_planka_d", "name": "Planka D." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 39, "team": "home", "type": "yellow_card", "player": { "id": "p_macek_r", "name": "Macek R." }, "note": "Podražení" },
      { "id": "e3", "minute": 47, "team": "away", "type": "yellow_card", "player": { "id": "p_kristalusi_o", "name": "Křišťaluši O." }, "note": "Nesportovní chování" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_john_s", "name": "John S." }, "playerOut": { "id": "p_penner_n", "name": "Penner N." } },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_pech_da", "name": "Pech Da." }, "playerOut": { "id": "p_macek_r", "name": "Macek R." } },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_lehky_f", "name": "Lehký F." }, "playerOut": { "id": "p_langhamer_d", "name": "Langhamer D." } },
      { "id": "e7", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_frydek_ch", "name": "Frýdek Ch." }, "playerOut": { "id": "p_musak_a", "name": "Musák A." } },
      { "id": "e8", "minute": 65, "team": "away", "type": "yellow_card", "player": { "id": "p_lischka_d", "name": "Lischka D." }, "note": "Podražení" },
      { "id": "e9", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_krulich_m", "name": "Krulich M." }, "playerOut": { "id": "p_klima_j", "name": "Klíma J." } },
      { "id": "e10", "minute": 73, "team": "away", "type": "substitution", "playerIn": { "id": "p_havran_m", "name": "Havran M." }, "playerOut": { "id": "p_buchta_d", "name": "Buchta D." } },
      { "id": "e11", "minute": 76, "team": "away", "type": "yellow_card", "player": { "id": "p_planka_d", "name": "Planka D." }, "note": "Hrubost" },
      { "id": "e12", "minute": 84, "team": "home", "type": "substitution", "playerIn": { "id": "p_kolarek_j", "name": "Kolářek J." }, "playerOut": { "id": "p_prebsl_f", "name": "Prebsl F." } },
      { "id": "e13", "minute": 87, "team": "home", "type": "goal", "player": { "id": "p_sevcik_m", "name": "Ševčík M." }, "note": "Penalta", "scoreUpdate": "1-1" },
      { "id": "e14", "minute": 88, "team": "away", "type": "substitution", "playerIn": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "playerOut": { "id": "p_pira_j", "name": "Pira J." } },
      { "id": "e15", "minute": 88, "team": "away", "type": "substitution", "playerIn": { "id": "p_sehic_e", "name": "Šehič E." }, "playerOut": { "id": "p_plavsic_s", "name": "Plavšić Š." } },
      { "id": "e16", "minute": 89, "team": "away", "type": "yellow_card", "player": { "id": "p_musak_a", "name": "Musák A." }, "note": "Podražení" }
    ]
  },
{
    "id": "2025-09-27-hradec-liberec",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 2, "away": 3 },
    "status": "finished",
    "date": "2025-09-27T18:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 11, "team": "home", "type": "goal", "player": { "id": "p_petrasek_t", "name": "Petrášek T." }, "assistPlayer": { "id": "p_vikanova_a", "name": "Vlkanova A." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 17, "team": "away", "type": "goal", "player": { "id": "p_masek_l", "name": "Mašek L." }, "scoreUpdate": "1-1" },
      { "id": "e3", "minute": 20, "team": "home", "type": "yellow_card", "player": { "id": "p_cihak_f", "name": "Čihák F." }, "note": "Hrubost" },
      { "id": "e4", "minute": 39, "team": "away", "type": "yellow_card", "player": { "id": "p_masek_l", "name": "Mašek L." }, "note": "Podražení" },
      { "id": "e5", "minute": 40, "team": "home", "type": "goal", "player": { "id": "p_vikanova_a", "name": "Vlkanova A." }, "assistPlayer": { "id": "p_horak_d", "name": "Horák D." }, "scoreUpdate": "2-1" },
      { "id": "e6", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "note": "Mimo hřiště" },
      { "id": "e7", "minute": 47, "team": "home", "type": "yellow_card", "player": { "id": "p_vikanova_a", "name": "Vlkanova A." }, "note": "Držení" },
      { "id": "e8", "minute": 57, "team": "away", "type": "yellow_card", "player": { "id": "p_hodous_p", "name": "Hodouš P." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e9", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_julis_p", "name": "Juliš P." }, "playerOut": { "id": "p_hodous_p", "name": "Hodouš P." } },
      { "id": "e10", "minute": 64, "team": "home", "type": "substitution", "playerIn": { "id": "p_sojka_a", "name": "Sojka A." }, "playerOut": { "id": "p_sloncik_t", "name": "Slončík T." } },
      { "id": "e11", "minute": 65, "team": "away", "type": "goal", "player": { "id": "p_mahmic_e", "name": "Mahmić E." }, "assistPlayer": { "id": "p_mikula_j", "name": "Mikula J." }, "scoreUpdate": "2-2" },
      { "id": "e12", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_pilař_v", "name": "Pilař V." }, "playerOut": { "id": "p_vikanova_a", "name": "Vlkanova A." } },
      { "id": "e13", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_mihalik_o", "name": "Mihálik O." } },
      { "id": "e14", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_soliu_a", "name": "Soliu A." }, "playerOut": { "id": "p_spatenka_f", "name": "Špatenka F." } },
      { "id": "e15", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_stransky_v", "name": "Stránský V." }, "playerOut": { "id": "p_masopust_l", "name": "Masopust L." } },
      { "id": "e16", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_krollis_r", "name": "Krollis R." }, "playerOut": { "id": "p_masek_l", "name": "Mašek L." } },
      { "id": "e17", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_icha_m", "name": "Icha M." }, "playerOut": { "id": "p_mahmic_e", "name": "Mahmić E." } },
      { "id": "e18", "minute": 89, "team": "away", "type": "goal", "player": { "id": "p_mikula_j", "name": "Mikula J." }, "assistPlayer": { "id": "p_soliu_a", "name": "Soliu A." }, "scoreUpdate": "2-3" },
      { "id": "e19", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_hodek_j", "name": "Hodek J." }, "playerOut": { "id": "p_dancak_s", "name": "Dancák S." } },
      { "id": "e20", "minute": 92, "team": "home", "type": "yellow_card", "player": { "id": "p_pauk_l", "name": "Pauk L." }, "note": "Mimo hřiště, Nesportovní chování" }
    ]
  },
  {
    "id": "2025-09-27-bohemians-sigma",
    "homeTeam": { "id": "t_boh", "name": "Bohemians 1905", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "score": { "home": 2, "away": 2 },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 3, "team": "home", "type": "goal", "player": { "id": "p_ristovski_m", "name": "Ristovski M." }, "assistPlayer": { "id": "p_zeman_v", "name": "Zeman V." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 17, "team": "away", "type": "goal", "player": { "id": "p_vasulin_d", "name": "Vašulín D." }, "assistPlayer": { "id": "p_sylla_a", "name": "Sylla A." }, "scoreUpdate": "1-1" },
      { "id": "e3", "minute": 18, "team": "away", "type": "goal", "player": { "id": "p_vasulin_d", "name": "Vašulín D." }, "scoreUpdate": "1-2" },
      { "id": "e4", "minute": 23, "team": "away", "type": "substitution", "playerIn": { "id": "p_huk_t", "name": "Huk T." }, "playerOut": { "id": "p_kral_j", "name": "Král J." }, "note": "Zranění" },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "playerOut": { "id": "p_vasulin_d", "name": "Vašulín D." } },
      { "id": "e6", "minute": 59, "team": "home", "type": "yellow_card", "player": { "id": "p_vondra_j", "name": "Vondra J." }, "note": "Držení" },
      { "id": "e7", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_plestil_d", "name": "Pleštil D." } },
      { "id": "e8", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_kadlec_a", "name": "Kadlec A." }, "playerOut": { "id": "p_kareem_p", "name": "Kareem P." } },
      { "id": "e9", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_sakala_b", "name": "Sakala B." }, "playerOut": { "id": "p_okeke_n", "name": "Okeke N." } },
      { "id": "e10", "minute": 65, "team": "home", "type": "goal", "player": { "id": "p_yusuf", "name": "Yusuf" }, "assistPlayer": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "scoreUpdate": "2-2" },
      { "id": "e11", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_hadas_m", "name": "Hadaš M." }, "playerOut": { "id": "p_slavicek_f", "name": "Slavíček F." } },
      { "id": "e12", "minute": 81, "team": "home", "type": "substitution", "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_hruby_r", "name": "Hrubý R." } },
      { "id": "e13", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_navratil_j", "name": "Navrátil J." }, "playerOut": { "id": "p_dolnikov_a", "name": "Dolžnikov A." } },
      { "id": "e14", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_kostadinov_t", "name": "Kostadinov T." }, "playerOut": { "id": "p_breite_r", "name": "Breite R." } },
      { "id": "e15", "minute": 87, "team": "home", "type": "substitution", "playerIn": { "id": "p_kovarik_j", "name": "Kovařík J." }, "playerOut": { "id": "p_zeman_v", "name": "Zeman V." } },
      { "id": "e16", "minute": 88, "team": "away", "type": "yellow_card", "player": { "id": "p_huk_t", "name": "Huk T." }, "note": "Podražení" }
    ]
  },
  {
    "id": "2025-09-28-plzen-zlin",
    "homeTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "Zlín", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-09-28T18:30:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 27, "team": "away", "type": "goal", "player": { "id": "p_cupak_m", "name": "Cupák M." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 30, "team": "home", "type": "missed_penalty", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Neproměněná penalta" },
      { "id": "e3", "minute": 38, "team": "home", "type": "yellow_card", "player": { "id": "p_souare_c", "name": "Souaré C." }, "note": "Hrubost" },
      { "id": "e4", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_pisoja_m", "name": "Pišoja M." }, "note": "Nesportovní chování" },
      { "id": "e5", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_doski_m", "name": "Doski M." }, "note": "Nesportovní chování" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_memic_a", "name": "Memič A." }, "playerOut": { "id": "p_havel_m", "name": "Havel M." } },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_doski_m", "name": "Doski M." }, "playerOut": { "id": "p_spacil_k", "name": "Spáčil K." } },
      { "id": "e8", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_souare_c", "name": "Souaré C." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } },
      { "id": "e9", "minute": 59, "team": "away", "type": "yellow_card", "player": { "id": "p_kolar_j", "name": "Kolář J." }, "note": "Podražení" },
      { "id": "e10", "minute": 63, "team": "away", "type": "substitution", "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s", "name": "Kanu S." } },
      { "id": "e11", "minute": 66, "team": "home", "type": "substitution", "playerIn": { "id": "p_visinsky_d", "name": "Višinský D." }, "playerOut": { "id": "p_kabongo_c", "name": "Kabongo C." } },
      { "id": "e12", "minute": 74, "team": "away", "type": "substitution", "playerIn": { "id": "p_petruta_s", "name": "Petruta S." }, "playerOut": { "id": "p_pisoja_m", "name": "Pišoja M." } },
      { "id": "e13", "minute": 74, "team": "away", "type": "substitution", "playerIn": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerOut": { "id": "p_nombil_c", "name": "Nombil C." } },
      { "id": "e14", "minute": 83, "team": "away", "type": "substitution", "playerIn": { "id": "p_krapka_a", "name": "Křapka A." }, "playerOut": { "id": "p_kalabiska_j", "name": "Kalabiška J." } },
      { "id": "e15", "minute": 83, "team": "away", "type": "substitution", "playerIn": { "id": "p_machalik_d", "name": "Machalík D." }, "playerOut": { "id": "p_didiba_j", "name": "Didiba J." } },
      { "id": "e16", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_adu_p", "name": "Adu P." }, "playerOut": { "id": "p_hejda_l", "name": "Hejda L." } },
      { "id": "e17", "minute": 89, "team": "home", "type": "yellow_card", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Úder loktem" },
      { "id": "e18", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-09-28-teplice-pardubice",
    "homeTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-09-28T13:00:00Z",
    "stadium": "Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 25, "team": "home", "type": "yellow_card", "player": { "id": "p_krejci_l", "name": "Krejčí L." }, "note": "Hrubost" },
      { "id": "e2", "minute": 39, "team": "away", "type": "yellow_card", "player": { "id": "p_lurvink_l", "name": "Lurvink L." }, "note": "Podražení" },
      { "id": "e3", "minute": 57, "team": "away", "type": "substitution", "playerIn": { "id": "p_vecheta_f", "name": "Vechéta F." }, "playerOut": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e4", "minute": 61, "team": "home", "type": "substitution", "playerIn": { "id": "p_fortelny_j", "name": "Fortelný J." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." } },
      { "id": "e5", "minute": 61, "team": "home", "type": "substitution", "playerIn": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerOut": { "id": "p_kozak_m", "name": "Kozák M." } },
      { "id": "e6", "minute": 61, "team": "home", "type": "substitution", "playerIn": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerOut": { "id": "p_trubac_d", "name": "Trubač D." } },
      { "id": "e7", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_tanko_a", "name": "Tanko A." }, "playerOut": { "id": "p_teah_d", "name": "Teah D." } },
      { "id": "e8", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_sychra_v", "name": "Sychra V." }, "playerOut": { "id": "p_lexa_m", "name": "Lexa M." } },
      { "id": "e9", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_bammens_s", "name": "Bammens S." }, "playerOut": { "id": "p_patrak_v", "name": "Patrák V." } },
      { "id": "e10", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_simek_s", "name": "Šimek S." }, "playerOut": { "id": "p_reznicek_j", "name": "Řezníček J." } },
      { "id": "e11", "minute": 84, "team": "home", "type": "substitution", "playerIn": { "id": "p_auta_j", "name": "Auta J." }, "playerOut": { "id": "p_radosta_m", "name": "Radosta M." } },
      { "id": "e12", "minute": 86, "team": "home", "type": "substitution", "playerIn": { "id": "p_riznic_m", "name": "Riznič M." }, "playerOut": { "id": "p_tsykalo_y", "name": "Tsykalo Y." } }
    ]
  },
  {
    "id": "2025-09-26-slavia-dukla",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-09-26T19:00:00Z",
    "stadium": "Eden Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 24, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "assistPlayer": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 33, "team": "home", "type": "yellow_card", "player": { "id": "p_chory_t", "name": "Chorý T." }, "note": "Nesportovní chování" },
      { "id": "e3", "minute": 40, "team": "home", "type": "goal", "player": { "id": "p_chory_t", "name": "Chorý T." }, "note": "Penalta", "scoreUpdate": "2-0" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_moses_d", "name": "Moses D." }, "playerOut": { "id": "p_dorley_o", "name": "Dorley O." } },
      { "id": "e5", "minute": 56, "team": "away", "type": "yellow_card", "player": { "id": "p_cermak_m", "name": "Čermák M." }, "note": "Podražení" },
      { "id": "e6", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_cisse_n", "name": "Cisse N." }, "playerOut": { "id": "p_cermak_m", "name": "Čermák M." } },
      { "id": "e7", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_kadak_j", "name": "Kadák J." }, "playerOut": { "id": "p_isife_s", "name": "Isife S." } },
      { "id": "e8", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_velasquez_d", "name": "Velasquez D." }, "playerOut": { "id": "p_zitny_m", "name": "Žitný M." } },
      { "id": "e9", "minute": 69, "team": "home", "type": "substitution", "playerIn": { "id": "p_prekop_e", "name": "Prekop E." }, "playerOut": { "id": "p_chory_t", "name": "Chorý T." } },
      { "id": "e10", "minute": 69, "team": "home", "type": "substitution", "playerIn": { "id": "p_vorlicky_l", "name": "Vorlický L." }, "playerOut": { "id": "p_cham_m", "name": "Cham M." } },
      { "id": "e11", "minute": 74, "team": "home", "type": "substitution", "playerIn": { "id": "p_schranz_l", "name": "Schranz L." }, "playerOut": { "id": "p_zmrzly_o", "name": "Zmrzlý O." } },
      { "id": "e12", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_tijani_s", "name": "Tijani S." }, "playerOut": { "id": "p_peterka_j", "name": "Peterka J." } },
      { "id": "e13", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "playerOut": { "id": "p_jedlicka_t", "name": "Jedlička T." } },
      { "id": "e14", "minute": 87, "team": "home", "type": "substitution", "playerIn": { "id": "p_vlcak_t", "name": "Vlček T." }, "playerOut": { "id": "p_kusej_v", "name": "Kušej V." } },
      { "id": "e15", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_hunal_e", "name": "Hunal E." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-09-27-banik-sparta",
    "homeTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 3 },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "Městský stadion Ostrava",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 12, "team": "home", "type": "yellow_card", "player": { "id": "p_chalus_m", "name": "Chaluš M." }, "note": "Držení" },
      { "id": "e2", "minute": 14, "team": "away", "type": "goal", "player": { "id": "p_panak_f", "name": "Panák F." }, "assistPlayer": { "id": "p_kairinen_k", "name": "Kairinen K." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 26, "team": "away", "type": "goal", "player": { "id": "p_birmancevic_v", "name": "Birmančevič V." }, "assistPlayer": { "id": "p_vydra_p", "name": "Vydra P." }, "scoreUpdate": "0-2" },
      { "id": "e4", "minute": 35, "team": "away", "type": "goal", "player": { "id": "p_mercado_j", "name": "Mercado J." }, "assistPlayer": { "id": "p_vydra_p", "name": "Vydra P." }, "scoreUpdate": "0-3" },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_planka_d", "name": "Planka D." }, "playerOut": { "id": "p_plavsic_s", "name": "Plavšič S." } },
      { "id": "e6", "minute": 48, "team": "away", "type": "yellow_card", "player": { "id": "p_uchenna_e", "name": "Uchenna E." }, "note": "Podražení" },
      { "id": "e7", "minute": 59, "team": "away", "type": "yellow_card", "player": { "id": "p_kairinen_k", "name": "Kairinen K." }, "note": "Zdržování hry" },
      { "id": "e8", "minute": 64, "team": "away", "type": "substitution", "playerIn": { "id": "p_kuchta_j", "name": "Kuchta J." }, "playerOut": { "id": "p_rrahmani_a", "name": "Rrahmani A." } },
      { "id": "e9", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_martinec_j", "name": "Martinec J." }, "playerOut": { "id": "p_uchenna_e", "name": "Uchenna E." } },
      { "id": "e10", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_mannsverk_s", "name": "Mannsverk S." }, "playerOut": { "id": "p_kairinen_k", "name": "Kairinen K." } },
      { "id": "e11", "minute": 77, "team": "home", "type": "substitution", "playerIn": { "id": "p_owusu_d", "name": "Owusu D." }, "playerOut": { "id": "p_frydek_ch", "name": "Frýdek Ch." } },
      { "id": "e12", "minute": 77, "team": "home", "type": "substitution", "playerIn": { "id": "p_bewene_a", "name": "Bewene A." }, "playerOut": { "id": "p_munkagaard_a", "name": "Munkagaard A." } },
      { "id": "e13", "minute": 77, "team": "home", "type": "substitution", "playerIn": { "id": "p_almasi_l", "name": "Almási L." }, "playerOut": { "id": "p_pira_j", "name": "Pira J." } },
      { "id": "e14", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_kuol_g", "name": "Kuol G." }, "playerOut": { "id": "p_mercado_j", "name": "Mercado J." } },
      { "id": "e15", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeleny_j", "name": "Zelený J." }, "playerOut": { "id": "p_panak_f", "name": "Panák F." } },
      { "id": "e16", "minute": 89, "team": "home", "type": "yellow_card", "player": { "id": "p_boula_j", "name": "Boula J." }, "note": "Držení" }
    ]
  },
  {
    "id": "2025-09-27-slovacko-karvina",
    "homeTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "Karviná", "logo": "" },
    "score": { "home": 1, "away": 2 },
    "status": "finished",
    "date": "2025-09-27T15:00:00Z",
    "stadium": "MFS Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 10, "team": "away", "type": "goal", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "assistPlayer": { "id": "p_labik_a", "name": "Labík A." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 17, "team": "home", "type": "goal", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "note": "Vlastní gól", "scoreUpdate": "1-1" },
      { "id": "e3", "minute": 35, "team": "away", "type": "red_card", "player": { "id": "p_buzek_a", "name": "Bůžek A." }, "note": "Hrubost" },
      { "id": "e4", "minute": 39, "team": "away", "type": "yellow_card", "player": { "id": "p_storman_r", "name": "Štorman R." }, "note": "Podražení" },
      { "id": "e5", "minute": 43, "team": "home", "type": "yellow_card", "player": { "id": "p_svidersky_m", "name": "Šviderský M." }, "note": "Nafilmovaný pád" },
      { "id": "e6", "minute": 45, "team": "away", "type": "goal", "player": { "id": "p_storman_r", "name": "Štorman R." }, "scoreUpdate": "1-2" },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_marinelli_a", "name": "Marinelli A." } },
      { "id": "e8", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_petrzela_m", "name": "Petržela M." }, "playerOut": { "id": "p_koscelnik_m", "name": "Koscelník M." } },
      { "id": "e9", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerOut": { "id": "p_havlik_m", "name": "Havlík M." } },
      { "id": "e10", "minute": 58, "team": "home", "type": "yellow_card", "player": { "id": "p_danicek_v", "name": "Daníček V." }, "note": "Podražení" },
      { "id": "e11", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_fiala_j", "name": "Fiala J." }, "playerOut": { "id": "p_gning_a", "name": "Gning A." } },
      { "id": "e12", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_ezeh_l", "name": "Ezeh L." }, "playerOut": { "id": "p_samko_d", "name": "Samko D." } },
      { "id": "e13", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_stojcevski_a", "name": "Stojcevski A." }, "playerOut": { "id": "p_danicek_v", "name": "Daníček V." } },
      { "id": "e14", "minute": 75, "team": "away", "type": "substitution", "playerIn": { "id": "p_chytry_j", "name": "Chytrý J." }, "playerOut": { "id": "p_singhateh_e", "name": "Singhateh E." } },
      { "id": "e15", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_krmencik_m", "name": "Krmenčík M." }, "playerOut": { "id": "p_medved_z", "name": "Medved Ž." } },
      { "id": "e16", "minute": 80, "team": "home", "type": "yellow_card", "player": { "id": "p_barat_d", "name": "Barát D." }, "note": "Držení" },
      { "id": "e17", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_kristan_j", "name": "Křišťan J." }, "playerOut": { "id": "p_storman_r", "name": "Štorman R." } }
    ]
  },
  {
    "id": "2025-09-28-jablonec-boleslav",
    "homeTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-09-28T15:30:00Z",
    "stadium": "Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "10",
    "events": [
      { "id": "e1", "minute": 18, "team": "away", "type": "substitution", "playerIn": { "id": "p_donat_d", "name": "Donát D." }, "playerOut": { "id": "p_kralik_m", "name": "Králik M." }, "note": "Zranění" },
      { "id": "e2", "minute": 21, "team": "away", "type": "yellow_card", "player": { "id": "p_langhamer_d", "name": "Langhamer D." }, "note": "Faul" },
      { "id": "e3", "minute": 30, "team": "home", "type": "yellow_card", "player": { "id": "p_nebyla_s", "name": "Nebyla S." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e4", "minute": 36, "team": "away", "type": "yellow_card", "player": { "id": "p_zika_j", "name": "Zika J." }, "note": "Podražení" },
      { "id": "e5", "minute": 37, "team": "home", "type": "goal", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "e6", "minute": 50, "team": "away", "type": "yellow_card", "player": { "id": "p_pech_da", "name": "Pech Da." }, "note": "Držení" },
      { "id": "e7", "minute": 51, "team": "home", "type": "yellow_card", "player": { "id": "p_zorvan_f", "name": "Zorvan F." }, "note": "Nesportovní chování" },
      { "id": "e8", "minute": 60, "team": "home", "type": "goal", "player": { "id": "p_chramosta_j", "name": "Chramosta J." }, "note": "Penalta", "scoreUpdate": "2-0" },
      { "id": "e9", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_kolarik_j", "name": "Kolářík J." }, "playerOut": { "id": "p_langhamer_d", "name": "Langhamer D." } },
      { "id": "e10", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_macek_r", "name": "Macek R." }, "playerOut": { "id": "p_pech_da", "name": "Pech Da." } },
      { "id": "e11", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_penner_n", "name": "Penner N." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e12", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_innocenti_n", "name": "Innocenti N." }, "playerOut": { "id": "p_novak_f", "name": "Novák F." } },
      { "id": "e13", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_alegue_a", "name": "Alegue A." }, "playerOut": { "id": "p_chramosta_j", "name": "Chramosta J." } },
      { "id": "e14", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_rusek_a", "name": "Růsek A." }, "playerOut": { "id": "p_puskac_d", "name": "Puškáč D." } },
      { "id": "e15", "minute": 77, "team": "home", "type": "yellow_card", "player": { "id": "p_alegue_a", "name": "Alegue A." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e16", "minute": 79, "team": "away", "type": "yellow_card", "player": { "id": "p_prebsl_f", "name": "Prebsl F." }, "note": "Držení" },
      { "id": "e17", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_suchan_j", "name": "Suchan J." }, "playerOut": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e18", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_krulich_m", "name": "Krulich M." }, "playerOut": { "id": "p_kostka_d", "name": "Kostka D." } },
      { "id": "e19", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_malensek_m", "name": "Malensek M." }, "playerOut": { "id": "p_nebyla_s", "name": "Nebyla S." } }
    ]
  },
  {
    "id": "2025-10-01-pardubice-banik",
    "homeTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-10-01T18:00:00Z",
    "stadium": "CFIG Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "5",
    "events": [
      { "id": "e1", "minute": 6, "team": "home", "type": "yellow_card", "player": { "id": "p_simek_d", "name": "Šimek D." }, "note": "Podražení" },
      { "id": "e2", "minute": 11, "team": "away", "type": "yellow_card", "player": { "id": "p_havran_m", "name": "Havran M." }, "note": "Podražení" },
      { "id": "e3", "minute": 37, "team": "home", "type": "yellow_card", "player": { "id": "p_simek_d", "name": "Šimek D." }, "note": "Podražení" },
      { "id": "e4", "minute": 42, "team": "away", "type": "yellow_card", "player": { "id": "p_holzer_d", "name": "Holzer D." }, "note": "Podražení" },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_buchta_d", "name": "Buchta D." }, "playerOut": { "id": "p_havran_m", "name": "Havran M." } },
      { "id": "e6", "minute": 51, "team": "away", "type": "yellow_card", "player": { "id": "p_munkagaard_a", "name": "Munkagaard A." }, "note": "Hrubost" },
      { "id": "e7", "minute": 59, "team": "away", "type": "substitution", "playerIn": { "id": "p_almasi_l", "name": "Almási L." }, "playerOut": { "id": "p_plavsic_s", "name": "Plavšič S." } },
      { "id": "e8", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_bammens_s", "name": "Bammens S." }, "playerOut": { "id": "p_teah_d", "name": "Teah D." } },
      { "id": "e9", "minute": 70, "team": "away", "type": "yellow_card", "player": { "id": "p_planka_d", "name": "Planka D." }, "note": "Hrubost" },
      { "id": "e10", "minute": 70, "team": "away", "type": "yellow_card", "player": { "id": "p_frydrych_m", "name": "Frydrych M." }, "note": "Nesportovní chování" },
      { "id": "e11", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_lexa_m", "name": "Lexa M." }, "playerOut": { "id": "p_simek_s", "name": "Šimek S." } },
      { "id": "e12", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_vecheta_f", "name": "Vechéta F." }, "playerOut": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e13", "minute": 75, "team": "away", "type": "substitution", "playerIn": { "id": "p_frydek_ch", "name": "Frýdek Ch." }, "playerOut": { "id": "p_munkagaard_a", "name": "Munkagaard A." } },
      { "id": "e14", "minute": 75, "team": "away", "type": "substitution", "playerIn": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "playerOut": { "id": "p_pira_j", "name": "Pira J." } },
      { "id": "e15", "minute": 78, "team": "away", "type": "goal", "player": { "id": "p_almasi_l", "name": "Almási L." }, "assistPlayer": { "id": "p_planka_d", "name": "Planka D." }, "scoreUpdate": "0-1" },
      { "id": "e16", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_sancl_f", "name": "Šancl F." }, "playerOut": { "id": "p_reznicek_j", "name": "Řezníček J." } },
      { "id": "e17", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_tanko_a", "name": "Tanko A." }, "playerOut": { "id": "p_botos_g", "name": "Botoš G." } },
      { "id": "e18", "minute": 89, "team": "away", "type": "yellow_card", "player": { "id": "p_almasi_l", "name": "Almási L." }, "note": "Držení" },
      { "id": "e19", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "note": "Faul" },
      { "id": "e20", "minute": 91, "team": "away", "type": "substitution", "playerIn": { "id": "p_sehic_e", "name": "Šehič E." }, "playerOut": { "id": "p_holzer_d", "name": "Holzer D." } },
      { "id": "e21", "minute": 94, "team": "away", "type": "yellow_card", "player": { "id": "p_budinsky_v", "name": "Budinský V." }, "note": "Zdržování hry" }
    ]
  },
{
    "id": "2025-10-04-boleslav-slovacko",
    "homeTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "Lokotrans Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 18, "team": "away", "type": "substitution", "playerIn": { "id": "p_hamza_j", "name": "Hamza J." }, "playerOut": { "id": "p_vasko_f", "name": "Vaško F." }, "note": "Zranění" },
      { "id": "e2", "minute": 59, "team": "home", "type": "substitution", "playerIn": { "id": "p_koscelnik_m", "name": "Koscelník M." }, "playerOut": { "id": "p_barat_d", "name": "Barát D." } },
      { "id": "e3", "minute": 59, "team": "home", "type": "substitution", "playerIn": { "id": "p_juroska_p", "name": "Juroška P." }, "playerOut": { "id": "p_marinelli_a", "name": "Marinelli A." } },
      { "id": "e4", "minute": 63, "team": "away", "type": "substitution", "playerIn": { "id": "p_penner_n", "name": "Penner N." }, "playerOut": { "id": "p_kolarik_j", "name": "Kolářík J." } },
      { "id": "e5", "minute": 63, "team": "away", "type": "substitution", "playerIn": { "id": "p_langhamer_d", "name": "Langhamer D." }, "playerOut": { "id": "p_sevcik_m", "name": "Ševčík M." } },
      { "id": "e6", "minute": 68, "team": "away", "type": "yellow_card", "player": { "id": "p_prebsl_f", "name": "Prebsl F." }, "note": "Hrubost" },
      { "id": "e7", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_prebsl_f", "name": "Prebsl F." }, "playerOut": { "id": "p_subert_m", "name": "Šubert M." } },
      { "id": "e8", "minute": 86, "team": "home", "type": "substitution", "playerIn": { "id": "p_ceesay_o", "name": "Ceesay O." }, "playerOut": { "id": "p_medved_z", "name": "Medved Ž." } },
      { "id": "e9", "minute": 86, "team": "home", "type": "substitution", "playerIn": { "id": "p_reinberk_p", "name": "Reinberk P." }, "playerOut": { "id": "p_blahut_p", "name": "Blahút P." } },
      { "id": "e10", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_lehky_f", "name": "Lehký F." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e11", "minute": 89, "team": "home", "type": "yellow_card", "player": { "id": "p_borsk_j", "name": "Borský J." }, "note": "Zdržování hry" }
    ]
  },
  {
    "id": "2025-10-04-liberec-bohemians",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians 1905", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-04T18:00:00Z",
    "stadium": "Stadion u Nisy",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 13, "team": "away", "type": "yellow_card", "player": { "id": "p_vondra_j", "name": "Vondra J." }, "note": "Držení, Stop na další zápas" },
      { "id": "e2", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_soliu_a", "name": "Soliu A." }, "playerOut": { "id": "p_julis_p", "name": "Juliš P." } },
      { "id": "e3", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeman_v", "name": "Zeman V." }, "playerOut": { "id": "p_drchal_v", "name": "Drchal V." } },
      { "id": "e4", "minute": 70, "team": "away", "type": "yellow_card", "player": { "id": "p_kadlec_a", "name": "Kadlec A." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e5", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_masek_l", "name": "Mašek L." }, "playerOut": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "e6", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_maxopust_l", "name": "Masopust L." }, "playerOut": { "id": "p_stransky_v", "name": "Stránský V." } },
      { "id": "e7", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_ramirez_e", "name": "Ramirez E." }, "playerOut": { "id": "p_ristovski_m", "name": "Ristovski M." } },
      { "id": "e8", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_kareem_p", "name": "Kareem P." }, "playerOut": { "id": "p_kadlec_a", "name": "Kadlec A." }, "note": "Zranění" },
      { "id": "e9", "minute": 82, "team": "away", "type": "yellow_card", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "note": "Držení" },
      { "id": "e10", "minute": 85, "team": "home", "type": "substitution", "playerIn": { "id": "p_spatenka_f", "name": "Špatenka F." }, "playerOut": { "id": "p_rus_d", "name": "Rus D." } },
      { "id": "e11", "minute": 89, "team": "away", "type": "substitution", "playerIn": { "id": "p_hybs_m", "name": "Hybš M." }, "playerOut": { "id": "p_zeman_v", "name": "Zeman V." }, "note": "Zranění" }
    ]
  },
  {
    "id": "2025-10-04-dukla-teplice",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "score": { "home": 1, "away": 3 },
    "status": "finished",
    "date": "2025-10-04T15:00:00Z",
    "stadium": "Stadion Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 21, "team": "away", "type": "yellow_card", "player": { "id": "p_radosta_m", "name": "Radosta M." }, "note": "Hrubost" },
      { "id": "e2", "minute": 23, "team": "home", "type": "goal", "player": { "id": "p_cermak_m", "name": "Čermák M." }, "assistPlayer": { "id": "p_kadak_j", "name": "Kadák J." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 45, "team": "away", "type": "goal", "player": { "id": "p_bilek_m", "name": "Bílek M." }, "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 57, "team": "home", "type": "red_card", "player": { "id": "p_peterka_j", "name": "Peterka J." }, "note": "Hrubost" },
      { "id": "e5", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_sebrle_s", "name": "Šebrle Š." }, "playerOut": { "id": "p_velasquez_d", "name": "Velasquez D." } },
      { "id": "e6", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_jedlicka_t", "name": "Jedlička T." }, "playerOut": { "id": "p_cermak_m", "name": "Čermák M." } },
      { "id": "e7", "minute": 58, "team": "home", "type": "yellow_card", "player": { "id": "p_holoubek_d", "name": "Holoubek D." }, "note": "Mimo hřiště" },
      { "id": "e8", "minute": 59, "team": "away", "type": "yellow_card", "player": { "id": "p_marecek_d", "name": "Mareček D." }, "note": "Faul" },
      { "id": "e9", "minute": 60, "team": "home", "type": "substitution", "playerIn": { "id": "p_kadak_j", "name": "Kadák J." }, "playerOut": { "id": "p_zitny_m", "name": "Žitný M." } },
      { "id": "e10", "minute": 66, "team": "away", "type": "substitution", "playerIn": { "id": "p_fortelny_j", "name": "Fortelný J." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." }, "note": "Zranění" },
      { "id": "e11", "minute": 71, "team": "away", "type": "goal", "player": { "id": "p_kozak_m", "name": "Kozák M." }, "assistPlayer": { "id": "p_audinis_n", "name": "Audinis N." }, "scoreUpdate": "1-2" },
      { "id": "e12", "minute": 76, "team": "away", "type": "substitution", "playerIn": { "id": "p_nyarko_b", "name": "Nyarko B." }, "playerOut": { "id": "p_radosta_m", "name": "Radosta M." } },
      { "id": "e13", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_isife_s", "name": "Isife S." }, "playerOut": { "id": "p_fokam_j", "name": "Fokam J." } },
      { "id": "e14", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_diallo_b", "name": "Diallo B." }, "playerOut": { "id": "p_kroupa_m", "name": "Kroupa M." } },
      { "id": "e15", "minute": 83, "team": "away", "type": "goal", "player": { "id": "p_nyarko_b", "name": "Nyarko B." }, "assistPlayer": { "id": "p_auta_j", "name": "Auta J." }, "scoreUpdate": "1-3" },
      { "id": "e16", "minute": 83, "team": "home", "type": "yellow_card", "player": { "id": "p_kozma_d", "name": "Kozma D." }, "note": "Faul" },
      { "id": "e17", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_krejci_l", "name": "Krejčí L." }, "playerOut": { "id": "p_kozak_m", "name": "Kozák M." } },
      { "id": "e18", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_krejci_l", "name": "Krejčí L." }, "note": "Držení" }
    ]
  },
  {
    "id": "2025-10-05-sparta-slavia",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-10-05T18:30:00Z",
    "stadium": "epet ARENA",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 6, "team": "home", "type": "goal_disallowed", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e2", "minute": 11, "team": "away", "type": "yellow_card", "player": { "id": "p_dorley_o", "name": "Dorley O." }, "note": "Držení" },
      { "id": "e3", "minute": 15, "team": "away", "type": "goal", "player": { "id": "p_kusej_v", "name": "Kušej V." }, "assistPlayer": { "id": "p_cham_m", "name": "Cham M." }, "scoreUpdate": "0-1" },
      { "id": "e4", "minute": 31, "team": "away", "type": "yellow_card", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Podražení" },
      { "id": "e5", "minute": 32, "team": "home", "type": "yellow_card", "player": { "id": "p_kuchta_j", "name": "Kuchta J." }, "note": "Mimo hřiště" },
      { "id": "e6", "minute": 33, "team": "home", "type": "yellow_card", "player": { "id": "p_vydra_p", "name": "Vydra P." }, "note": "Nesportovní chování" },
      { "id": "e7", "minute": 35, "team": "home", "type": "yellow_card", "player": { "id": "p_rynes_m", "name": "Ryneš M." }, "note": "Nesportovní chování" },
      { "id": "e8", "minute": 35, "team": "away", "type": "yellow_card", "player": { "id": "p_vlcek_t", "name": "Vlček T." }, "note": "Nesportovní chování" },
      { "id": "e9", "minute": 45, "team": "home", "type": "goal", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "scoreUpdate": "1-1" },
      { "id": "e10", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_vydra_p", "name": "Vydra P." }, "playerOut": { "id": "p_mannsverk_s", "name": "Mannsverk S." } },
      { "id": "e11", "minute": 52, "team": "away", "type": "substitution", "playerIn": { "id": "p_provod_l", "name": "Provod L." }, "playerOut": { "id": "p_cham_m", "name": "Cham M." } },
      { "id": "e12", "minute": 60, "team": "home", "type": "yellow_card", "player": { "id": "p_mannsverk_s", "name": "Mannsverk S." }, "note": "Hrubost" },
      { "id": "e13", "minute": 66, "team": "away", "type": "red_card", "player": { "id": "p_vlcek_t", "name": "Vlček T." }, "note": "Podražení" },
      { "id": "e14", "minute": 68, "team": "away", "type": "substitution", "playerIn": { "id": "p_vorlicky_l", "name": "Vorlický L." }, "playerOut": { "id": "p_kusej_v", "name": "Kušej V." } },
      { "id": "e15", "minute": 68, "team": "away", "type": "substitution", "playerIn": { "id": "p_moses_d", "name": "Moses D." }, "playerOut": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Zranění" },
      { "id": "e16", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerOut": { "id": "p_kuchta_j", "name": "Kuchta J." } },
      { "id": "e17", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_mercado_j", "name": "Mercado J." }, "playerOut": { "id": "p_haraslin_l", "name": "Haraslín L." } },
      { "id": "e18", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_zmrzly_o", "name": "Zmrzlý O." }, "playerOut": { "id": "p_schranz_i", "name": "Schranz I." } },
      { "id": "e19", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_sadilek_m", "name": "Sadílek M." }, "playerOut": { "id": "p_zafeiris_c", "name": "Zafeiris C." } },
      { "id": "e20", "minute": 79, "team": "away", "type": "yellow_card", "player": { "id": "p_moses_d", "name": "Moses D." }, "note": "Podražení" }
    ]
  },
  {
    "id": "2025-10-05-plzen-hradec",
    "homeTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 3, "away": 3 },
    "status": "finished",
    "date": "2025-10-05T15:30:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 12, "team": "away", "type": "goal", "player": { "id": "p_mihalik_o", "name": "Mihálik O." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 18, "team": "home", "type": "yellow_card", "player": { "id": "p_spacil_k", "name": "Spáčil K." }, "note": "Podražení" },
      { "id": "e3", "minute": 19, "team": "away", "type": "yellow_card", "player": { "id": "p_darida_v", "name": "Darida V." }, "note": "Podražení" },
      { "id": "e4", "minute": 34, "team": "home", "type": "yellow_card", "player": { "id": "p_havel_m", "name": "Havel M." }, "note": "Hrubost" },
      { "id": "e5", "minute": 35, "team": "home", "type": "yellow_card", "player": { "id": "p_adu_p", "name": "Adu P." }, "note": "Hrubost" },
      { "id": "e6", "minute": 39, "team": "away", "type": "red_card", "player": { "id": "p_petrasek_t", "name": "Petrášek T." }, "note": "Faul, Stop na další zápas" },
      { "id": "e7", "minute": 45, "team": "home", "type": "goal", "player": { "id": "p_adu_p", "name": "Adu P." }, "scoreUpdate": "1-1" },
      { "id": "e8", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_spacil_k", "name": "Spáčil K." }, "playerOut": { "id": "p_dweh_s", "name": "Dweh S." } },
      { "id": "e9", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_souare_c", "name": "Souaré C." }, "playerOut": { "id": "p_doski_m", "name": "Doski M." } },
      { "id": "e10", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_mihalik_o", "name": "Mihálik O." } },
      { "id": "e11", "minute": 50, "team": "away", "type": "goal", "player": { "id": "p_pilar_v", "name": "Pilař V." }, "assistPlayer": { "id": "p_darida_v", "name": "Darida V." }, "scoreUpdate": "1-2" },
      { "id": "e12", "minute": 54, "team": "away", "type": "red_card", "player": { "id": "p_horejs_d", "name": "Horejš D." }, "note": "Mimo hřiště" },
      { "id": "e13", "minute": 56, "team": "home", "type": "missed_penalty", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Neproměněná penalta" },
      { "id": "e14", "minute": 58, "team": "away", "type": "substitution", "playerIn": { "id": "p_kucera_j", "name": "Kučera J." }, "playerOut": { "id": "p_chvatal_j", "name": "Chvátal J." }, "note": "Zranění" },
      { "id": "e15", "minute": 58, "team": "home", "type": "substitution", "playerIn": { "id": "p_havel_m", "name": "Havel M." }, "playerOut": { "id": "p_memic_a", "name": "Memič A." } },
      { "id": "e16", "minute": 58, "team": "home", "type": "substitution", "playerIn": { "id": "p_ladra_t", "name": "Ladra T." }, "playerOut": { "id": "p_vlkanovsky_d", "name": "Vlkanovský D." } },
      { "id": "e17", "minute": 64, "team": "home", "type": "yellow_card", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Hrubost" },
      { "id": "e18", "minute": 69, "team": "home", "type": "substitution", "playerIn": { "id": "p_paluska_j", "name": "Paluska J." }, "playerOut": { "id": "p_kabongo_c", "name": "Kabongo C." } },
      { "id": "e19", "minute": 69, "team": "away", "type": "substitution", "playerIn": { "id": "p_uhrincat_j", "name": "Uhrinčať J." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "e20", "minute": 86, "team": "home", "type": "yellow_card", "player": { "id": "p_vlkanovsky_d", "name": "Vlkanovský D." }, "note": "Hrubost" },
      { "id": "e21", "minute": 87, "team": "away", "type": "substitution", "playerIn": { "id": "p_ludvicek_d", "name": "Ludvíček D." }, "playerOut": { "id": "p_darida_v", "name": "Darida V." }, "note": "Zranění" },
      { "id": "e22", "minute": 88, "team": "home", "type": "goal", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "assistPlayer": { "id": "p_cerv_l", "name": "Červ L." }, "scoreUpdate": "2-2" },
      { "id": "e23", "minute": 89, "team": "home", "type": "goal", "player": { "id": "p_adu_p_2", "name": "Adu P." }, "assistPlayer": { "id": "p_dweh_s", "name": "Dweh S." }, "scoreUpdate": "3-2" },
      { "id": "e24", "minute": 90, "team": "away", "type": "goal", "player": { "id": "p_kucera_j", "name": "Kučera J." }, "assistPlayer": { "id": "p_horak_d", "name": "Horák D." }, "scoreUpdate": "3-3" },
      { "id": "e25", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_bakos_m", "name": "Bakoš M." }, "note": "Mimo hřiště" },
      { "id": "e26", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_zadrazil_a", "name": "Zadražil A." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-10-05-olomouc-jablonec",
    "homeTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-10-05T15:30:00Z",
    "stadium": "Andrův stadion",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 24, "team": "home", "type": "goal", "player": { "id": "p_dolnikov_a", "name": "Dolžnikov A." }, "assistPlayer": { "id": "p_hadas_m", "name": "Hadaš M." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 45, "team": "home", "type": "goal", "player": { "id": "p_mikulenka_m", "name": "Mikulenka M." }, "assistPlayer": { "id": "p_hadas_m_2", "name": "Hadaš M." }, "scoreUpdate": "2-0" },
      { "id": "e3", "minute": 60, "team": "away", "type": "substitution", "playerIn": { "id": "p_polidar_m", "name": "Polidar M." }, "playerOut": { "id": "p_puskac_d", "name": "Puškáč D." } },
      { "id": "e4", "minute": 60, "team": "away", "type": "substitution", "playerIn": { "id": "p_suchan_j", "name": "Suchan J." }, "playerOut": { "id": "p_novak_f", "name": "Novák F." } },
      { "id": "e5", "minute": 66, "team": "away", "type": "yellow_card", "player": { "id": "p_tekijaski_n", "name": "Tekijaški N." }, "note": "Podražení" },
      { "id": "e6", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_jawo_l", "name": "Jawo L." }, "playerOut": { "id": "p_malinsky_m", "name": "Malinský M." } },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_lavrincik_s", "name": "Lavrinčík S." }, "playerOut": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e8", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_tkac_d", "name": "Tkáč D." }, "playerOut": { "id": "p_kostadinov_t", "name": "Kostadinov T." } },
      { "id": "e9", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_dolnikov_a_2", "name": "Dolžnikov A." }, "playerOut": { "id": "p_navratil_j", "name": "Navrátil J." } },
      { "id": "e10", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_breite_r", "name": "Breite R." }, "playerOut": { "id": "p_langer_s", "name": "Langer Š." } },
      { "id": "e11", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_sip_j", "name": "Šíp J." }, "playerOut": { "id": "p_slavicek_f", "name": "Slavíček F." } },
      { "id": "e12", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_penxa_l", "name": "Penxa L." }, "playerOut": { "id": "p_soucek_d", "name": "Souček D." } },
      { "id": "e13", "minute": 88, "team": "home", "type": "substitution", "playerIn": { "id": "p_mikulenka_m_2", "name": "Mikulenka M." }, "playerOut": { "id": "p_tijani_m", "name": "Tijani M." } }
    ]
  },
  {
    "id": "2025-10-05-zlin-banik",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-10-05T13:00:00Z",
    "stadium": "Stadion Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "11",
    "events": [
      { "id": "e1", "minute": 17, "team": "home", "type": "goal", "player": { "id": "p_cernin_j", "name": "Černín J." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_almasi_l", "name": "Almási L." }, "playerOut": { "id": "p_pira_j", "name": "Pira J." } },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_frydek_ch", "name": "Frýdek Ch." }, "playerOut": { "id": "p_pojezny_k", "name": "Pojezný K." } },
      { "id": "e4", "minute": 51, "team": "away", "type": "yellow_card", "player": { "id": "p_almasi_l", "name": "Almási L." }, "note": "Držení" },
      { "id": "e5", "minute": 59, "team": "home", "type": "yellow_card", "player": { "id": "p_pisoja_m", "name": "Pišoja M." }, "note": "Držení" },
      { "id": "e6", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_owusu_d", "name": "Owusu D." }, "playerOut": { "id": "p_havran_m", "name": "Havran M." } },
      { "id": "e7", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_pisoja_m", "name": "Pišoja M." }, "playerOut": { "id": "p_koubek_m", "name": "Koubek M." } },
      { "id": "e8", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s.",  "name": "Poznar T."} },
      { "id": "e9", "minute": 74, "team": "away", "type": "substitution", "playerIn": { "id": "p_jaron_p", "name": "Jaroň P." }, "playerOut": { "id": "p_buchta_d", "name": "Buchta D."} },
      { "id": "e10", "minute": 85, "team": "home", "type": "substitution", "playerIn": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerOut": { "id": "p_machalik_d", "name": "Machalík D." } },
      { "id": "e11", "minute": 85, "team": "home", "type": "substitution", "playerIn": { "id": "p_fukala_m", "name": "Fukala M." }, "playerOut": { "id": "p_ulbrich_t" , "name": "Ulbrich T."} },
      { "id": "e12", "minute": 87, "team": "away", "type": "substitution", "playerIn": { "id": "p_zlatohlavek_t", "name": "Zlatohlávek T." }, "playerOut": { "id": "p_planka_d", "name": "Planka D." } },
      { "id": "e13", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_nombil_c", "name": "Nombil C." }, "playerOut": { "id": "p_krapka_a", "name": "Křapka A." } },
      { "id": "e14", "minute": 94, "team": "away", "type": "goal", "player": { "id": "p_munkagaard_a", "name": "Munkagaard A." }, "scoreUpdate": "1-1" }
    ]
  },
{
    "id": "2025-10-19-t_jab-t_duk",
    "homeTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-19T18:30:00Z",
    "stadium": "Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_ambler_m", "name": "Ambler M." }, "note": "Nesportovní chování" },
      { "id": "e2", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_kadak_j", "name": "Kadák J." }, "playerOut": { "id": "p_ambler_m", "name": "Ambler M." } },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_isife_s", "name": "Isife S." }, "playerOut": { "id": "p_sebrle_s", "name": "Šebrle Š." } },
      { "id": "e4", "minute": 46, "team": "away", "type": "red_card", "player": { "id": "p_isife_s", "name": "Isife S." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e5", "minute": 64, "team": "home", "type": "substitution", "playerIn": { "id": "p_sedlacek_r", "name": "Sedláček R." }, "playerOut": { "id": "p_zorvan_f", "name": "Zorvan F." } },
      { "id": "e6", "minute": 68, "team": "away", "type": "yellow_card", "player": { "id": "p_cernak_m", "name": "Černák M." }, "note": "Hrubost" },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_jedlicka_t", "name": "Jedlička T." }, "playerOut": { "id": "p_cernak_m", "name": "Černák M." } },
      { "id": "e8", "minute": 76, "team": "home", "type": "yellow_card", "player": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "note": "Hrubost" },
      { "id": "e9", "minute": 78, "team": "away", "type": "yellow_card", "player": { "id": "p_diallo_b", "name": "Diallo B." }, "note": "Hrubost" },
      { "id": "e10", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "playerOut": { "id": "p_soucek_d", "name": "Souček D." } },
      { "id": "e11", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_jawo_l", "name": "Jawo L." }, "playerOut": { "id": "p_puskac_d", "name": "Puškáč D." } },
      { "id": "e12", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_chramosta_j", "name": "Chramosta J." }, "playerOut": { "id": "p_rusek_a", "name": "Růsek A." } },
      { "id": "e13", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_fokam_j", "name": "Fokam J." }, "playerOut": { "id": "p_diallo_b", "name": "Diallo B." } },
      { "id": "e14", "minute": 86, "team": "away", "type": "yellow_card", "player": { "id": "p_kadak_j", "name": "Kadák J." }, "note": "Podražení" },
      { "id": "e15", "minute": 89, "team": "home", "type": "substitution", "playerIn": { "id": "p_alegue_a", "name": "Alegue A." }, "playerOut": { "id": "p_suchan_j", "name": "Suchan J." } },
      { "id": "e16", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_gaszczyk_p", "name": "Gaszczyk P." }, "playerOut": { "id": "p_cermak_m", "name": "Čermák M." } }
    ]
  },
  {
    "id": "2025-10-18-t_boh-t_plz",
    "homeTeam": { "id": "t_boh", "name": "Bohemians", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 9, "team": "away", "type": "goal", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "assistPlayer": { "id": "p_memic_a", "name": "Memič A." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 31, "team": "home", "type": "yellow_card", "player": { "id": "p_sakala_b", "name": "Sakala B." }, "note": "Hrubost" },
      { "id": "e3", "minute": 43, "team": "away", "type": "yellow_card", "player": { "id": "p_dweh_s", "name": "Dweh S." }, "note": "Držení" },
      { "id": "e4", "minute": 44, "team": "home", "type": "yellow_card", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "note": "Podražení" },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_sakala_b", "name": "Sakala B." } },
      { "id": "e6", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_ramirez_e", "name": "Ramirez E." }, "playerOut": { "id": "p_hrubost", "name": "Hrubost" } },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerOut": { "id": "p_spacil_k", "name": "Spáčil K." } },
      { "id": "e8", "minute": 75, "team": "away", "type": "yellow_card", "player": { "id": "p_jemelka_v", "name": "Jemelka V." }, "note": "Hrubost" },
      { "id": "e9", "minute": 77, "team": "away", "type": "substitution", "playerIn": { "id": "p_ladra_t", "name": "Ladra T." }, "playerOut": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Zranění" },
      { "id": "e10", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_cermak_a", "name": "Čermák A." }, "playerOut": { "id": "p_hruby_r", "name": "Hrubý R." } },
      { "id": "e11", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_okeke_n", "name": "Okeke N." }, "playerOut": { "id": "p_cerny_s", "name": "Černý Š." } },
      { "id": "e12", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_smrz_v", "name": "Smrž V." } },
      { "id": "e13", "minute": 82, "team": "home", "type": "substitution", "playerIn": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "playerOut": { "id": "p_kovarik_j", "name": "Kovařík J." } },
      { "id": "e14", "minute": 88, "team": "home", "type": "yellow_card", "player": { "id": "p_smrz_v", "name": "Smrž V." }, "note": "Podražení" },
      { "id": "e15", "minute": 89, "team": "away", "type": "substitution", "playerIn": { "id": "p_kabongo_c", "name": "Kabongo C." }, "playerOut": { "id": "p_adu_p", "name": "Adu P." } },
      { "id": "e16", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_havel_m", "name": "Havel M." }, "playerOut": { "id": "p_memic_a", "name": "Memič A." } }
    ]
  },
  {
    "id": "2025-10-19-t_ban-t_hra",
    "homeTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 0, "away": 1 },
    "status": "finished",
    "date": "2025-10-19T13:00:00Z",
    "stadium": "Městský stadion Ostrava",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_buchta_d", "name": "Buchta D." }, "playerOut": { "id": "p_jaron_p", "name": "Jaroň P." } },
      { "id": "e2", "minute": 61, "team": "away", "type": "goal", "player": { "id": "p_sloncik_t", "name": "Slončík T." }, "assistPlayer": { "id": "p_griger_a", "name": "Griger A." }, "scoreUpdate": "0-1" },
      { "id": "e3", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_pira_j", "name": "Pira J." }, "playerOut": { "id": "p_almasi_l", "name": "Almási L." } },
      { "id": "e4", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_vikanova_a", "name": "Vikanova A." }, "playerOut": { "id": "p_pilaf_v", "name": "Pilař V." } },
      { "id": "e5", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_hodek_j", "name": "Hodek J." }, "playerOut": { "id": "p_griger_a", "name": "Griger A." } },
      { "id": "e6", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_havran_m", "name": "Havran M." }, "playerOut": { "id": "p_owusu_d", "name": "Owusu D." } },
      { "id": "e7", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_boula_j", "name": "Boula J." }, "playerOut": { "id": "p_frydek_c", "name": "Frýdek Ch." } },
      { "id": "e8", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_ludvicek_d", "name": "Ludvíček D." }, "playerOut": { "id": "p_kucera_j", "name": "Kučera J." } },
      { "id": "e9", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_uhrincat_j", "name": "Uhrinčať J." }, "playerOut": { "id": "p_darida_v", "name": "Darida V." } },
      { "id": "e10", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_kristalus_o", "name": "Křišťáluš O." }, "note": "Faul" },
      { "id": "e11", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_hruska_l", "name": "Hruška L." }, "playerOut": { "id": "p_sloncik_t", "name": "Slončík T." } }
    ]
  },
  {
    "id": "2025-10-18-t_par-t_mbo",
    "homeTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "score": { "home": 2, "away": 1 },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "CFIG Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 16, "team": "away", "type": "yellow_card", "player": { "id": "p_matousek_f", "name": "Matoušek F." }, "note": "Držení" },
      { "id": "e2", "minute": 20, "team": "home", "type": "goal", "player": { "id": "p_tanko_a", "name": "Tanko A." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 28, "team": "away", "type": "goal", "player": { "id": "p_sevcik_m", "name": "Ševčík M." }, "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 40, "team": "home", "type": "yellow_card", "player": { "id": "p_reznicek_j", "name": "Řezníček J." }, "note": "Držení" },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_lexa_m", "name": "Lexa M." }, "playerOut": { "id": "p_sancl_f", "name": "Šancl F." } },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_tredl_j", "name": "Trédl J." }, "playerOut": { "id": "p_saarma_r", "name": "Saarma R." } },
      { "id": "e7", "minute": 53, "team": "home", "type": "goal", "player": { "id": "p_sychra_v", "name": "Sychra V." }, "scoreUpdate": "2-1" },
      { "id": "e8", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_kolarik_j", "name": "Kolářík J." }, "playerOut": { "id": "p_sevcik_m", "name": "Ševčík M." } },
      { "id": "e9", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_subert_m", "name": "Šubert M." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e10", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_vecheta_f", "name": "Vechéta F." }, "playerOut": { "id": "p_smekal_d", "name": "Smékal D." } },
      { "id": "e11", "minute": 70, "team": "home", "type": "yellow_card", "player": { "id": "p_saarma_r", "name": "Saarma R." }, "note": "Držení" },
      { "id": "e12", "minute": 71, "team": "away", "type": "yellow_card", "player": { "id": "p_vojta_m", "name": "Vojta M." }, "note": "Nafilmovaný pád" },
      { "id": "e13", "minute": 73, "team": "home", "type": "substitution", "playerIn": { "id": "p_simek_s", "name": "Šimek S." }, "playerOut": { "id": "p_teah_d", "name": "Teah D." } },
      { "id": "e14", "minute": 73, "team": "away", "type": "substitution", "playerIn": { "id": "p_zika_j", "name": "Zika J." }, "playerOut": { "id": "p_lehky_f", "name": "Lehký F." } },
      { "id": "e15", "minute": 78, "team": "home", "type": "yellow_card", "player": { "id": "p_lurvink_l", "name": "Lurvink L." }, "note": "Zdržování hry" },
      { "id": "e16", "minute": 82, "team": "away", "type": "yellow_card", "player": { "id": "p_pech_d", "name": "Pech D." }, "note": "Nafilmovaný pád" },
      { "id": "e17", "minute": 84, "team": "home", "type": "substitution", "playerIn": { "id": "p_sychra_v", "name": "Sychra V." }, "playerOut": { "id": "p_surzyn_m", "name": "Surzyn M." } },
      { "id": "e18", "minute": 85, "team": "away", "type": "substitution", "playerIn": { "id": "p_klima_j", "name": "Klíma J." }, "playerOut": { "id": "p_kostka_d", "name": "Kostka D." } }
    ]
  },
  {
    "id": "2025-10-18-t_sla-t_zli",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "Zlín", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-18T18:00:00Z",
    "stadium": "Eden Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 14, "team": "away", "type": "yellow_card", "player": { "id": "p_cernin_j", "name": "Černín J." }, "note": "Faul, Stop na další zápas" },
      { "id": "e2", "minute": 41, "team": "away", "type": "yellow_card", "player": { "id": "p_nombil_c", "name": "Nombil C." }, "note": "Podražení" },
      { "id": "e3", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "playerOut": { "id": "p_kusej_v", "name": "Kusej V." } },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_vorlicky_l", "name": "Vorlický L." }, "playerOut": { "id": "p_zmrzly_o", "name": "Zmrzlý O." } },
      { "id": "e5", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_prekop_e", "name": "Prekop E." }, "playerOut": { "id": "p_cham_m", "name": "Cham M." } },
      { "id": "e6", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerOut": { "id": "p_didiba_j", "name": "Didiba J." } },
      { "id": "e7", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_koubek_m", "name": "Koubek M." }, "playerOut": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e8", "minute": 74, "team": "home", "type": "yellow_card", "player": { "id": "p_chaloupek_s", "name": "Chaloupek Š." }, "note": "Podražení" },
      { "id": "e9", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s", "name": "Kanu S." } },
      { "id": "e10", "minute": 84, "team": "home", "type": "yellow_card", "player": { "id": "p_dorley_o", "name": "Dorley O." }, "note": "Držení" },
      { "id": "e11", "minute": 86, "team": "home", "type": "substitution", "playerIn": { "id": "p_chytil_m", "name": "Chytil M." }, "playerOut": { "id": "p_chaloupek_s", "name": "Chaloupek Š." } },
      { "id": "e12", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_sanyang_y", "name": "Sanyang Y." }, "playerOut": { "id": "p_moses_d", "name": "Moses D." } },
      { "id": "e13", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_machalik_d", "name": "Machalík D." }, "playerOut": { "id": "p_pisoja_m", "name": "Pišoja M." } },
      { "id": "e14", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "note": "Zdržování hry" }
    ]
  },
  {
    "id": "2025-10-19-t_tep-t_lib",
    "homeTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-10-19T13:47:00Z",
    "stadium": "Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 12, "team": "away", "type": "missed_penalty", "player": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "note": "Neproměněná penalta" },
      { "id": "e2", "minute": 21, "team": "away", "type": "yellow_card", "player": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "e3", "minute": 26, "team": "home", "type": "yellow_card", "player": { "id": "p_svanda_j", "name": "Švanda J." } },
      { "id": "e4", "minute": 42, "team": "away", "type": "yellow_card", "player": { "id": "p_nguessan_a", "name": "N'Guessan A." } },
      { "id": "e5", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_kozak_m", "name": "Kozák M." } },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_riznic_m", "name": "Riznič M." }, "playerOut": { "id": "p_svanda_j", "name": "Švanda J." } },
      { "id": "e7", "minute": 54, "team": "home", "type": "goal", "player": { "id": "p_bilek_m", "name": "Bílek M." }, "note": "Penalta", "scoreUpdate": "1-0" },
      { "id": "e8", "minute": 56, "team": "away", "type": "substitution", "playerIn": { "id": "p_soliu_a", "name": "Soliu A." }, "playerOut": { "id": "p_dulay_p", "name": "Dulay P." } },
      { "id": "e9", "minute": 56, "team": "away", "type": "substitution", "playerIn": { "id": "p_icha_m", "name": "Icha M." }, "playerOut": { "id": "p_kayondo_a", "name": "Kayondo A." } },
      { "id": "e10", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "playerOut": { "id": "p_kozak_m", "name": "Kozák M." } },
      { "id": "e11", "minute": 67, "team": "away", "type": "substitution", "playerIn": { "id": "p_spatenka_f", "name": "Špatenka F." }, "playerOut": { "id": "p_stransky_v", "name": "Stránský V." } },
      { "id": "e12", "minute": 67, "team": "away", "type": "substitution", "playerIn": { "id": "p_kozeluh_j", "name": "Koželuh J." }, "playerOut": { "id": "p_masek_l", "name": "Mašek L." } },
      { "id": "e13", "minute": 75, "team": "home", "type": "substitution", "playerIn": { "id": "p_fortelny_j", "name": "Fortelný J." }, "playerOut": { "id": "p_marecek_d", "name": "Mareček D." } },
      { "id": "e14", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_letenay_l", "name": "Letenay L." }, "playerOut": { "id": "p_hlavaty_m", "name": "Hlavatý M." } },
      { "id": "e15", "minute": 81, "team": "home", "type": "substitution", "playerIn": { "id": "p_jukl_r", "name": "Jukl R." }, "playerOut": { "id": "p_radosta_m", "name": "Radosta M." } },
      { "id": "e16", "minute": 87, "team": "home", "type": "yellow_card", "player": { "id": "p_auta_j", "name": "Auta J." }, "note": "Stop na další zápas" },
      { "id": "e17", "minute": 89, "team": "away", "type": "goal", "player": { "id": "p_soliu_a", "name": "Soliu A." }, "assistPlayer": { "id": "p_icha_m", "name": "Icha M." }, "scoreUpdate": "1-1" }
    ]
  },
  {
    "id": "2025-09-13-t_zli-t_duk",
    "homeTeam": { "id": "t_zli", "name": "Zlín", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-09-13T15:00:00Z",
    "stadium": "Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "8",
    "events": [
      { "id": "e1", "minute": 37, "team": "home", "type": "yellow_card", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "note": "Podražení" },
      { "id": "e2", "minute": 39, "team": "away", "type": "yellow_card", "player": { "id": "p_sehovis_z", "name": "Šehovič Z." }, "note": "Hrubost" },
      { "id": "e3", "minute": 40, "team": "away", "type": "goal", "player": { "id": "p_sehovis_z", "name": "Šehovič Z." }, "scoreUpdate": "0-1" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_nombil_c", "name": "Nombil C." }, "playerOut": { "id": "p_petruta_s", "name": "Petruta S." } },
      { "id": "e5", "minute": 55, "team": "home", "type": "goal", "player": { "id": "p_cernin_j", "name": "Černín J." }, "note": "Penalta", "scoreUpdate": "1-1" },
      { "id": "e6", "minute": 70, "team": "home", "type": "yellow_card", "player": { "id": "p_didiba_j", "name": "Didiba J." }, "note": "Hrubost" },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_diallo_b", "name": "Diallo B." }, "playerOut": { "id": "p_cisse_n", "name": "Cisse N." } },
      { "id": "e8", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_fokam_j", "name": "Fokam J." }, "playerOut": { "id": "p_cermak_m", "name": "Čermák M." } },
      { "id": "e9", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_jedlicka_t", "name": "Jedlička T." }, "playerOut": { "id": "p_kadak_j", "name": "Kadák J." } },
      { "id": "e10", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_natchkebia_z", "name": "Natchkebia Z." }, "playerOut": { "id": "p_pisoja_m", "name": "Pišoja M." } },
      { "id": "e11", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "playerOut": { "id": "p_bartosak_l", "name": "Bartošák L." } },
      { "id": "e12", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_kanu_s", "name": "Kanu S." }, "playerOut": { "id": "p_poznar_t", "name": "Poznar T." } },
      { "id": "e13", "minute": 74, "team": "home", "type": "yellow_card", "player": { "id": "p_kopecny_m", "name": "Kopečný M." }, "note": "Podražení, Stop na další zápas" },
      { "id": "e14", "minute": 85, "team": "away", "type": "yellow_card", "player": { "id": "p_pourzitidis_m", "name": "Pourzitidis M." }, "note": "Držení" },
      { "id": "e15", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_zitny_m", "name": "Žitný M." }, "playerOut": { "id": "p_hassek_d", "name": "Hašek D." } },
      { "id": "e16", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_sehovis_z", "name": "Šehovič Z." }, "playerOut": { "id": "p_ambler_m", "name": "Ambler M." } },
      { "id": "e17", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_ulbrich_t", "name": "Ulbrich T." }, "playerOut": { "id": "p_cupak_m", "name": "Cupák M." } },
      { "id": "e18", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_fukala_m", "name": "Fukala M." }, "note": "Hrubost" }
    ]
  },
  {
    "id": "2025-10-18-t_kar-t_sig",
    "homeTeam": { "id": "t_kar", "name": "Karviná", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-10-18T15:00:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 40, "team": "away", "type": "goal", "player": { "id": "p_ghali_a", "name": "Ghali A." }, "assistPlayer": { "id": "p_breite_r", "name": "Breite R." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_traore_a", "name": "Traore A." }, "note": "Úder loktem" },
      { "id": "e3", "minute": 45, "team": "home", "type": "goal", "player": { "id": "p_krcik_d", "name": "Krčík D." }, "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 49, "team": "away", "type": "yellow_card", "player": { "id": "p_hadas_m", "name": "Hadaš M." }, "note": "Faul" },
      { "id": "e5", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_vasulin_d", "name": "Vašulín D." }, "playerOut": { "id": "p_dolnikov_a", "name": "Dolnikov A." } },
      { "id": "e6", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_storman_r", "name": "Štorman R." }, "playerOut": { "id": "p_kristan_j", "name": "Křišťan J." } },
      { "id": "e7", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_janosek_d", "name": "Janošek D." }, "playerOut": { "id": "p_breite_r", "name": "Breite R." } },
      { "id": "e8", "minute": 71, "team": "away", "type": "substitution", "playerIn": { "id": "p_sip_j", "name": "Šíp J." }, "playerOut": { "id": "p_mikulenka_m", "name": "Mikulenka M." } },
      { "id": "e9", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_gning_a", "name": "Gning A." }, "playerOut": { "id": "p_ezeh_l", "name": "Ezeh L." } },
      { "id": "e10", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_chytry_j", "name": "Chytrý J." }, "playerOut": { "id": "p_camara_s", "name": "Camara S." } },
      { "id": "e11", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_navratil_j", "name": "Navrátil J." }, "playerOut": { "id": "p_ghali_a", "name": "Ghali A." } },
      { "id": "e12", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_ayaosi_e", "name": "Ayaosi E." }, "playerOut": { "id": "p_sigut_s", "name": "Šigut S." } }
    ]
  },
  {
    "id": "2025-10-19-t_slo-t_spa",
    "homeTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-19T15:30:00Z",
    "stadium": "MFS Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "12",
    "events": [
      { "id": "e1", "minute": 28, "team": "home", "type": "yellow_card", "player": { "id": "p_danicek_v", "name": "Daníček V." }, "note": "Držení" },
      { "id": "e2", "minute": 39, "team": "home", "type": "yellow_card", "player": { "id": "p_rundic_m", "name": "Rundič M." }, "note": "Faul" },
      { "id": "e3", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "note": "Nesportovní chování" },
      { "id": "e4", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_kuchta_j", "name": "Kuchta J." }, "playerOut": { "id": "p_rrahmani_a", "name": "Rrahmani A." } },
      { "id": "e5", "minute": 59, "team": "home", "type": "substitution", "playerIn": { "id": "p_rundic_m", "name": "Rundič M." }, "playerOut": { "id": "p_hamza_j", "name": "Hamza J." } },
      { "id": "e6", "minute": 59, "team": "home", "type": "substitution", "playerIn": { "id": "p_barat_d", "name": "Barát D." }, "playerOut": { "id": "p_marinelli_a", "name": "Marinelli A." } },
      { "id": "e7", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_preciado_a", "name": "Preciado A." }, "playerOut": { "id": "p_kadefabek_p", "name": "Kadeřábek P." } },
      { "id": "e8", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_sadilek_l", "name": "Sadílek L." }, "playerOut": { "id": "p_vydra_p", "name": "Vydra P." } },
      { "id": "e9", "minute": 69, "team": "home", "type": "yellow_card", "player": { "id": "p_blahut_p", "name": "Blahút P." }, "note": "Podražení" },
      { "id": "e10", "minute": 73, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeleny_j", "name": "Zelený J." }, "playerOut": { "id": "p_panak_f", "name": "Panák F." } },
      { "id": "e11", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_travnik_m", "name": "Trávník M." }, "playerOut": { "id": "p_havlik_m", "name": "Havlík M." } },
      { "id": "e12", "minute": 78, "team": "home", "type": "substitution", "playerIn": { "id": "p_kosselnik_m", "name": "Kosselník M." }, "playerOut": { "id": "p_juroska_p", "name": "Juroška P." } },
      { "id": "e13", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_milla_k", "name": "Milla K." }, "playerOut": { "id": "p_rynes_m", "name": "Ryneš M." } },
      { "id": "e14", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_blahut_p", "name": "Blahút P." }, "playerOut": { "id": "p_petrzela_m", "name": "Petržela M." }, "note": "Zranění" },
      { "id": "e15", "minute": 84, "team": "home", "type": "yellow_card", "player": { "id": "p_marinelli_a", "name": "Marinelli A." }, "note": "Hrubost" }
    ]
  },
  {
    "id": "2025-10-22-t_boh-t_mbo",
    "homeTeam": { "id": "t_boh", "name": "Bohemians", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-10-22T18:30:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "6",
    "events": [
      { "id": "e1", "minute": 28, "team": "home", "type": "goal_disallowed", "player": { "id": "p_kovarik_j", "name": "Kovařík J." }, "note": "Neuznaný gól - faul" },
      { "id": "e2", "minute": 34, "team": "away", "type": "yellow_card", "player": { "id": "p_kolarik_j", "name": "Kolářík J." }, "note": "Podražení" },
      { "id": "e3", "minute": 54, "team": "away", "type": "substitution", "playerIn": { "id": "p_klima_j", "name": "Klíma J." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e4", "minute": 54, "team": "away", "type": "goal", "player": { "id": "p_klima_j", "name": "Klíma J." }, "assistPlayer": { "id": "p_subert_m", "name": "Šubert M." }, "scoreUpdate": "0-1" },
      { "id": "e5", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_subert_m", "name": "Šubert M." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e6", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_ristovski_m", "name": "Ristovski M." }, "playerOut": { "id": "p_hruby_r", "name": "Hrubý R." } },
      { "id": "e7", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_drchal_v", "name": "Drchal V." }, "playerOut": { "id": "p_kadlec_a", "name": "Kadlec A." } },
      { "id": "e8", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_vojta_m", "name": "Vojta M." }, "playerOut": { "id": "p_klima_j", "name": "Klíma J." } },
      { "id": "e9", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_lehky_f", "name": "Lehký F." }, "playerOut": { "id": "p_sevcik_m", "name": "Ševčík M." } },
      { "id": "e10", "minute": 75, "team": "home", "type": "goal", "player": { "id": "p_kovarik_j", "name": "Kovařík J." }, "assistPlayer": { "id": "p_yusuf_y", "name": "Yusuf Y." }, "scoreUpdate": "1-1" },
      { "id": "e11", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_cermak_a", "name": "Čermák A." }, "playerOut": { "id": "p_cerny_s", "name": "Černý Š." }, "note": "Zranění" },
      { "id": "e12", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_macek_r", "name": "Macek R." }, "playerOut": { "id": "p_pech_d", "name": "Pech D." } },
      { "id": "e13", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_kozel_d", "name": "Kozel D." }, "playerOut": { "id": "p_kolarik_j", "name": "Kolářík J." } },
      { "id": "e14", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "note": "Faul" }
    ]
  },
  {
    "id": "2025-10-25-sparta-bohemians",
    "homeTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "awayTeam": { "id": "t_boh", "name": "Bohemians 1905", "logo": "" },
    "score": { "home": 2, "away": 1 },
    "status": "finished",
    "date": "2025-10-25T11:00:00Z",
    "stadium": "epet ARENA",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 9, "team": "away", "type": "goal_disallowed", "player": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "note": "Neuznaný gól - faul" },
      { "id": "e2", "minute": 15, "team": "home", "type": "goal_disallowed", "player": { "id": "p_haraslin_l", "name": "Haraslín L." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e3", "minute": 40, "team": "away", "type": "goal", "player": { "id": "p_drchal_v", "name": "Drchal V." }, "assistPlayer": { "id": "p_cermak_a", "name": "Čermák A." }, "scoreUpdate": "0-1" },
      { "id": "e4", "minute": 55, "team": "home", "type": "substitution", "playerIn": { "id": "p_preciado_a", "name": "Preciado A." }, "playerOut": { "id": "p_kairinen_k", "name": "Kairinen K." } },
      { "id": "e5", "minute": 60, "team": "away", "type": "substitution", "playerIn": { "id": "p_kovarik_j", "name": "Kovařík J." }, "playerOut": { "id": "p_kadlec_a", "name": "Kadlec A." } },
      { "id": "e6", "minute": 61, "team": "home", "type": "goal", "player": { "id": "p_uichenna_b", "name": "Uichenna B." }, "scoreUpdate": "1-1" },
      { "id": "e7", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_zeleny_j", "name": "Zelený J." }, "playerOut": { "id": "p_sorensen_a", "name": "Sörensen A." } },
      { "id": "e8", "minute": 71, "team": "home", "type": "substitution", "playerIn": { "id": "p_birmančevič_v", "name": "Birmančevič V." }, "playerOut": { "id": "p_krasniqi_e", "name": "Krasniqi E." } },
      { "id": "e9", "minute": 77, "team": "away", "type": "substitution", "playerIn": { "id": "p_vondra_j", "name": "Vondra J." }, "playerOut": { "id": "p_cermak_a", "name": "Čermák A." } },
      { "id": "e10", "minute": 77, "team": "away", "type": "substitution", "playerIn": { "id": "p_yusuf", "name": "Yusuf" }, "playerOut": { "id": "p_drchal_v", "name": "Drchal V." } },
      { "id": "e11", "minute": 81, "team": "away", "type": "substitution", "playerIn": { "id": "p_smrz_v", "name": "Smrž V." }, "playerOut": { "id": "p_sekala_b", "name": "Šekala B." } },
      { "id": "e12", "minute": 82, "team": "home", "type": "goal", "player": { "id": "p_vydra_m", "name": "Vydra M." }, "assistPlayer": { "id": "p_mansaverk_s", "name": "Mansaverk S." }, "scoreUpdate": "2-1" },
      { "id": "e13", "minute": 89, "team": "home", "type": "substitution", "playerIn": { "id": "p_sadilek_l", "name": "Sadílek L." }, "playerOut": { "id": "p_uichenna_b", "name": "Uichenna B." } },
      { "id": "e14", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_hruby_r", "name": "Hrubý R." }, "note": "Držení" }
    ]
  },
  {
    "id": "2025-10-25-hradec-teplice",
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "awayTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-25T13:00:00Z",
    "stadium": "Malšovická aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 23, "team": "away", "type": "goal_disallowed", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "note": "Neuznaný gól - ofsajd" },
      { "id": "e2", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_marecek_d", "name": "Mareček D." }, "playerOut": { "id": "p_bílek_m", "name": "Bílek M." } },
      { "id": "e3", "minute": 56, "team": "home", "type": "substitution", "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_vlkanova_a", "name": "Vlkanova A." } },
      { "id": "e4", "minute": 56, "team": "home", "type": "substitution", "playerIn": { "id": "p_dancak_s", "name": "Dancák S." }, "playerOut": { "id": "p_van_buren_m", "name": "van Buren M." } },
      { "id": "e5", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_nyerges_k", "name": "Nyerges K." }, "playerOut": { "id": "p_kozák_m", "name": "Kozák M." } },
      { "id": "e6", "minute": 61, "team": "away", "type": "substitution", "playerIn": { "id": "p_vachuta_f", "name": "Vachuta F." }, "playerOut": { "id": "p_trubač_d", "name": "Trubač D." } },
      { "id": "e7", "minute": 74, "team": "away", "type": "substitution", "playerIn": { "id": "p_jukl_r", "name": "Jukl R." }, "playerOut": { "id": "p_trubač_d", "name": "Trubač D." } },
      { "id": "e8", "minute": 74, "team": "home", "type": "substitution", "playerIn": { "id": "p_pilař_v", "name": "Pilař V." }, "playerOut": { "id": "p_horak_d", "name": "Horák D." } },
      { "id": "e9", "minute": 82, "team": "away", "type": "substitution", "playerIn": { "id": "p_puskac_d", "name": "Puškáč D." }, "playerOut": { "id": "p_krejčí_l", "name": "Krejčí L." } },
      { "id": "e10", "minute": 83, "team": "away", "type": "substitution", "playerIn": { "id": "p_kasprzak_m", "name": "Kasprzak M." }, "playerOut": { "id": "p_mareček_d", "name": "Mareček D." } },
      { "id": "e11", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_svanda_j", "name": "Švanda J." }, "note": "Podražení" }
    ]
  },
  {
    "id": "2025-10-25-liberec-jablonec",
    "homeTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "awayTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "score": { "home": 0, "away": 2 },
    "status": "finished",
    "date": "2025-10-25T14:00:00Z",
    "stadium": "Stadion u Nisy",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 22, "team": "home", "type": "yellow_card", "player": { "id": "p_hlavaty_m", "name": "Hlavatý M." }, "note": "Hrubost, Stop na další zápas" },
      { "id": "e2", "minute": 29, "team": "away", "type": "yellow_card", "player": { "id": "p_souček_d", "name": "Souček D." }, "note": "Držení" },
      { "id": "e3", "minute": 29, "team": "away", "type": "yellow_card", "player": { "id": "p_polidar_m", "name": "Polidar M." }, "note": "Nesportovní chování" },
      { "id": "e4", "minute": 39, "team": "home", "type": "yellow_card", "player": { "id": "p_hodek_d", "name": "Hodek D." }, "note": "Nesportovní chování" },
      { "id": "e5", "minute": 39, "team": "home", "type": "yellow_card", "player": { "id": "p_mikula_j", "name": "Mikula J." }, "note": "Faul" },
      { "id": "e6", "minute": 44, "team": "away", "type": "yellow_card", "player": { "id": "p_zafeiris_c", "name": "Zafeiris C." }, "note": "Nesmýkavý pád" },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_spatenka_a", "name": "Špatenka A." }, "playerOut": { "id": "p_sula_a", "name": "Šula A." } },
      { "id": "e8", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_kosek_d", "name": "Kosek D." }, "playerOut": { "id": "p_jukl_r", "name": "Jukl R." } },
      { "id": "e9", "minute": 55, "team": "home", "type": "substitution", "playerIn": { "id": "p_hruby_r", "name": "Hrubý R." }, "playerOut": { "id": "p_malovanyi_v", "name": "Malovanyi V." } },
      { "id": "e10", "minute": 55, "team": "home", "type": "substitution", "playerIn": { "id": "p_vondra_j", "name": "Vondra J." }, "playerOut": { "id": "p_mikula_j", "name": "Mikula J." } },
      { "id": "e11", "minute": 60, "team": "away", "type": "goal", "player": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "assistPlayer": { "id": "p_zmrhal_j", "name": "Zmrhal J." }, "scoreUpdate": "0-1" },
      { "id": "e12", "minute": 62, "team": "away", "type": "goal", "player": { "id": "p_javurek_l", "name": "Javůrek L." }, "assistPlayer": { "id": "p_polidar_m", "name": "Polidar M." }, "scoreUpdate": "0-2" },
      { "id": "e13", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_alegue_a", "name": "Alegue A." }, "playerOut": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." } },
      { "id": "e14", "minute": 69, "team": "away", "type": "substitution", "playerIn": { "id": "p_rízek_a", "name": "Řízek A." }, "playerOut": { "id": "p_zmrhal_j", "name": "Zmrhal J." } },
      { "id": "e15", "minute": 74, "team": "home", "type": "substitution", "playerIn": { "id": "p_ndoce_g", "name": "Ndoce G." }, "playerOut": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "e16", "minute": 74, "team": "home", "type": "substitution", "playerIn": { "id": "p_ndoce_g", "name": "Ndoce G." }, "playerOut": { "id": "p_ndoce_g", "name": "Ndoce G." } },
      { "id": "e17", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "playerOut": { "id": "p_zmrhal_j", "name": "Zmrhal J." } },
      { "id": "e18", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_stojanek_p", "name": "Štěpánek P." }, "playerOut": { "id": "p_souček_d", "name": "Souček D." } },
      { "id": "e19", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_mervic_d", "name": "Mervič D." }, "playerOut": { "id": "p_polidar_m", "name": "Polidar M." } }
    ]
  },
  {
    "id": "2025-10-26-dukla-slovacko",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "score": { "home": 1, "away": 0 },
    "status": "finished",
    "date": "2025-10-26T14:30:00Z",
    "stadium": "Juliska",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 14, "team": "home", "type": "goal", "player": { "id": "p_čermák_m", "name": "Čermák M." }, "assistPlayer": { "id": "p_kroupa_m", "name": "Kroupa M." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_juricka_p", "name": "Jurička P." }, "playerOut": { "id": "p_kosiolik_m", "name": "Kosiolik M." } },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_havlik_m", "name": "Havlík M." }, "playerOut": { "id": "p_marinelli_a", "name": "Marinelli A." } },
      { "id": "e4", "minute": 46, "team": "away", "type": "yellow_card", "player": { "id": "p_hamza_j", "name": "Hamza J." }, "note": "Podražení" },
      { "id": "e5", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_velasquez_j", "name": "Velasquez J." }, "playerOut": { "id": "p_polak_v", "name": "Polák V." } },
      { "id": "e6", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_kroupa_m", "name": "Kroupa M." }, "playerOut": { "id": "p_jedlička_t", "name": "Jedlička T." } },
      { "id": "e7", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerOut": { "id": "p_stojcevski_a", "name": "Stojcevski A." } },
      { "id": "e8", "minute": 72, "team": "away", "type": "substitution", "playerIn": { "id": "p_petrzela_m", "name": "Petržela M." }, "playerOut": { "id": "p_ndefe_g", "name": "Ndefe G." } },
      { "id": "e9", "minute": 80, "team": "home", "type": "substitution", "playerIn": { "id": "p_kozák_m", "name": "Kozák M." }, "playerOut": { "id": "p_zlatnik_m", "name": "Zlatník M." } },
      { "id": "e10", "minute": 80, "team": "home", "type": "substitution", "playerIn": { "id": "p_čermák_m", "name": "Čermák M." }, "playerOut": { "id": "p_sebrle_š", "name": "Šebrle Š." } },
      { "id": "e11", "minute": 83, "team": "away", "type": "substitution", "playerIn": { "id": "p_krmančík_m", "name": "Krmančík M." }, "playerOut": { "id": "p_trávník_m", "name": "Trávník M." } },
      { "id": "e12", "minute": 87, "team": "home", "type": "substitution", "playerIn": { "id": "p_čermák_m", "name": "Čermák M." }, "playerOut": { "id": "p_domanyik_r", "name": "Domanyik R." } },
      { "id": "e13", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_hrubost", "name": "Hrubost" }, "note": "Malovanyi V." }
    ]
  },
  {
    "id": "2025-10-26-plzen-ostrava",
    "homeTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-10-26T14:30:00Z",
    "stadium": "Doosan Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 8, "team": "home", "type": "yellow_card", "player": { "id": "p_kalvach_l", "name": "Kalvach L." }, "note": "Hrubost" },
      { "id": "e2", "minute": 10, "team": "home", "type": "goal", "player": { "id": "p_adu_p", "name": "Adu P." }, "assistPlayer": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 23, "team": "home", "type": "yellow_card", "player": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "note": "Držení" },
      { "id": "e4", "minute": 32, "team": "away", "type": "yellow_card", "player": { "id": "p_pojezny_k", "name": "Pojezný K." }, "note": "Faul" },
      { "id": "e5", "minute": 41, "team": "home", "type": "yellow_card", "player": { "id": "p_adu_p", "name": "Adu P." }, "note": "Nesportovní chování" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_kalvach_l", "name": "Kalvach L." }, "playerOut": { "id": "p_cerv_l", "name": "Červ L." } },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerOut": { "id": "p_spacil_k", "name": "Spáčil K." } },
      { "id": "e8", "minute": 58, "team": "away", "type": "substitution", "playerIn": { "id": "p_rine_m", "name": "Rine M." }, "playerOut": { "id": "p_abeid_e", "name": "Abeid E." } },
      { "id": "e9", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_rusnak_m", "name": "Rusnák M." }, "playerOut": { "id": "p_owusu_d", "name": "Owusu D." } },
      { "id": "e10", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_juroska_p", "name": "Juroška P." }, "playerOut": { "id": "p_frydrych_m", "name": "Frydrych M." } },
      { "id": "e11", "minute": 65, "team": "away", "type": "substitution", "playerIn": { "id": "p_kubala_f", "name": "Kubala F." }, "playerOut": { "id": "p_prekop_e", "name": "Prekop E." } },
      { "id": "e12", "minute": 77, "team": "home", "type": "substitution", "playerIn": { "id": "p_cerv_l", "name": "Červ L." }, "playerOut": { "id": "p_valenta_m", "name": "Valenta M." } },
      { "id": "e13", "minute": 77, "team": "home", "type": "substitution", "playerIn": { "id": "p_ladra_t", "name": "Ladra T." }, "playerOut": { "id": "p_souare_c", "name": "Souaré C." } },
      { "id": "e14", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_sinácký_p", "name": "Šinácký P." }, "playerOut": { "id": "p_boula_f.", "name": "Boula F." } },
      { "id": "e15", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_zlatihlavek_f", "name": "Zlatohlávek F." }, "playerOut": { "id": "p_chaluš_m.", "name": "Chaluš M." } },
      { "id": "e16", "minute": 84, "team": "home", "type": "substitution", "playerIn": { "id": "p_havel_m", "name": "Havel M." }, "playerOut": { "id": "p_durosinmi_r", "name": "Durosinmi R." } },
      { "id": "e17", "minute": 90, "team": "home", "type": "goal", "player": { "id": "p_musil_a", "name": "Musil A." }, "assistPlayer": { "id": "p_souare_c", "name": "Souaré C." }, "scoreUpdate": "2-0" },
      { "id": "e18", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_kubala_f", "name": "Kubala F." }, "note": "Nesportovní chování" }
    ]
  },
  {
    "id": "2025-10-26-mlada-boleslav-karvina",
    "homeTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_kar", "name": "Karviná", "logo": "" },
    "score": { "home": 2, "away": 4 },
    "status": "finished",
    "date": "2025-10-26T14:30:00Z",
    "stadium": "Lokotrans Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 10, "team": "away", "type": "goal", "player": { "id": "p_gring_a", "name": "Gring A." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 24, "team": "away", "type": "yellow_card", "player": { "id": "p_ayaosi_c", "name": "Ayaosi C." }, "note": "Podražení" },
      { "id": "e3", "minute": 45, "team": "home", "type": "goal", "player": { "id": "p_zitka_j", "name": "Žitka J." }, "assistPlayer": { "id": "p_vokrinek_t", "name": "Vokřínek T." }, "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_kostka_d", "name": "Kostka D." }, "playerOut": { "id": "p_kabat_m", "name": "Kabát M." } },
      { "id": "e5", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_strmiska_m", "name": "Strmiska M." }, "playerOut": { "id": "p_kremesa_m", "name": "Křemeša M." } },
      { "id": "e6", "minute": 47, "team": "away", "type": "goal", "player": { "id": "p_samko_d", "name": "Samko D." }, "assistPlayer": { "id": "p_gring_a", "name": "Gring A." }, "scoreUpdate": "1-2" },
      { "id": "e7", "minute": 51, "team": "away", "type": "goal", "player": { "id": "p_storman_r", "name": "Štorman R." }, "assistPlayer": { "id": "p_gring_a", "name": "Gring A." }, "scoreUpdate": "1-3" },
      { "id": "e8", "minute": 58, "team": "away", "type": "goal", "player": { "id": "p_ayaosi_c", "name": "Ayaosi C." }, "assistPlayer": { "id": "p_storman_r", "name": "Štorman R." }, "scoreUpdate": "1-4" },
      { "id": "e9", "minute": 58, "team": "away", "type": "substitution", "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_singhateh_m", "name": "Singhateh M." } },
      { "id": "e10", "minute": 58, "team": "away", "type": "substitution", "playerIn": { "id": "p_conde_o", "name": "Conde O." }, "playerOut": { "id": "p_ayaosi_c", "name": "Ayaosi C." } },
      { "id": "e11", "minute": 62, "team": "home", "type": "substitution", "playerIn": { "id": "p_vojta_m", "name": "Vojta M." }, "playerOut": { "id": "p_klima_j", "name": "Klíma J." } },
      { "id": "e12", "minute": 62, "team": "home", "type": "yellow_card", "player": { "id": "p_puskac_d", "name": "Puškáč D." }, "note": "Kusal D." },
      { "id": "e13", "minute": 67, "team": "home", "type": "yellow_card", "player": { "id": "p_zika_j", "name": "Žitka J." }, "note": "Strmiska M." },
      { "id": "e14", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_berman_v", "name": "Berman V." }, "playerOut": { "id": "p_gring_a", "name": "Gring A." } },
      { "id": "e15", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_fiala_j", "name": "Fiala J." }, "playerOut": { "id": "p_samko_d", "name": "Samko D." } },
      { "id": "e16", "minute": 73, "team": "home", "type": "goal", "player": { "id": "p_lehky_f", "name": "Lehký F." }, "scoreUpdate": "2-4" },
      { "id": "e17", "minute": 78, "team": "away", "type": "substitution", "playerIn": { "id": "p_boháč_s", "name": "Boháč S." }, "playerOut": { "id": "p_ezah_l", "name": "Ezah L." } },
      { "id": "e18", "minute": 84, "team": "home", "type": "substitution", "playerIn": { "id": "p_porub_d", "name": "Porub D." }, "playerOut": { "id": "p_dohnál_d", "name": "Dohnál D." } },
      { "id": "e19", "minute": 90, "team": "home", "type": "goal", "player": { "id": "p_klima_j", "name": "Klíma J." }, "note": "Neproměněná penalta" }
    ]
  },
  {
    "id": "2025-10-26-zlin-pardubice",
    "homeTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "awayTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "score": { "home": 2, "away": 2 },
    "status": "finished",
    "date": "2025-10-26T14:30:00Z",
    "stadium": "Letná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 23, "team": "away", "type": "goal_disallowed", "player": { "id": "p_solil_t", "name": "Solil T." }, "note": "Neuznaný gól - faul" },
      { "id": "e2", "minute": 44, "team": "home", "type": "yellow_card", "player": { "id": "p_didiba_j", "name": "Didiba J." }, "note": "Podražení" },
      { "id": "e3", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_bartosák_l", "name": "Bartošák L." }, "playerOut": { "id": "p_koubek_m", "name": "Koubek M." } },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_klepka_a", "name": "Klepka A." }, "playerOut": { "id": "p_poznar_t", "name": "Poznar T." } },
      { "id": "e5", "minute": 54, "team": "home", "type": "goal", "player": { "id": "p_didiba_j", "name": "Didiba J." }, "assistPlayer": { "id": "p_kozhushko_m", "name": "Kozhushko M." }, "scoreUpdate": "1-0" },
      { "id": "e6", "minute": 55, "team": "away", "type": "goal", "player": { "id": "p_vanko_a", "name": "Vanko A." }, "assistPlayer": { "id": "p_dancák_s", "name": "Dancák S." }, "scoreUpdate": "1-1" },
      { "id": "e7", "minute": 62, "team": "home", "type": "goal", "player": { "id": "p_kozhushko_m", "name": "Kozhushko M." }, "assistPlayer": { "id": "p_pilař_m", "name": "Pilař M." }, "scoreUpdate": "2-1" },
      { "id": "e8", "minute": 63, "team": "away", "type": "substitution", "playerIn": { "id": "p_krobot_l", "name": "Krobot L." }, "playerOut": { "id": "p_vachuta_f", "name": "Vachuta F." } },
      { "id": "e9", "minute": 71, "team": "away", "type": "goal", "player": { "id": "p_petruta_s", "name": "Petruta S." }, "assistPlayer": { "id": "p_panák_f.", "name": "Panák F." }, "scoreUpdate": "2-2" },
      { "id": "e10", "minute": 76, "team": "away", "type": "substitution", "playerIn": { "id": "p_lavíčka_v.", "name": "Lavíčka V." }, "playerOut": { "id": "p_mansaverk_s", "name": "Mansaverk S." } },
      { "id": "e11", "minute": 79, "team": "home", "type": "substitution", "playerIn": { "id": "p_poznar_t.", "name": "Poznar T." }, "playerOut": { "id": "p_kanu_s.", "name": "Kanu S." } },
      { "id": "e12", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_valenta_m.", "name": "Valenta M." }, "playerOut": { "id": "p_ranel_p.", "name": "Ranel P." } },
      { "id": "e13", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_solil_t.", "name": "Solil T." }, "playerOut": { "id": "p_botos_g.", "name": "Botoš G." } },
      { "id": "e14", "minute": 86, "team": "home", "type": "substitution", "playerIn": { "id": "p_sojka_a.", "name": "Sojka A." }, "playerOut": { "id": "p_ulrich_t.", "name": "Ulrich T." } },
      { "id": "e15", "minute": 86, "team": "away", "type": "yellow_card", "player": { "id": "p_sychra_v.", "name": "Sychra V." }, "note": "Hrubost" },
      { "id": "e16", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_cupak_m.", "name": "Cupák M." }, "playerOut": { "id": "p_kalabiska_j.", "name": "Kalabiška J." } },
      { "id": "e17", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_smihalik_o.", "name": "Šmihalík O." }, "playerOut": { "id": "p_vanko_a.", "name": "Vanko A." } },
      { "id": "e18", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_hombek_d.", "name": "Hombek D." }, "note": "Držení" }
    ]
  },
  {
    "id": "2025-10-26-olomouc-slavia",
    "homeTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "awayTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "score": { "home": 0, "away": 0 },
    "status": "finished",
    "date": "2025-10-26T17:30:00Z",
    "stadium": "Andrův stadion",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "13",
    "events": [
      { "id": "e1", "minute": 32, "team": "home", "type": "yellow_card", "player": { "id": "p_slama_j.", "name": "Sláma J." }, "note": "Nesportovní chování" },
      { "id": "e2", "minute": 33, "team": "away", "type": "yellow_card", "player": { "id": "p_kadlec_m.", "name": "Kadlec M." }, "note": "Nesportovní chování" },
      { "id": "e3", "minute": 45, "team": "home", "type": "yellow_card", "player": { "id": "p_muritala_y.", "name": "Muritala Y." }, "note": "Nesportovní chování" },
      { "id": "e4", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_slama_j.", "name": "Sláma J." }, "playerOut": { "id": "p_haly_t.", "name": "Haly T." }, "note": "Zranění" },
      { "id": "e5", "minute": 57, "team": "home", "type": "substitution", "playerIn": { "id": "p_dancak_a.", "name": "Dancák A." }, "playerOut": { "id": "p_sip_j.", "name": "Šíp J." } },
      { "id": "e6", "minute": 58, "team": "away", "type": "yellow_card", "player": { "id": "p_vokrinek_t.", "name": "Vokřínek T." }, "note": "Hrubost" },
      { "id": "e7", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_grull_m.", "name": "Grull M." }, "playerOut": { "id": "p_mikulenka_m.", "name": "Mikulenka M." } },
      { "id": "e8", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_vodhanel_j.", "name": "Vodháněl J." }, "playerOut": { "id": "p_langer_a.", "name": "Langer A." } },
      { "id": "e9", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_sevcik_p.", "name": "Ševčík P." }, "playerOut": { "id": "p_zafeiris_c.", "name": "Zafeiris C." } },
      { "id": "e10", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_chytil_m.", "name": "Chytil M." }, "playerOut": { "id": "p_zmrhal_j.", "name": "Zmrhal J." } },
      { "id": "e11", "minute": 80, "team": "away", "type": "substitution", "playerIn": { "id": "p_chaloupek_š.", "name": "Chaloupek Š." }, "playerOut": { "id": "p_buďa_f.", "name": "Buďa F." } },
      { "id": "e12", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_sip_j.", "name": "Šíp J." }, "note": "Nesportovní pád" },
      { "id": "e13", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_prekop_e.", "name": "Prekop E." }, "playerOut": { "id": "p_masa_d.", "name": "Maša D." } },
      { "id": "e14", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_javorina_t.", "name": "Javořina T." }, "note": "Držení míče" }
    ]
  },
{
    "id": "2025-11-02-bohemians-hradec",
    "homeTeam": { "id": "t_boh", "name": "Bohemians 1905", "logo": "" },
    "awayTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
    "score": { "home": 1, "away": 2 },
    "status": "finished",
    "date": "2025-11-02T15:30:00Z",
    "stadium": "Ďolíček",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 9, "team": "home", "type": "goal_disallowed", "player": { "id": "p_hulka_l", "name": "Hůlka L." }, "note": "Ofsajd" },
      { "id": "e2", "minute": 55, "team": "home", "type": "goal", "player": { "id": "p_okeke_n", "name": "Okeke N." }, "assistPlayer": { "id": "p_sinyavskiy_v", "name": "Sinyavskiy V." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 57, "team": "away", "type": "substitution", "playerIn": { "id": "p_vlkanova_a", "name": "Vlkanova A." }, "playerOut": { "id": "p_sloncik_t", "name": "Slončík T." } },
      { "id": "e4", "minute": 59, "team": "away", "type": "goal", "player": { "id": "p_vlkanova_a", "name": "Vlkanova A." }, "assistPlayer": { "id": "p_kucera_j", "name": "Kučera J." }, "scoreUpdate": "1-1" },
      { "id": "e5", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_smrz_v", "name": "Smrž V." }, "playerOut": { "id": "p_ristovski_m", "name": "Ristovski M." } },
      { "id": "e6", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_yusuf", "name": "Yusuf" }, "playerOut": { "id": "p_drahal_v", "name": "Drchal V." } },
      { "id": "e7", "minute": 66, "team": "away", "type": "goal", "player": { "id": "p_darida_v", "name": "Darida V." }, "scoreUpdate": "1-2" },
      { "id": "e8", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_mihalik_o", "name": "Mihálik O." }, "playerOut": { "id": "p_van_buren_m", "name": "van Buren M." } },
      { "id": "e9", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_sojka_a", "name": "Sojka A." }, "playerOut": { "id": "p_pilar_v", "name": "Pilař V." } },
      { "id": "e10", "minute": 80, "team": "home", "type": "substitution", "playerIn": { "id": "p_kosek_d", "name": "Kosek D." }, "playerOut": { "id": "p_kadlec_a", "name": "Kadlec A." } },
      { "id": "e11", "minute": 90, "team": "home", "type": "missed_penalty", "player": { "id": "p_ramirez_e", "name": "Ramirez E." } },
      { "id": "e12", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_horak_d", "name": "Horák D." }, "note": "Držení" },
      { "id": "e13", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_kovarik_j", "name": "Kovařík J." }, "playerOut": { "id": "p_hruby_r", "name": "Hrubý R." } },
      { "id": "e14", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_vondra_j", "name": "Vondra J." }, "playerOut": { "id": "p_hybs_m", "name": "Hybš M." } },
      { "id": "e15", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_griger_a", "name": "Griger A." }, "playerOut": { "id": "p_dancak_s", "name": "Dancák S." } }
    ]
  },
  {
    "id": "2025-11-02-teplice-plzen",
    "homeTeam": { "id": "t_tep", "name": "Teplice", "logo": "" },
    "awayTeam": { "id": "t_plz", "name": "Viktoria Plzeň", "logo": "" },
    "score": { "home": 1, "away": 2 },
    "status": "finished",
    "date": "2025-11-02T18:30:00Z",
    "stadium": "Na Stínadlech",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 34, "team": "home", "type": "goal", "player": { "id": "p_juta_j", "name": "Juta J." }, "scoreUpdate": "1-0" },
      { "id": "e2", "minute": 56, "team": "away", "type": "yellow_card", "player": { "id": "p_dweh_m", "name": "Dweh M." }, "note": "Hrubost" },
      { "id": "e3", "minute": 62, "team": "away", "type": "yellow_card", "player": { "id": "p_durosinmi_r", "name": "Durosinmi R." }, "note": "Hrubost" },
      { "id": "e4", "minute": 62, "team": "away", "type": "yellow_card", "player": { "id": "p_ladra_t", "name": "Ladra T." }, "note": "Doski M." },
      { "id": "e5", "minute": 63, "team": "away", "type": "goal", "player": { "id": "p_adu_p", "name": "Adu P." }, "assistPlayer": { "id": "p_souare_c", "name": "Souaré C." }, "scoreUpdate": "1-1" },
      { "id": "e6", "minute": 75, "team": "home", "type": "substitution", "playerIn": { "id": "p_marecek_d", "name": "Mareček D." }, "playerOut": { "id": "p_jukl_r", "name": "Jukl R." } },
      { "id": "e7", "minute": 75, "team": "home", "type": "substitution", "playerIn": { "id": "p_juta_j", "name": "Juta J." }, "playerOut": { "id": "p_svanda_j", "name": "Švanda J." } },
      { "id": "e8", "minute": 75, "team": "home", "type": "substitution", "playerIn": { "id": "p_kozák_m", "name": "Kozák M." }, "playerOut": { "id": "p_puskac_d", "name": "Puškáč D." } },
      { "id": "e9", "minute": 81, "team": "away", "type": "substitution", "playerIn": { "id": "p_havel_m", "name": "Havel M." }, "playerOut": { "id": "p_durosinmi_r", "name": "Durosinmi R." } },
      { "id": "e10", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_adu_p", "name": "Adu P." }, "playerOut": { "id": "p_hrubost", "name": "Stop na další zápas" } },
      { "id": "e11", "minute": 86, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeljkovic_a", "name": "Zeljkovič A." }, "playerOut": { "id": "p_spacil_k", "name": "Spáčil K." } },
      { "id": "e12", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_marecek_l", "name": "Mareček L." }, "playerOut": { "id": "p_takacs_l", "name": "Takács L." } },
      { "id": "e13", "minute": 90, "team": "home", "type": "substitution", "playerIn": { "id": "p_radosta_m", "name": "Radosta M." }, "playerOut": { "id": "p_bilak_m", "name": "Bilak M." } },
      { "id": "e14", "minute": 90, "team": "away", "type": "goal", "player": { "id": "p_jemelka_v", "name": "Jemelka V." }, "assistPlayer": { "id": "p_souare_c", "name": "Souaré C." }, "scoreUpdate": "1-2" },
      { "id": "e15", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_paluska_j", "name": "Paluska J." }, "note": "Zdržování hry" }
    ]
  },
  {
    "id": "2025-11-02-karvina-sparta",
    "homeTeam": { "id": "t_kar", "name": "Karviná", "logo": "" },
    "awayTeam": { "id": "t_spa", "name": "Sparta Praha", "logo": "" },
    "score": { "home": 2, "away": 1 },
    "status": "finished",
    "date": "2025-11-02T15:30:00Z",
    "stadium": "Městský stadion Karviná",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 8, "team": "away", "type": "yellow_card", "player": { "id": "p_uichenna_b", "name": "Uichenna B." }, "note": "Hrubost" },
      { "id": "e2", "minute": 23, "team": "home", "type": "yellow_card", "player": { "id": "p_holman_p", "name": "Holman P." }, "note": "Hrubost" },
      { "id": "e3", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_zeleny_j", "name": "Zelený J." }, "playerOut": { "id": "p_uichenna_c", "name": "Uichenna C." } },
      { "id": "e4", "minute": 49, "team": "away", "type": "yellow_card", "player": { "id": "p_marreverk_s", "name": "Marreverk S." }, "note": "Hrubost" },
      { "id": "e5", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_vydra_m", "name": "Vydra M." }, "playerOut": { "id": "p_marreverk_s", "name": "Marreverk S." } },
      { "id": "e6", "minute": 62, "team": "away", "type": "substitution", "playerIn": { "id": "p_rrahmani_a", "name": "Rrahmani A." }, "playerOut": { "id": "p_kuchta_j", "name": "Kuchta J." } },
      { "id": "e7", "minute": 63, "team": "home", "type": "goal", "player": { "id": "p_traore_a", "name": "Traore A." }, "assistPlayer": { "id": "p_krčík_d", "name": "Krčík D." }, "scoreUpdate": "1-0" },
      { "id": "e8", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_samko_d", "name": "Samko D." }, "playerOut": { "id": "p_storman_r", "name": "Štorman R." } },
      { "id": "e9", "minute": 72, "team": "away", "type": "goal", "player": { "id": "p_mercado_j", "name": "Mercado J." }, "assistPlayer": { "id": "p_dimancevski_v", "name": "Dimancevski V." }, "scoreUpdate": "1-1" },
      { "id": "e10", "minute": 76, "team": "away", "type": "yellow_card", "player": { "id": "p_haraslin_l", "name": "Haraslín L." }, "note": "Ryneš M." },
      { "id": "e11", "minute": 78, "team": "home", "type": "goal", "player": { "id": "p_gring_a", "name": "Gring A." }, "assistPlayer": { "id": "p_labík_a", "name": "Labík A." }, "scoreUpdate": "2-1" },
      { "id": "e12", "minute": 80, "team": "home", "type": "substitution", "playerIn": { "id": "p_sigut_s", "name": "Sigut S." }, "playerOut": { "id": "p_conde_o", "name": "Conde O." } },
      { "id": "e13", "minute": 84, "team": "home", "type": "yellow_card", "player": { "id": "p_ayaosi_c", "name": "Ayaosi C." }, "note": "Hrubost" },
      { "id": "e14", "minute": 84, "team": "away", "type": "yellow_card", "player": { "id": "p_eneme_s", "name": "Eneme S." }, "note": "Panák F." },
      { "id": "e15", "minute": 89, "team": "home", "type": "substitution", "playerIn": { "id": "p_labik_a", "name": "Labík A." }, "playerOut": { "id": "p_boháč_s", "name": "Boháč S." } },
      { "id": "e16", "minute": 89, "team": "home", "type": "substitution", "playerIn": { "id": "p_gring_a", "name": "Gring A." }, "playerOut": { "id": "p_ezah_l", "name": "Ezah L." }, "note": "Zranění" }
    ]
  },
  {
    "id": "2025-11-03-mlada-boleslav-olomouc",
    "homeTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
    "awayTeam": { "id": "t_olo", "name": "Sigma Olomouc", "logo": "" },
    "score": { "home": 1, "away": 4 },
    "status": "finished",
    "date": "2025-11-03T13:00:00Z",
    "stadium": "Lokotrans Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 9, "team": "away", "type": "goal", "player": { "id": "p_sip_j", "name": "Šíp J." }, "assistPlayer": { "id": "p_muritala_y", "name": "Muritala Y." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 34, "team": "away", "type": "yellow_card", "player": { "id": "p_spacil_l", "name": "Spáčil L." }, "note": "Hrubost" },
      { "id": "e3", "minute": 37, "team": "away", "type": "yellow_card", "player": { "id": "p_sip_j", "name": "Šíp J." }, "note": "Vokřínek T." },
      { "id": "e4", "minute": 45, "team": "away", "type": "goal", "player": { "id": "p_vašulín_d", "name": "Vašulín D." }, "assistPlayer": { "id": "p_muritala_y", "name": "Muritala Y." }, "scoreUpdate": "0-2" },
      { "id": "e5", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_haly_t", "name": "Haly T." }, "playerOut": { "id": "p_slama_j", "name": "Sláma J." } },
      { "id": "e6", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_langer_a", "name": "Langer A." }, "playerOut": { "id": "p_kvetoslav_t", "name": "Květoslav T." } },
      { "id": "e7", "minute": 62, "team": "home", "type": "yellow_card", "player": { "id": "p_zika_j", "name": "Žitka J." }, "note": "Podražení" },
      { "id": "e8", "minute": 64, "team": "home", "type": "substitution", "playerIn": { "id": "p_kostka_d", "name": "Kostka D." }, "playerOut": { "id": "p_vojta_m", "name": "Vojta M." }, "note": "Zranění" },
      { "id": "e9", "minute": 66, "team": "away", "type": "substitution", "playerIn": { "id": "p_navrátil_j", "name": "Navrátil J." }, "playerOut": { "id": "p_chvátal_j", "name": "Chvátal J." } },
      { "id": "e10", "minute": 66, "team": "away", "type": "substitution", "playerIn": { "id": "p_ambrose_a", "name": "Ambrose A." }, "playerOut": { "id": "p_sip_j", "name": "Šíp J." } },
      { "id": "e11", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_stransky_m", "name": "Stránský M." }, "playerOut": { "id": "p_john_s", "name": "John S." } },
      { "id": "e12", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_kremesa_m", "name": "Křemeša M." }, "playerOut": { "id": "p_ladra_t", "name": "Ladra T." } },
      { "id": "e13", "minute": 74, "team": "away", "type": "goal", "player": { "id": "p_langer_a", "name": "Langer A." }, "assistPlayer": { "id": "p_vodháněl_j", "name": "Vodháněl J." }, "scoreUpdate": "0-3" },
      { "id": "e14", "minute": 83, "team": "home", "type": "goal", "player": { "id": "p_kostka_d", "name": "Kostka D." }, "assistPlayer": { "id": "p_stransky_m", "name": "Stránský M." }, "scoreUpdate": "1-3" },
      { "id": "e15", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_zika_j", "name": "Žitka J." }, "playerOut": { "id": "p_macek_r", "name": "Macek R." } },
      { "id": "e16", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_langhamer_d", "name": "Langhamer D." }, "playerOut": { "id": "p_lehky_f", "name": "Lehký F." } },
      { "id": "e17", "minute": 87, "team": "away", "type": "goal", "player": { "id": "p_vašulín_d", "name": "Vašulín D." }, "scoreUpdate": "1-4" },
      { "id": "e18", "minute": 87, "team": "away", "type": "substitution", "playerIn": { "id": "p_fiala_m", "name": "Fiala M." }, "playerOut": { "id": "p_vašulín_d", "name": "Vašulín D." } }
    ]
  },
  {
    "id": "2025-11-01-slavia-ostrava",
    "homeTeam": { "id": "t_sla", "name": "Slavia Praha", "logo": "" },
    "awayTeam": { "id": "t_ban", "name": "Baník Ostrava", "logo": "" },
    "score": { "home": 2, "away": 0 },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "Eden Aréna",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 20, "team": "away", "type": "yellow_card", "player": { "id": "p_owusu_d", "name": "Owusu D." }, "note": "Protesty" },
      { "id": "e2", "minute": 33, "team": "home", "type": "goal_disallowed", "player": { "id": "p_dorley_o", "name": "Dorley O." }, "note": "Neuznaný gól - ruka" },
      { "id": "e3", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_pojezny_k", "name": "Pojezný K." }, "note": "Držení" },
      { "id": "e4", "minute": 53, "team": "away", "type": "yellow_card", "player": { "id": "p_rusnak_m", "name": "Rusnák M." }, "note": "Dweh D." },
      { "id": "e5", "minute": 53, "team": "away", "type": "yellow_card", "player": { "id": "p_boula_f", "name": "Boula F." }, "note": "Protesty" },
      { "id": "e6", "minute": 58, "team": "home", "type": "goal", "player": { "id": "p_vlcek_t", "name": "Vlček T." }, "assistPlayer": { "id": "p_diouf_e", "name": "Diouf E." }, "scoreUpdate": "1-0" },
      { "id": "e7", "minute": 61, "team": "away", "type": "yellow_card", "player": { "id": "p_prekop_e", "name": "Prekop E." }, "note": "Abeid E." },
      { "id": "e8", "minute": 62, "team": "home", "type": "goal", "player": { "id": "p_chytil_m", "name": "Chytil M." }, "assistPlayer": { "id": "p_sevcik_p", "name": "Ševčík P." }, "scoreUpdate": "2-0" },
      { "id": "e9", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_doudera_d", "name": "Doudera D." }, "playerOut": { "id": "p_zafeiris_c", "name": "Zafeiris C." } },
      { "id": "e10", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_sevcik_p", "name": "Ševčík P." }, "playerOut": { "id": "p_prekop_e", "name": "Prekop E." } },
      { "id": "e11", "minute": 65, "team": "home", "type": "substitution", "playerIn": { "id": "p_provod_l", "name": "Provod L." }, "playerOut": { "id": "p_kadlec_m", "name": "Kadlec M." } },
      { "id": "e12", "minute": 68, "team": "away", "type": "substitution", "playerIn": { "id": "p_musil_m", "name": "Musil M." }, "playerOut": { "id": "p_frydrych_m", "name": "Frydrych M." } },
      { "id": "e13", "minute": 68, "team": "away", "type": "substitution", "playerIn": { "id": "p_kvasina_m", "name": "Kvasina M." }, "playerOut": { "id": "p_kubala_f", "name": "Kubala F." } },
      { "id": "e14", "minute": 75, "team": "home", "type": "substitution", "playerIn": { "id": "p_chytil_m", "name": "Chytil M." }, "playerOut": { "id": "p_zafeiris_c", "name": "Zafeiris C." } },
      { "id": "e15", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_lischka_d", "name": "Lischka D." }, "playerOut": { "id": "p_pojezny_k", "name": "Pojezný K." } },
      { "id": "e16", "minute": 83, "team": "home", "type": "substitution", "playerIn": { "id": "p_mervic_d", "name": "Mervič D." }, "playerOut": { "id": "p_doudera_d", "name": "Doudera D." } },
      { "id": "e17", "minute": 90, "team": "away", "type": "yellow_card", "player": { "id": "p_chaluš_m", "name": "Chaluš M." }, "note": "Podražení" }
    ]
  },
  {
    "id": "2025-11-01-jablonec-zlin",
    "homeTeam": { "id": "t_jab", "name": "Jablonec", "logo": "" },
    "awayTeam": { "id": "t_zli", "name": "FC Zlín", "logo": "" },
    "score": { "home": 1, "away": 3 },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "Střelnice",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 5, "team": "away", "type": "goal", "player": { "id": "p_kanu_s", "name": "Kanu S." }, "assistPlayer": { "id": "p_didiba_j", "name": "Didiba J." }, "scoreUpdate": "0-1" },
      { "id": "e2", "minute": 34, "team": "away", "type": "yellow_card", "player": { "id": "p_ulrich_t", "name": "Ulrich T." }, "note": "Zranění - Didiba J." },
      { "id": "e3", "minute": 43, "team": "away", "type": "goal", "player": { "id": "p_bartosák_l", "name": "Bartošák L." }, "scoreUpdate": "0-2" },
      { "id": "e4", "minute": 45, "team": "away", "type": "goal", "player": { "id": "p_kanu_s", "name": "Kanu S." }, "assistPlayer": { "id": "p_ulrich_t", "name": "Ulrich T." }, "scoreUpdate": "0-3" },
      { "id": "e5", "minute": 45, "team": "away", "type": "yellow_card", "player": { "id": "p_bartosak_l", "name": "Bartošák L." }, "note": "Simulování" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "playerOut": { "id": "p_řízek_a", "name": "Řízek A." } },
      { "id": "e7", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_alegue_a", "name": "Alegue A." }, "playerOut": { "id": "p_polidar_m", "name": "Polidar M." } },
      { "id": "e8", "minute": 49, "team": "away", "type": "yellow_card", "player": { "id": "p_kozhushko_m", "name": "Kozhushko M." }, "note": "Kanu S." },
      { "id": "e9", "minute": 57, "team": "home", "type": "yellow_card", "player": { "id": "p_chanturishvili_v", "name": "Chanturishvili V." }, "note": "Hra rukou. Stop na další zápas" },
      { "id": "e10", "minute": 62, "team": "away", "type": "yellow_card", "player": { "id": "p_cupak_m", "name": "Cupák M." }, "note": "Podražení" },
      { "id": "e11", "minute": 63, "team": "home", "type": "substitution", "playerIn": { "id": "p_kruták_d", "name": "Kruták D." }, "playerOut": { "id": "p_havlíček_d", "name": "Havlíček D." } },
      { "id": "e12", "minute": 63, "team": "home", "type": "substitution", "playerIn": { "id": "p_zmrhal_j", "name": "Zmrhal J." }, "playerOut": { "id": "p_machan_j", "name": "Machan J." } },
      { "id": "e13", "minute": 65, "team": "away", "type": "yellow_card", "player": { "id": "p_hombek_d", "name": "Hombek D." }, "note": "Stop na další zápas" },
      { "id": "e14", "minute": 72, "team": "home", "type": "substitution", "playerIn": { "id": "p_javurek_l", "name": "Javůrek L." }, "playerOut": { "id": "p_malinsky_p", "name": "Malínský P." } },
      { "id": "e15", "minute": 74, "team": "away", "type": "yellow_card", "player": { "id": "p_kalabiska_j", "name": "Kalabiška J." }, "note": "Bartošák L." },
      { "id": "e16", "minute": 79, "team": "home", "type": "goal", "player": { "id": "p_pulkrab_m", "name": "Pulkrab M." }, "assistPlayer": { "id": "p_sedláček_r", "name": "Sedláček R." }, "scoreUpdate": "1-3" },
      { "id": "e17", "minute": 87, "team": "home", "type": "yellow_card", "player": { "id": "p_polidar_m", "name": "Polidar M." }, "note": "Puškač D." },
      { "id": "e18", "minute": 88, "team": "away", "type": "substitution", "playerIn": { "id": "p_klepka_a", "name": "Klepka A." }, "playerOut": { "id": "p_kozhushko_m", "name": "Kozhushko M." } },
      { "id": "e19", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_poznar_t", "name": "Poznar T." }, "playerOut": { "id": "p_ulrich_t", "name": "Ulrich T." } },
      { "id": "e20", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_petruta_s", "name": "Petruta S." }, "playerOut": { "id": "p_pilař_m", "name": "Pilař M." } }
    ]
  },
  {
    "id": "2025-11-01-pardubice-dukla",
    "homeTeam": { "id": "t_par", "name": "Pardubice", "logo": "" },
    "awayTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "score": { "home": 1, "away": 1 },
    "status": "finished",
    "date": "2025-11-01T15:00:00Z",
    "stadium": "CFIG Arena",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 24, "team": "away", "type": "yellow_card", "player": { "id": "p_hašek_f", "name": "Hašek F." }, "note": "Podražení" },
      { "id": "e2", "minute": 34, "team": "home", "type": "goal", "player": { "id": "p_krobot_l", "name": "Krobot L." }, "assistPlayer": { "id": "p_vanko_a", "name": "Vanko A." }, "scoreUpdate": "1-0" },
      { "id": "e3", "minute": 60, "team": "away", "type": "goal", "player": { "id": "p_krob_j", "name": "Krob J." }, "note": "Vlastní gól - Rommens P.", "scoreUpdate": "1-1" },
      { "id": "e4", "minute": 61, "team": "home", "type": "substitution", "playerIn": { "id": "p_sychra_v", "name": "Sychra V." }, "playerOut": { "id": "p_botos_g", "name": "Botoš G." } },
      { "id": "e5", "minute": 61, "team": "home", "type": "substitution", "playerIn": { "id": "p_krobot_l", "name": "Krobot L." }, "playerOut": { "id": "p_vachuta_f", "name": "Vachuta F." } },
      { "id": "e6", "minute": 70, "team": "home", "type": "substitution", "playerIn": { "id": "p_zeman_v", "name": "Zeman V." }, "playerOut": { "id": "p_barros_m", "name": "Barros M." } },
      { "id": "e7", "minute": 70, "team": "home", "type": "substitution", "playerIn": { "id": "p_polak_v", "name": "Polák V." }, "playerOut": { "id": "p_ranel_p", "name": "Ranel P." } },
      { "id": "e8", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_jedlicka_t", "name": "Jedlička T." }, "playerOut": { "id": "p_kroupa_m", "name": "Kroupa M." } },
      { "id": "e9", "minute": 72, "team": "home", "type": "yellow_card", "player": { "id": "p_surzyn_m", "name": "Surzyn M." }, "note": "Podražení" },
      { "id": "e10", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_donszezyk_p", "name": "Donszezyk P." }, "playerOut": { "id": "p_kadlec_j", "name": "Kadlec J." } },
      { "id": "e11", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_velesquaz_d", "name": "Velesquaz D." }, "playerOut": { "id": "p_čermák_m", "name": "Čermák M." } },
      { "id": "e12", "minute": 84, "team": "away", "type": "substitution", "playerIn": { "id": "p_peterka_j", "name": "Peterka J." }, "playerOut": { "id": "p_čermák_m", "name": "Čermák M." } },
      { "id": "e13", "minute": 85, "team": "home", "type": "yellow_card", "player": { "id": "p_solil_t", "name": "Solil T." }, "note": "Řezníček J." },
      { "id": "e14", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_surzyn_m", "name": "Surzyn M." }, "note": "Hrubost" },
      { "id": "e15", "minute": 90, "team": "away", "type": "substitution", "playerIn": { "id": "p_kozma_d", "name": "Kozma D." }, "playerOut": { "id": "p_laco_s", "name": "Laco S." } }
    ]
  },
  {
    "id": "2025-11-01-slovacko-liberec",
    "homeTeam": { "id": "t_slo", "name": "Slovácko", "logo": "" },
    "awayTeam": { "id": "t_lib", "name": "Slovan Liberec", "logo": "" },
    "score": { "home": 0, "away": 3 },
    "status": "finished",
    "date": "2025-11-01T16:00:00Z",
    "stadium": "Městský fotbalový stadion Miroslava Valenty",
    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
    "round": "14",
    "events": [
      { "id": "e1", "minute": 2, "team": "away", "type": "yellow_card", "player": { "id": "p_halinsky_d", "name": "Halinský D." }, "note": "Podražení" },
      { "id": "e2", "minute": 8, "team": "home", "type": "yellow_card", "player": { "id": "p_ndefe_g", "name": "Ndefe G." }, "note": "Brnění (zranění)" },
      { "id": "e3", "minute": 13, "team": "away", "type": "goal", "player": { "id": "p_krollis_r", "name": "Krollis R." }, "assistPlayer": { "id": "p_godavsky_v", "name": "Godavský V." }, "scoreUpdate": "0-1" },
      { "id": "e4", "minute": 20, "team": "away", "type": "yellow_card", "player": { "id": "p_kayondo_a", "name": "Kayondo A." }, "note": "Zdržování" },
      { "id": "e5", "minute": 28, "team": "home", "type": "yellow_card", "player": { "id": "p_marinelli_a", "name": "Marinelli A." }, "note": "Zranění (zranění)" },
      { "id": "e6", "minute": 46, "team": "home", "type": "substitution", "playerIn": { "id": "p_mulder_j", "name": "Mulder J." }, "playerOut": { "id": "p_reinberk_p", "name": "Reinberk P." } },
      { "id": "e7", "minute": 46, "team": "away", "type": "substitution", "playerIn": { "id": "p_dlask_f", "name": "Dlask F." }, "playerOut": { "id": "p_malovanyi_v", "name": "Malovanyi V." } },
      { "id": "e8", "minute": 52, "team": "home", "type": "yellow_card", "player": { "id": "p_stojcevski_a", "name": "Stojcevski A." }, "note": "Držení" },
      { "id": "e9", "minute": 58, "team": "away", "type": "yellow_card", "player": { "id": "p_mikaelsson_a", "name": "Mikaelsson A." }, "note": "Odp. kování" },
      { "id": "e10", "minute": 59, "team": "away", "type": "yellow_card", "player": { "id": "p_masek_l", "name": "Mašek L." }, "note": "Celik J." },
      { "id": "e11", "minute": 59, "team": "away", "type": "yellow_card", "player": { "id": "p_hodes_p", "name": "Hodeš P." }, "note": "Dulaj P." },
      { "id": "e12", "minute": 66, "team": "home", "type": "substitution", "playerIn": { "id": "p_hamza_j", "name": "Hamza J." }, "playerOut": { "id": "p_kvasina_m", "name": "Kvasina M." } },
      { "id": "e13", "minute": 66, "team": "home", "type": "substitution", "playerIn": { "id": "p_svatusek_m", "name": "Svatůšek M." }, "playerOut": { "id": "p_petrzela_m", "name": "Petržela M." } },
      { "id": "e14", "minute": 69, "team": "away", "type": "substitution", "playerIn": { "id": "p_masek_l", "name": "Mašek L." }, "playerOut": { "id": "p_celik_j", "name": "Celik J." } },
      { "id": "e15", "minute": 70, "team": "away", "type": "substitution", "playerIn": { "id": "p_latansay_l", "name": "Latansay L." }, "playerOut": { "id": "p_mikaelsson_a", "name": "Mikaelsson A." } },
      { "id": "e16", "minute": 74, "team": "away", "type": "goal", "player": { "id": "p_dlask_f", "name": "Dlask F." }, "assistPlayer": { "id": "p_krollis_r", "name": "Krollis R." }, "scoreUpdate": "0-2" },
      { "id": "e17", "minute": 77, "team": "away", "type": "substitution", "playerIn": { "id": "p_latansay_l", "name": "Latansay L." }, "playerOut": { "id": "p_hodes_p", "name": "Hodeš P." } },
      { "id": "e18", "minute": 79, "team": "away", "type": "substitution", "playerIn": { "id": "p_jurs_p", "name": "Jurs P." }, "playerOut": { "id": "p_krollis_r", "name": "Krollis R." } },
      { "id": "e19", "minute": 86, "team": "home", "type": "yellow_card", "player": { "id": "p_podrazky_m", "name": "Podrázký M." }, "note": "Mervič D." },
      { "id": "e20", "minute": 90, "team": "home", "type": "yellow_card", "player": { "id": "p_podrazky_m", "name": "Podrázký M." }, "note": "Zranění (zranění)" },
      { "id": "e21", "minute": 90, "team": "away", "type": "goal", "player": { "id": "p_masek_l", "name": "Mašek L." }, "scoreUpdate": "0-3" }
    ]
  },
{
    "id": "2025-11-08-t_duk-t_mbo",
    "homeTeam": { "id": "t_duk", "name": "Dukla Praha", "logo": "" },
    "awayTeam": { "id": "t_mbo", "name": "Mladá Boleslav", "logo": "" },
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
    "homeTeam": { "id": "t_hrk", "name": "Hradec Králové", "logo": "" },
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
