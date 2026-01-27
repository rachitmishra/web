import { useState, useRef } from "react";
import { Copy, User, Edit2, Save, Trash2, X, Lock, Share2, LogOut, ChevronDown, ChevronRight, Users, CloudOff } from "./Icons";
import Button from "./Button";
import { useSocial } from "../hooks/useSocial";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ShareCard from "./ShareCard";
import { toPng } from 'html-to-image';
import FriendItem from "./FriendItem";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const EMOJIS = ["😀", "😎", "🦊", "🚀", "🐯", "🌟", "🔥", "🦄", "🐼", "🦁"];

interface SocialPanelProps {
    localProfile?: { userName: string; emoji: string };
}

export default function SocialPanel({ localProfile }: SocialPanelProps) {
  const { friends, nudges, getInviteLink, nudgeFriend, removeFriend, checkUsernameAvailability, updateProfile, login, myProfile, deleteProfile, removeNudge } = useSocial();
  const { showToast } = useToast();
  const { setRecoveredUid, effectiveUid } = useAuth();
  const isOnline = useOnlineStatus();
  const isOffline = !isOnline;
  const inviteLink = getInviteLink();

  const currentName = myProfile.userName || localProfile?.userName;
  const currentEmoji = myProfile.emoji || localProfile?.emoji;

  const [isEditing, setIsEditing] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false); // Default collapsed
  
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("😀");
  const [newPasscode, setNewPasscode] = useState("");
  
  const [recUsername, setRecUsername] = useState("");
  const [recPasscode, setRecPasscode] = useState("");
  
  const [error, setError] = useState("");

  const shareCardRef = useRef<HTMLDivElement>(null);

  const startEditing = () => {
    setNewName(currentName || "");
    setNewEmoji(currentEmoji || "😀");
    setNewPasscode(myProfile.passcode || "");
    setIsEditing(true);
  };

  const copyLink = () => {
    if (!currentName) {
        setError("Please set a username before inviting friends.");
        startEditing();
        return;
    }
    if (inviteLink && navigator.clipboard) {
        navigator.clipboard.writeText(inviteLink)
            .then(() => showToast("Invite link copied to clipboard!"))
            .catch(err => console.error("Failed to copy:", err));
    } else {
        console.warn("Clipboard API not available or invite link is missing.");
    }
  };

  const handleNudge = (friendId: string) => {
    nudgeFriend(friendId);
    showToast("Nudge sent!");
  };

  const handleRemove = (friendId: string) => {
      if (window.confirm("Are you sure you want to remove this friend?")) {
          removeFriend(friendId);
          showToast("Friend removed.");
      }
  };

  const handleSaveProfile = async () => {
    setError("");
    if (!newName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (newName !== myProfile.userName) {
        const isAvailable = await checkUsernameAvailability(newName);
        if (!isAvailable) {
          setError("Username already taken");
          return;
        }
    }

    const success = await updateProfile(newName, newEmoji, newPasscode);
    if (success) {
      setIsEditing(false);
      showToast("Profile updated!");
    } else {
      setError("Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
      if (isOffline) {
          showToast("Cannot delete profile while offline.");
          return;
      }
      if (window.confirm("Are you sure you want to delete your profile? This cannot be undone and you will lose all progress.")) {
          const success = await deleteProfile();
          if (success) {
              // Clear local data manually since we don't have resetGame here
              localStorage.removeItem("kannadaStreak");
              localStorage.removeItem("kannadaCompleted");
              localStorage.removeItem("kannadaBadges");
              localStorage.removeItem("kannadaDuration");
              localStorage.removeItem("kannadaLastPlayed");
              localStorage.removeItem("recovered_uid");
              window.location.reload();
          } else {
              showToast("Error deleting profile");
          }
      }
  };

  const handleNudgeDismiss = (friend: any) => {
      showToast(`You were nudged by ${friend.userName}!`);
      removeNudge(friend.uid);
  };

  const handleRecovery = async () => {
      setError("");
      if (!recUsername || !recPasscode) {
          setError("Enter username and passcode");
          return;
      }
      
      const uid = await login(recUsername, recPasscode);
      if (uid) {
          setRecoveredUid(uid);
          showToast("Account recovered successfully!");
          setIsRecovering(false);
          setRecUsername("");
          setRecPasscode("");
      } else {
          setError("Invalid credentials");
      }
  };
  
  const handleLogout = () => {
      setRecoveredUid(null);
      showToast("Logged out from recovered account.");
  };

  const handleShare = async () => {
    if (shareCardRef.current === null) {
      showToast("Error generating share image.");
      return;
    }

    try {
      showToast("Generating image...");
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'my-kannadablitz-progress.png', { type: blob.type });

      if (navigator.share) {
          await navigator.share({
            title: 'My KannadaBlitz Learning Progress',
            text: `I'm on a ${myProfile.streak || 0} day streak learning Kannada with KannadaBlitz! My name is ${myProfile.userName || "a Friend"}. Come join the fun!`,
            files: [file],
          });
          showToast("Shared successfully!");
      } else {
          // Fallback to download
          const link = document.createElement('a');
          link.download = 'my-kannadablitz-progress.png';
          link.href = dataUrl;
          link.click();
          showToast("Image downloaded!");
      }
    } catch (err) {
      console.error('Error sharing:', err);
      showToast("Failed to share image.");
    }
  };


  if (isRecovering) {
      return (
          <div className="social-panel">
               <div className="social-header">
                    <h3 className="social-title social-title-recovery"><Lock size={20} /> Recover Account</h3>
                    <Button onClick={() => setIsRecovering(false)} variant="neutral"><X size={16} /></Button>
               </div>
               <div className="recover-form-container">
                   <p className="social-panel-recovery-description">Enter your unique username and passcode to restore your progress.</p>
                   <input 
                        type="text" 
                        placeholder="Username" 
                        value={recUsername} 
                        onChange={e => setRecUsername(e.target.value)}
                        className="social-panel-input"
                   />
                   <input 
                        type="password" 
                        placeholder="Passcode" 
                        value={recPasscode} 
                        onChange={e => setRecPasscode(e.target.value)}
                        className="social-panel-input"
                   />
                   {error && <p className="social-panel-error">{error}</p>}
                   <Button onClick={handleRecovery}>Recover</Button>
               </div>
          </div>
      );
  }

  return (
    <div className="social-panel">
      {/* Hidden container for image generation */}
      <div className="share-card-hidden-wrapper">
          <ShareCard 
            ref={shareCardRef}
            userName={currentName || "Friend"}
            emoji={currentEmoji || "😀"}
            streak={myProfile.streak || 0}
            badges={myProfile.earnedBadges ? myProfile.earnedBadges.length : 0}
          />
      </div>

      {/* Profile Section - Always Visible */}
      <div className="social-panel-profile-section">
          {isEditing ? (
              <div className="profile-edit-form">
                  <div className="social-panel-form-group">
                      <label className="social-panel-form-label">Username</label>
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="social-panel-input"
                        disabled={!!myProfile.isCustomName || isOffline}
                      />
                  </div>
                  <div className="social-panel-form-group">
                      <label className="social-panel-form-label">Passcode (for recovery)</label>
                      <input 
                        type="text" 
                        value={newPasscode} 
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Set a secret passcode"
                        className="social-panel-input"
                        disabled={isOffline}
                      />
                  </div>
                  <div className="social-panel-form-group">
                      <label className="social-panel-form-label">Avatar</label>
                      <div className="social-panel-emoji-selector">
                          {EMOJIS.map(emoji => (
                              <button 
                                key={emoji} 
                                onClick={() => !isOffline && setNewEmoji(emoji)}
                                className={`social-panel-emoji-button ${newEmoji === emoji ? 'selected' : ''}`}
                                disabled={isOffline}
                              >
                                  {emoji}
                              </button>
                          ))}
                      </div>
                  </div>
                  {error && <p className="social-panel-error">{error}</p>}
                  <div className="social-panel-form-actions">
                      <Button onClick={handleSaveProfile} disabled={isOffline}>
                          <Save size={16} className="btn-icon-spacing"/> Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="neutral">
                          <X size={16} className="btn-icon-spacing"/> Cancel
                      </Button>
                      {myProfile.userName && (
                        <button 
                            onClick={handleDeleteProfile} 
                            className="btn-delete-icon"
                            title={isOffline ? "Unavailable offline" : "Delete Profile"}
                            disabled={isOffline}
                        >
                            <Trash2 size={18} />
                        </button>
                      )}
                  </div>
              </div>
          ) : (
              <div className="social-panel-profile-display">
                  <div className="social-panel-profile-info">
                      <div className="social-panel-profile-emoji">{currentEmoji || <User size={24} />}</div>
                      <div>
                          <div className="social-panel-profile-name">{currentName || "Anonymous"}</div>
                          {myProfile.passcode ? (
                              <div className="social-panel-passcode-status"><Lock size={10}/> Passcode set</div>
                          ) : (
                              <div className="social-panel-passcode-status">Set passcode to recover later</div>
                          )}
                      </div>
                  </div>
                  
                  <div className="social-panel-recovery-actions">
                       <button onClick={startEditing} className="social-panel-edit-button" aria-label="Edit Profile">
                          <Edit2 size={16} />
                       </button>
                       {effectiveUid && localStorage.getItem("recovered_uid") === effectiveUid ? (
                           <button onClick={handleLogout} className="social-panel-logout-button" title="Log Out">
                               <LogOut size={16} />
                           </button>
                       ) : (
                           <button 
                             onClick={() => !isOffline && setIsRecovering(true)} 
                             className="social-panel-recover-button"
                             disabled={isOffline}
                             title={isOffline ? "Unavailable offline" : ""}
                           >
                               Recover Account
                           </button>
                       )}
                  </div>
              </div>
          )}
      </div>

      {/* Collapsible Community Section */}
      <div 
        className={`community-toggle-header ${Object.keys(nudges || {}).length > 0 ? 'has-nudge' : ''}`}
        onClick={() => setIsCommunityOpen(!isCommunityOpen)}
      >
        <div className="social-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Friends {isOffline && <CloudOff size={16} title="Offline Mode" style={{ opacity: 0.6 }} />}
        </div>
        <div className="badge-toggle">
            {isCommunityOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>

      <div className={`community-content ${isCommunityOpen ? '' : 'collapsed'}`}>
          <div className="social-header">
            <div className="social-actions">
                <Button onClick={handleShare} variant="primary" fullWidth>
                    <Share2 size={16} /> Share Progress
                </Button>
                <Button 
                  onClick={() => !isOffline && copyLink()} 
                  variant="outline" 
                  fullWidth
                  disabled={isOffline}
                  title={isOffline ? "Unavailable offline" : ""}
                >
                   <Copy size={16} /> Invite Friend
                </Button>
            </div>
          </div>

          <div className="friends-list">
            {friends.length === 0 ? (
              <div className="empty-friends">
                <p>No friends yet. Invite someone to challenge them!</p>
              </div>
            ) : (
              friends.sort((a, b) => b.streak - a.streak).map((friend) => {
                const hasNudgedMe = nudges && nudges[friend.uid];
                return (
                    <FriendItem 
                        key={friend.uid} 
                        friend={friend} 
                        hasNudgedMe={!!hasNudgedMe} 
                        handleNudge={handleNudge}
                        handleRemove={handleRemove}
                        onAvatarClick={handleNudgeDismiss}
                        isOffline={isOffline}
                    />
                );
              })
            )}
          </div>
      </div>
    </div>
  );
}