// import { useState, useEffect } from 'react';

// export const usePlayerOfTheMatch = (gameData) => {
//   const [playerOfTheMatch, setPlayerOfTheMatch] = useState(null);

//   useEffect(() => {
//     if (gameData && gameData.players) {
//       // Define your criteria for selecting player of the match
//       // Here's an example using highest combined runs and wickets:
//       let bestPlayer = null;
//       let bestScore = 0;
//       for (const player of gameData.players) {
//         const totalScore = player.runs + player.wickets;
//         if (totalScore > bestScore || !bestPlayer) {
//           bestPlayer = player;
//           bestScore = totalScore;
//         }
//       }
//       setPlayerOfTheMatch(bestPlayer);
//     }
//   }, [gameData]);

//   return playerOfTheMatch;
// };
