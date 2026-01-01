export const TEAM_LOGO_MAP: Record<string, string> = {
  "ac sparta praha": "/sparta.png",
  "sparta praha": "/sparta.png",
  "sk slavia praha": "/slavia.png",
  "slavia praha": "/slavia.png",
  "fc viktoria plzen": "/plzen.png",
  "viktoria plzen": "/plzen.png",
  "fc banik ostrava": "/banik.png",
  "banik ostrava": "/banik.png",
  "bohemians 1905": "/bohemka.png",
  "bohemians praha 1905": "/bohemka.png",
  "bohemians": "/bohemka.png",
  "fk mladá boleslav": "/boleslav.png",
  "fk mlada boleslav": "/boleslav.png",
  "mlada boleslav": "/boleslav.png",
  "sk sigma olomouc": "/olomouc.png",
  "sigma olomouc": "/olomouc.png",
  "fk teplice": "/teplice.png",
  "teplice": "/teplice.png",
  "fk jablonec": "/jablonec.png",
  "jablonec": "/jablonec.png",
  "1. fc slovacko": "/slovacko.png",
  "1 fc slovacko": "/slovacko.png",
  "slovacko": "/slovacko.png",
  "fc hradec kralove": "/hradec.png",
  "hradec kralove": "/hradec.png",
  "fk pardubice": "/pardubice.png",
  "pardubice": "/pardubice.png",
  "fc zlin": "/zlin.png",
  "zlin": "/zlin.png",
  "mfk karvina": "/karvina.png",
  "karvina": "/karvina.png",
  "slovan liberec": "/liberec.png",
  "dukla praha": "/dukla.png",
  "sk dynamo ceske budejovice": "/budejovice.png",
  "ceske budejovice": "/budejovice.png",
  "dynamo ceske budejovice": "/budejovice.png",
  "fc zbrojovka brno": "/brno.png",
  "zbrojovka brno": "/brno.png",
  "brno": "/brno.png",
  "1. fk pribram": "/pribram.png",
  "pribram": "/pribram.png"
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTeamLogo(name: string, original?: string): string {
  const key = normalizeName(name);
  const mapped = TEAM_LOGO_MAP[key];
  if (mapped) return mapped;
  if (original) return original;
  return "/logo192.png";
}
