import teamsData from '../shared/teams.json';
export interface Player {
  id: string;
  name: string;
  position?: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  stadium?: string;
  foundedYear?: number;
  coach?: string;
  players?: Player[];
}

export const TEAM_LIST: Team[] = teamsData as Team[];

export const TEAM_BY_ID: Record<string, Team> = TEAM_LIST.reduce((acc, team) => {
  acc[team.id] = team;
  return acc;
}, {} as Record<string, Team>);
