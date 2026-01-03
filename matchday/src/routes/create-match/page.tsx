import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

export default function CreateMatch() {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Emoji, setTeam1Emoji] = useState('');
  const [team2Emoji, setTeam2Emoji] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const teamNames = ['Dragons', 'Tigers', 'Lions', 'Eagles', 'Sharks', 'Falcons', 'Hawks', 'Cheetahs', 'Wolves', 'Knights'];
  const emojis = ['', '', '', '', '', '', '', '', '', '', '⚔️'];

  const handleRandomizeTeam = (teamId) => {
    const randomName = teamNames[Math.floor(Math.random() * teamNames.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const updatedName = `${randomName} XI`;

    if (teamId === 1) {
      setTeam1Name(updatedName);
      setTeam1Emoji(randomEmoji);
    } else {
      setTeam2Name(updatedName);
      setTeam2Emoji(randomEmoji);
    }
  };

  const handleChangeTeamName = (event, teamId) => {
    const updatedName = event.target.value.trim();
    if (teamId === 1) {
      setTeam1Name(updatedName);
    } else {
      setTeam2Name(updatedName);
    }
    setIsSubmitDisabled(!updatedName.endsWith('XI'));
  };

  const handleSubmit = () => {
    Router.push('/match-rules', { team1Name, team1Emoji, team2Name, team2Emoji }); // Redirect to match rules page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Create Your Cricket Match!</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="team-section">
          <h3>Team 1</h3>
          <input
            type="text"
            placeholder="Team 1 Name (ends with XI)"
            value={team1Name}
            onChange={(event) => handleChangeTeamName(event, 1)}
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2" onClick={() => handleRandomizeTeam(1)}>
            Randomize Name
          </button>
          {team1Emoji && <span className="text-2xl">{team1Emoji}</span>}
        </div>
        <div className="team-section">
          <h3>Team 2</h3>
          <input
            type="text"
            placeholder="Team 2 Name (ends with XI)"
            value={team2Name}
            onChange={(event) => handleChangeTeamName(event, 2)}
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2" onClick={() => handleRandomizeTeam(2)}>
            Randomize Name
          </button>
          {team2Emoji && <span className="text-2xl">{team2Emoji}</span>}
        </div>
      </div>

      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8 mx-auto block" disabled={isSubmitDisabled} onClick={handleSubmit}>
        Set Match Rules
      </button>
    </div>
  );
};
