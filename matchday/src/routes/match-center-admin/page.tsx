import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tailwind CSS
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

export default function Scores() {
  const [batsmen, setBatsmen] = useState([
    { name: 'Batsman 1', runs: 0, balls: 0, dots: 0, fours: 0, sixes: 0, isOut: false },
    { name: 'Batsman 2', runs: 0, balls: 0, dots: 0, fours: 0, sixes: 0, isOut: false },
  ]);
  const [currentBatsman, setCurrentBatsman] = useState(0);
  const [bowler, setBowler] = useState({ name: 'Bowler', overs: 0, wickets: 0, maidens: 0, runs: 0 });
  const [teamScore, setTeamScore] = useState({ runs: 0, wickets: 0, overs: 0 });
  const [oversPerInnings, setOversPerInnings] = useState(50); // Can be fetched from API

  useEffect(() => {
    // Fetch initial data (batsmen, bowler, overs)
    // Your API implementation based on your data structure
    const fetchData = async () => {
      const response = await axios.get('/api/scoreboard');
      if (response.data) {
        setBatsmen(response.data.batsmen);
        setBowler(response.data.bowler);
        setTeamScore(response.data.teamScore);
        setOversPerInnings(response.data.oversPerInnings);
      }
    };
    fetchData();
  }, []);

  const handleRun = (value) => {
    const newBatsmen = [...batsmen];
    newBatsmen[currentBatsman].runs += value;
    if (value === 4) {
      newBatsmen[currentBatsman].fours++;
    } else if (value === 6) {
      newBatsmen[currentBatsman].sixes++;
    } else if (value === 0) {
      newBatsmen[currentBatsman].dots++;
    }
    setBatsmen(newBatsmen);
    setTeamScore({ ...teamScore, runs: teamScore.runs + value });
    
    // Logic for changing overs and strike
    const nextOver = Math.floor((teamScore.runs + value) / 6);
    if (nextOver > teamScore.overs) {
      setTeamScore({ ...teamScore, overs: nextOver });
      if (nextOver % 6 === 0) {
        setCurrentBatsman((currentBatsman + 1) % 2);
      }
    }
  };

  const handleWideBall = () => {
    setBowler({ ...bowler, extras: bowler.extras + 1 });
    setTeamScore({ ...teamScore, runs: teamScore.runs + 1 });
  };

  const handleNoBall = () => {
    setBowler({ ...bowler, extras: bowler.extras + 1 });
    setTeamScore({ ...teamScore, runs: teamScore.runs + 1 });
    // Handle additional ball for non-striker
    setBatsmen(prevState => {
      const nonStriker = (prevState.currentIndex + 1) % 2;
      return [...prevState, { ...prevState[nonStriker], balls: prevState[nonStriker].balls + 1 }]
    })
  };

  const handleOut = () => {
    // Implement out logic (update batsman, change strike, update wickets, etc.)
    const newBatsmen = [...batsmen];
  newBatsmen[currentBatsman].isOut = true;
  setBatsmen(newBatsmen);
  setTeamScore({ ...teamScore, runs: teamScore.runs + batsman.runs }); // Add any remaining runs

  const nextBatsman = (currentBatsman + 1) % 2;
  setCurrentBatsman(nextBatsman);

  if (batsmen[nextBatsman].isOut) {
    // Handle case where new batsman is already out (e.g., all out)
    return;
  }

  setTeamScore({ ...teamScore, wickets: teamScore.wickets + 1 });

  if (teamScore.wickets === 10 || teamScore.overs === oversPerInnings) {
    // End of innings logic
  } else {
    if (teamScore.runs % 6 === 0) {
      setTeamScore({ ...teamScore, overs: teamScore.overs + 1 });
      // Switch bowlers if applicable
    }
  }
  };

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
                    index === currentBatsman
                      ? 'bg-blue-200'
                      : 'bg-white'
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
              {bowler.name} - {bowler.overs.toFixed(1)} overs, {bowler.wickets} wickets, {bowler.extras} extras, {bowler.runs} runs
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
  
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => handleRun(0)} className="bg-gray-300 px-4 py-2 rounded">
            0
          </button>
          <button onClick={() => handleRun(1)} className="bg-gray-300 px-4 py-2 rounded">
            1
          </button>
          <button onClick={() => handleRun(2)} className="bg-gray-300 px-4 py-2 rounded">
            2
          </button>
          <button onClick={() => handleRun(3)} className="bg-gray-300 px-4 py-2 rounded">
            3
          </button>
          <button onClick={() => handleRun(4)} className="bg-gray-300 px-4 py-2 rounded">
            4
          </button>
          <button onClick={() => handleRun(6)} className="bg-gray-300 px-4 py-2 rounded">
            6
          </button>
          <button onClick={handleWideBall} className="bg-yellow-500 px-4 py-2 rounded">
            Wide
          </button>
          <button onClick={handleNoBall} className="bg-yellow-500 px-4 py-2 rounded">
            No Ball
          </button>
          <button onClick={handleOut} className="bg-red-500 px-4 py-2 rounded">
            Out
          </button>
        </div>
  
        {/* Additional features based on your requirements */}
        {/* Example: Wicket buttons for each batsman */}
        {batsmen.map((batsman, index) => (
          !batsman.isOut && (
            <button
              key={index}
              onClick={() => handleWicket(index)}
              className="bg-red-500 px-4 py-2 rounded mt-4"
            >
              Wicket - {batsman.name}
            </button>
          )
        ))}
  
        {/* Example: Update overs per innings dynamically */}
        <div className="mt-4 flex justify-center gap-4">
          <label htmlFor="overs" className="font-bold mr-2">
            Overs:
          </label>