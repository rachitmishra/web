import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Tailwind CSS
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

const teams = [
  {
    "_id": "1",
    "name": "The Lightning Bolts",
    "captainId": "2",
    "captain": {
      "name": "John Bolt",
      "role": "Batsman"
    },
    "players": [
      {
        "name": "Jane Quick",
        "role": "Wicket-keeper Batsman"
      },
      {
        "name": "Mark Power",
        "role": "All-rounder"
      },
    ]
  },
  {
    "_id": "2",
    "name": "The Flaming Arrows",
    "captainId": "5",
    "captain": {
      "name": "Mary Archer",
      "role": "Pace Bowler"
    },
    "players": [
      {
        "name": "David Swift",
        "role": "Opening Batsman"
      },
      {
        "name": "Emily Spin",
        "role": "Off-spinner"
      },
      // ... other players (add more objects here)
    ]
  },
  // ... more teams (add more objects here)
]

export default function JoinTeam() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch available teams (replace with your API call)
    setIsLoading(true);
    setError(null);
    setTeams(teams)
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam) {
      setError('Please select a team to join.');
      return;
    }

    // Call your API to join the selected team
    const response = await axios.post('/api/join-team', { teamId: selectedTeam });

    if (response.success) {
      router.push('/dashboard'); // Redirect to user dashboard
    } else {
      setError(response.message || 'Failed to join team.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Join a Team</h1>

      {isLoading ? (
        <p className="text-center">Loading teams...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="font-bold">Choose your team:</p>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Join Team
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}
