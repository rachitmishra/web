// const FinishedMatch = ({ matchData }) => {
//     const router = useRouter();
  
//     const handleClickScorecard = () => {
//       router.push(`/scorecard/${matchData._id}`);
//     };
  
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-4 text-center">{matchData.name}</h1>
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex items-center">
//             <img src={team1Logo} alt={team1Name} className="w-16 h-16 rounded" />
//             <div className="ml-4">
//               <p className="text-lg font-medium">{team1Name}</p>
//               {/* Optional: Captain name, additional info */}
//             </div>
//           </div>
//           <div className={`flex items-center justify-center ${matchData.winner === team1Name ? 'text-green-500' : 'text-gray-500'}`}>
//             <p className="text-2xl font-bold">{matchData.scores.team1.runs} / {matchData.scores.team1.wickets}</p>
//           </div>
//           <div className="flex items-center">
//             <img src={team2Logo} alt={team2Name} className="w-16 h-16 rounded" />
//             <div className="ml-4">
//               <p className="text-lg font-medium">{team2Name}</p>
//               {/* Optional: Captain name, additional info */}
//             </div>
//           </div>
//         </div>
//         <p className="text-center font-medium text-bold mt-4">
//           {matchData.winner} won by {matchData.winningMargin} runs/wickets!
//         </p>
//         <button
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-8 mx-auto block"
//           onClick={handleClickScorecard}
//         >
//           View Scorecard
//         </button>
//       </div>
//     );
//   };