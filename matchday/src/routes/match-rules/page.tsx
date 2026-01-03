import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

export default function CreateMatch() {
  const [gameName, setGameName] = useState("");
  const [teamName1, setTeamName1] = useState("");
  const [teamName2, setTeamName2] = useState("");
  const [overs, setOvers] = useState(20);
  const [numberOfPlayers, setNumberOfPlayers] = useState(11);
  const [gameRules, setGameRules] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!gameName || !teamName1 || !teamName2) {
      alert("Please fill in all required fields.");
      return;
    }

    // Send data to your API to create the game
    const response = await fetch("/api/create-game", {
      method: "POST",
      body: JSON.stringify({
        gameName,
        teamName1,
        teamName2,
        overs,
        numberOfPlayers,
        gameRules,
      }),
    });

    if (response.ok) {
      // Redirect to game page or handle success
      console.log("Game created successfully!");
    } else {
      alert("Error creating game. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Create a Cricket Game
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gameName" className="font-bold">
            Game Name:
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:shadow-outline w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="teamName1" className="font-bold">
              Team 1 Name:
            </label>
            <input
              type="text"
              id="teamName1"
              value={teamName1}
              onChange={(e) => setTeamName1(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:shadow-outline w-full"
            />
          </div>
          <div>
            <label htmlFor="teamName2" className="font-bold">
              Team 2 Name:
            </label>
            <input
              type="text"
              id="teamName2"
              value={teamName2}
              onChange={(e) => setTeamName2(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:shadow-outline w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="overs" className="font-bold">
            Number of Overs:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              id="overs"
              min="1"
              max="50"
              value={overs}
              onChange={(e) => setOvers(parseInt(e.target.value))}
              className="w-full bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md cursor-pointer"
            />
            <span>{overs}</span>
          </div>
        </div>

        <div>
          <label htmlFor="numberOfPlayers" className="font-bold">
            Number of Players per Team:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              id="numberOfPlayers"
              min="5"
              max="11"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
              className="w-full bg-gray-200 focus:outline"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gameRules" className="font-bold">
            Game Rules (Optional):
          </label>
          <textarea
            id="gameRules"
            value={gameRules}
            onChange={(e) => setGameRules(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:shadow-outline w-full h-20"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Game
        </button>
      </form>
    </div>
  );
}