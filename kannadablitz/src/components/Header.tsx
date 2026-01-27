import { Home, Bell, BellOff, Settings, Globe, CloudOff } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { type SupportedLanguage, supportedLanguages } from "../data";
import IconSelect from "./IconSelect";
import { useNotifications } from "../hooks/useNotifications";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

interface HeaderProps {
  onBack?: () => void;
  center?: React.ReactNode;
  right?: React.ReactNode;
  variant?: "light" | "dark" | "auto";
  theme: "light" | "dark";
  toggleTheme: () => void;
  currentLanguage: SupportedLanguage;
  setCurrentLanguage: (lang: SupportedLanguage) => void;
  resetGame: () => void;
  showLanguageSelector?: boolean;
  onOpenSettings?: () => void;
}

export default function Header({
  onBack,
  center,
  right,
  variant = "auto",
  theme,
  toggleTheme,
  currentLanguage,
  setCurrentLanguage,
  resetGame,
  showLanguageSelector = false,
  onOpenSettings,
}: HeaderProps) {
  const { requestPermission, deactivateNotifications, isEnabled } = useNotifications();
  const isOnline = useOnlineStatus();

  const handleToggleNotifications = () => {
    if (isEnabled) {
      deactivateNotifications();
    } else {
      requestPermission();
    }
  };

  const handleLanguageChange = (val: string) => {
    setCurrentLanguage(val as SupportedLanguage);
    resetGame();
  };

  return (
    <div className="fc-header" data-variant={variant}>
      <div className="fc-left">
        {onBack && (
          <Button
            variant="surface"
            onClick={() => onBack && onBack()}
            className="btn--icon"
            aria-label="Back"
          >
            <Home size={18} />
          </Button>
        )}
      </div>

      <span className="fc-title">{center}</span>

      <div className="fc-right">
        {!isOnline && (
            <div className="offline-badge" title="Offline Mode - Progress will sync later">
                <CloudOff size={20} />
            </div>
        )}
        {onOpenSettings && (
            <button 
                onClick={onOpenSettings} 
                className="btn--icon btn-icon-transparent" 
                title="Settings"
            >
                <Settings size={20} />
            </button>
        )}
        <button 
            onClick={handleToggleNotifications} 
            className="btn--icon btn-icon-transparent" 
            title={isEnabled ? "Disable Notifications" : "Enable Notifications"}
        >
            {isEnabled ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
        {showLanguageSelector && (
          <IconSelect
            options={supportedLanguages}
            value={currentLanguage}
            onChange={handleLanguageChange}
            icon={<Globe size={20} />}
            ariaLabel="Select language"
          />
        )}
        {right}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}