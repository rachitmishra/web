// import React, { useState } from 'react';

// const TossDecision = ({ tossStatus, onChoose }) => {
//   const [chosen, setChosen] = useState(null); // 'batting' or 'bowing'

//   const handleChoose = (option) => {
//     setChosen(option);
//     onChoose(option); // Pass choice back to parent component
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 mt-8">
//       {tossStatus !== null ? (
//         <div>
//           <p>You won the toss and chose to {tossStatus}!</p>
//           <p>Now choose whether to:</p>
//           <button
//             className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//               chosen === 'batting' ? 'bg-opacity-75' : ''
//             }`}
//             onClick={() => handleChoose('batting')}
//           >
//             Bat
//           </button>
//           <button
//             className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//               chosen === 'bowing' ? 'bg-opacity-75' : ''
//             }`}
//             onClick={() => handleChoose('bowing')}
//           >
//             Bowl
//           </button>
//         </div>
//       ) : (
//         <p>Toss is yet to happen.</p>
//       )}
//     </div>
//   );
// };

// export default TossDecision;
