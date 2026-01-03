import { useGameLogic } from "./hooks/useGameLogic";
import { HUD } from "./components/HUD";
import { Logo } from "./components/Logo";
import { AnimalDisplay } from "./components/AnimalDisplay";
import { AnimalGrid } from "./components/AnimalGrid";
import { EmptyState } from "./components/EmptyState";
import { FooterLegend } from "./components/FooterLegend";
import { ErrorToast } from "./components/ErrorToast";
import { KeyWaveAnimation } from "./components/KeyWaveAnimation";

export default function App() {
  const {
    displayType,
    currentAnimals,
    lastKeyPressed,
    lastPressId,
    isSpeaking,
    isGeneratingImage,
    error
  } = useGameLogic();

  return (
    <div className="app-container">
      <KeyWaveAnimation triggerId={lastPressId} />
      <Logo />
      <HUD 
        lastKeyPressed={lastKeyPressed} 
        displayType={displayType} 
        isSpeaking={isSpeaking} 
      />

      <main className="main-stage">
        {displayType === "single" && currentAnimals.length > 0 && (
          <AnimalDisplay 
            animal={currentAnimals[0]}
            isSpeaking={isSpeaking}
            isGeneratingImage={isGeneratingImage}
          />
        )}

        {displayType === "multiple" && (
          <AnimalGrid animals={currentAnimals} />
        )}

        {currentAnimals.length === 0 && (
          <EmptyState />
        )}
      </main>

      <FooterLegend />

      {error && <ErrorToast message={error} />}
    </div>
  );
}
