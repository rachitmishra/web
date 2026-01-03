import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import 'tailwindcss/tailwind.css'; // Or your preferred styling library
import '../styles/globals.css';

export default function Scorecard() {
  const [gameId, setGameId] = useState(null); // Pass from previous page or fetch
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScores, setFinalScores] = useState(null); // { team1: { runs, wickets }, team2: { runs, wickets } }
  const [winningTeam, setWinningTeam] = useState(null);
  const [playerOfTheMatch, setPlayerOfTheMatch] = useState(null);

  useEffect(() => {
    // Fetch game details (replace with your API call or data source)
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/game-details', {
          params: { gameId }, // Pass gameId if not already fetched
        });
        if (response.data) {
          setGameId(response.data.id);
          if (response.data.gameOver) {
            setIsGameOver(true);
            setFinalScores(response.data.finalScores);
            setWinningTeam(response.data.winningTeam);
            setPlayerOfTheMatch(response.data.playerOfTheMatch);
          } else {
            // Handle case where game is still ongoing (consider redirecting?)
          }
        } else {
          // Handle error: game not found, etc.
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {isGameOver ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-8">Scorecard - Game #{gameId}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2>{finalScores?.team1?.name}</h2>
              <p>Runs: {finalScores?.team1?.runs}</p>
              <p>Wickets: {finalScores?.team1?.wickets}</p>
            </div>
            <div>
              <h2>{finalScores?.team2?.name}</h2>
              <p>Runs: {finalScores?.team2?.runs}</p>
              <p>Wickets: {finalScores?.team2?.wickets}</p>
            </div>
          </div>
          <h2 className="text-center mt-8">Winner: {winningTeam}</h2>
          {playerOfTheMatch && (
            <div className="text-center mt-4">
              <p>Player of the Match: {playerOfTheMatch}</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-center">Game is still in progress!</p>
      )}
    </div>
  );
}
