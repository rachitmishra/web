
// const PendingMatch = ({ matchData }) => {
//     const router = useRouter();
  
//     const handleStartGame = () => {
//       // Redirect to start game page with appropriate routing and access control
//       router.push('/start-game');
//     };
  
//     const handleShareGame = () => {
//       // Implement sharing functionality (e.g., copy link, open social media share dialogue)
//       console.log('Sharing game...');
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
//           <div className="flex items-center">
//             <img src={team2Logo} alt={team2Name} className="w-16 h-16 rounded" />
//             <div className="ml-4">
//               <p className="text-lg font-medium">{team2Name}</p>
//               {/* Optional: Captain name, additional info */}
//             </div>
//           </div>
//         </div>
//         <p className="text-center font-medium text-orange-500 mt-4">Match Pending</p>
//         <div className="flex justify-center gap-4 mt-8">
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             onClick={handleStartGame}
//           >
//             Start Game
//           </button>
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             onClick={handleShareGame}
//           >
//             Share Game
//           </button>
//         </div>
//       </div>
//     );
//   };