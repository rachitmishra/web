import { User, Trophy, Bell, Trash2 } from "./Icons";
import type { FriendProfile } from "../hooks/useSocial";

interface FriendItemProps {
    friend: FriendProfile;
    hasNudgedMe: boolean;
    handleNudge: (uid: string) => void;
    handleRemove: (uid: string) => void;
    onAvatarClick: (friend: FriendProfile) => void;
}

export default function FriendItem({ friend, hasNudgedMe, handleNudge, handleRemove, onAvatarClick }: FriendItemProps) {
    return (
            <div className="friend-item">
              <div className="friend-info">
                <div 
                    className={`avatar-wrapper ${hasNudgedMe ? "has-nudge" : ""}`}
                    onClick={() => hasNudgedMe && onAvatarClick(friend)}
                >
                  <div className="avatar-circle">
                    {friend.emoji ? <span className="emoji-lg">{friend.emoji}</span> : <User size={14} />}
                  </div>
                </div>
                <div>
                   <div className="friend-name">
                     {friend.userName}
                   </div>
                   <div className="friend-badges">{friend.earnedBadges.length} Badges</div>
                </div>
              </div>
              <div className="friend-stats">
                <div className="friend-streak">
                   <Trophy size={16} />
                   <span>{friend.streak}</span>
                </div>
                <button 
                  onClick={() => handleNudge(friend.uid)}
                  className="nudge-btn"
                  title="Send a nudge"
                >
                  <Bell size={18} />
                </button>
                <button
                    onClick={() => handleRemove(friend.uid)}
                    className="nudge-btn btn-outline-danger"
                    title="Remove friend"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
    );
}
