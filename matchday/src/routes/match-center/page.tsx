import React, { useState } from 'react';

export default function Scores() {
  const [batsmen, setBatsmen] = useState([
    { name: 'Batsman 1', runs: 0, balls: 0, dots: 0, fours: 0, sixes: 0, isOut: false },
    { name: 'Batsman 2', runs: 0, balls: 0, dots: 0, fours: 0, sixes: 0, isOut: false },
  ]);
  const [currentBatsman, setCurrentBatsman] = useState(0);
  const [bowler, setBowler] = useState({ name: 'Bowler', overs: 0, wickets: 0, maidenOvers: 0, runs: 0 });
  const [teamScore, setTeamScore] = useState({ runs: 0, wickets: 0, overs: 0 });

  // ... same handleRun, handleWideBall, handleNoBall, and handleOut logic as before ...

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Cricket Scoreboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 shadow-md p-4 rounded overflow-y-auto h-80">
          <h2>Batsmen</h2>
          <ul>
            {batsmen.map((batsman, index) => (
              <li
                key={index}
                className={`flex justify-between py-2 px-4 border-b ${
                  index === currentBatsman ? 'bg-blue-200' : 'bg-white'
                } 
                ${batsman.isOut ? 'text-gray-500 italic' : ''}`}
              >
                <span>{batsman.name}</span>
                <span>
                  {batsman.runs} ({batsman.fours}x4, {batsman.sixes}x6)
                </span>
                <span className="flex items-center">
                  {batsman.balls} ({batsman.dots}d)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-200 shadow-md p-4 rounded">
          <h2>Bowler</h2>
          <p>
            {bowler.name} - {bowler.overs.toFixed(1)} overs, {bowler.wickets} wickets, {bowler.maidenOvers} maidens, {bowler.runs} runs
          </p>
        </div>
      </div>

      <div className="bg-blue-500 text-white text-center p-4 rounded mt-8 flex justify-between">
        <h2>Team Score: {teamScore.runs}</h2>
        <div className="flex items-center">
          <span className="mr-2">Wkts: {teamScore.wickets}</span>
          <span>Overs: {teamScore.overs.toFixed(1)}</span>
        </div>
      </div>

      {/* Remove or adjust buttons section as needed based on your requirements */}
    </div>
  );
}
