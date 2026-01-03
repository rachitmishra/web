// import { useState, useEffect } from 'react';

// export const useMostImpactfulPlayer = (gameData, weightageFactors) => {
//   const [mostImpactfulPlayer, setMostImpactfulPlayer] = useState(null);

//   useEffect(() => {
//     if (gameData && gameData.players) {
//       // Define weightage factors for each impact category (adjust values as needed)
//       const defaultWeightage = {
//         runs: 0.3,
//         wickets: 0.2,
//         economy: 0.15,
//         strikeRate: 0.15,
//         catches: 0.1,
//       };

//       const weightage = weightageFactors ? { ...defaultWeightage, ...weightageFactors } : defaultWeightage;

//       // Calculate impact score for each player
//       let bestImpact = 0;
//       let bestPlayer = null;
//       for (const player of gameData.players) {
//         let impactScore = 0;
//         impactScore += player.runs * weightage.runs;
//         impactScore += player.wickets * weightage.wickets;
//         if (player.isBowler) {
//           impactScore += player.overs * weightage.economy * (6 - player.economy); // penalize high economy
//           impactScore += player.wickets * weightage.strikeRate / player.overs; // reward wickets & faster strike rate
//         }
//         impactScore += player.catches * weightage.catches;
//         if (impactScore > bestImpact || !bestPlayer) {
//           bestPlayer = player;
//           bestImpact = impactScore;
//         }
//       }
//       setMostImpactfulPlayer(bestPlayer);
//     }
//   }, [gameData, weightageFactors]);

//   return mostImpactfulPlayer;
// };
