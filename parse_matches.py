import re
import json

# Mapping from Czech names to IDs
team_map = {
    "Dukla": "t_duk",
    "Plzeň": "t_plz",
    "Olomouc": "t_olo",
    "Zlín": "t_zli",
    "Boleslav": "t_mbo",
    "Hradec Králové": "t_hrk",
    "Slovácko": "t_slo",
    "Teplice": "t_tep",
    "Jablonec": "t_jab",
    "Slavia": "t_sla",
    "Karviná": "t_kar",
    "Bohemians": "t_boh",
    "Liberec": "t_lib",
    "Sparta": "t_spa",
    "Pardubice": "t_par",
    "Baník": "t_ban"
}

# Mapping IDs back to full names (for the object construction)
team_full_names = {
    "t_sla": "Slavia Praha",
    "t_spa": "Sparta Praha",
    "t_jab": "FK Jablonec",
    "t_olo": "SK Sigma Olomouc",
    "t_lib": "Slovan Liberec",
    "t_plz": "FC Viktoria Plzeň",
    "t_kar": "MFK Karviná",
    "t_hrk": "Hradec Králové",
    "t_zli": "FC Zlín",
    "t_boh": "Bohemians Praha 1905",
    "t_tep": "FK Teplice",
    "t_duk": "Dukla Praha",
    "t_mbo": "FK Mladá Boleslav",
    "t_par": "FK Pardubice",
    "t_slo": "1. FC Slovácko",
    "t_ban": "FC Baník Ostrava"
}

def parse_date(date_str):
    # Format: "16. 8. 25" or "20. 9."
    parts = date_str.split('.')
    day = int(parts[0].strip())
    month = int(parts[1].strip())
    year = 2025
    if len(parts) > 2 and parts[2].strip():
        y_str = parts[2].strip()
        if len(y_str) == 2:
            year = 2000 + int(y_str)
        else:
            year = int(y_str)
    
    return f"{year}-{month:02d}-{day:02d}T15:00:00Z" # Default time

def main():
    with open(r"c:\TP\temp_raw_matches.json", "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    matches = []
    current_round = ""
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        if "Skupinová fáze" in line:
            # Extract round
            # "Skupinová fáze · Hrací den 5/30"
            match = re.search(r"Hrací den (\d+)", line)
            if match:
                current_round = match.group(1)
            i += 1
            continue
            
        if line == "KONEC":
            # Start of a match block
            # Expected structure:
            # KONEC
            # Date
            # Home Team
            # Home Team (dup)
            # Home Score
            # Away Team
            # Away Team (dup)
            # Away Score
            
            try:
                date_str = lines[i+1]
                home_name_short = lines[i+2]
                # line i+3 is duplicate home name
                home_score = int(lines[i+4])
                away_name_short = lines[i+5]
                # line i+6 is duplicate away name
                away_score = int(lines[i+7])
                
                date = parse_date(date_str)
                home_id = team_map.get(home_name_short)
                away_id = team_map.get(away_name_short)
                
                if not home_id or not away_id:
                    print(f"Warning: Unknown team name {home_name_short} or {away_name_short}")
                    i += 8
                    continue

                match_id = f"{date[:10]}-{home_id}-{away_id}" # Simple ID generation
                
                match_obj = {
                    "id": match_id,
                    "homeTeam": { "id": home_id, "name": team_full_names[home_id], "logo": "" },
                    "awayTeam": { "id": away_id, "name": team_full_names[away_id], "logo": "" },
                    "score": { "home": home_score, "away": away_score },
                    "status": "finished",
                    "date": date,
                    "stadium": "Unknown", # We don't have stadium info in raw text easily, keeping it generic or look up from team data if needed
                    "competition": { "id": "chance", "name": "Chance Liga 2025/26" },
                    "round": current_round,
                    "events": []
                }
                matches.append(match_obj)
                
                i += 8 # Advance past this block
            except IndexError:
                break
        else:
            i += 1

    # Output as JSON
    print(json.dumps(matches, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
