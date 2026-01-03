import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Content } from './components/Content';
import { VMConnect } from './components/VMConnect';
import { UserProfile } from './components/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { courses } from './data/courses';
import Prism from 'prismjs';

// We need a wrapper component to use the useAuth hook
const Dashboard = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string>('kafka');
  const [currentDayId, setCurrentDayId] = useState<string>('0');
  const { userProgress, updateProgress } = useAuth();

  const currentTrack = courses[currentTrackId];
  const currentDay = currentTrack.days[currentDayId];

  useEffect(() => {
    // Highlight code when content changes
    Prism.highlightAll();
  }, [currentTrackId, currentDayId]);

  const handleTrackChange = (id: string) => {
    setCurrentTrackId(id);
    setCurrentDayId('0');
  };

  const handleDayChange = (id: string) => {
    setCurrentDayId(id);
  };

  const handleComplete = async () => {
    const currentDayNum = parseInt(currentDayId);
    
    // Update progress
    await updateProgress(currentTrackId, currentDayNum);
    
    // Move to next day if available
    const nextDayNum = currentDayNum + 1;
    if (currentTrack.days[String(nextDayNum)]) {
      setCurrentDayId(String(nextDayNum));
    }
  };

  const isCompleted = (userProgress[currentTrackId] || 0) >= parseInt(currentDayId);

  return (
    <div className="app-container">
      <Sidebar
        currentTrackId={currentTrackId}
        currentDayId={currentDayId}
        onTrackChange={handleTrackChange}
        onDayChange={handleDayChange}
      />
      
      <UserProfile />
      <VMConnect />

      <Content
        day={currentDay}
        track={currentTrack}
        onComplete={handleComplete}
        isCompleted={isCompleted}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;