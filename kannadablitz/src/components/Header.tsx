import { Home, Bell, BellOff, Settings, Globe, CloudOff } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import Button from "./Button";
import { type SupportedLanguage, supportedLanguages } from "../data";
import IconSelect from "./IconSelect";
import { useNotifications } from "../hooks/useNotifications";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

interface HeaderProps {
// ... (lines 14-41)
  onOpenSettings,
}: HeaderProps) {
  const { requestPermission, deactivateNotifications, isEnabled } = useNotifications();
  const isOnline = useOnlineStatus();

  const handleToggleNotifications = () => {
// ... (lines 68-76)
      <div className="fc-right">
        {!isOnline && (
            <div className="offline-badge" title="Offline Mode - Progress will sync later">
                <CloudOff size={20} />
            </div>
        )}
        {onOpenSettings && (
            <button 
// ... (lines 83-112)

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
