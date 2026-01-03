import { useRef, useState } from 'react';
import BadgeShareCard from './BadgeShareCard';
import Button from './Button';
import { Share2, X, Save } from './Icons';
import { toPng } from 'html-to-image';
import { useToast } from '../context/ToastContext';

interface BadgeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeName: string;
  userName: string;
  emoji: string;
}

export default function BadgeShareModal({ isOpen, onClose, badgeName, userName, emoji }: BadgeShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `badge-${badgeName}.png`, { type: blob.type });

        if (navigator.share) {
            await navigator.share({
                title: 'Badge Unlocked!',
                text: `I just earned the "${badgeName}" badge on KannadaBlitz!`,
                files: [file]
            });
            showToast("Shared successfully!");
        } else {
             const link = document.createElement('a');
             link.download = `badge-${badgeName}.png`;
             link.href = dataUrl;
             link.click();
             showToast("Image downloaded!");
        }
    } catch (e) {
        console.error("Share failed", e);
        showToast("Failed to share image.");
    } finally {
        setIsSharing(false);
    }
  };

  return (
    <div className="habit-nudge-overlay" onClick={onClose}>
        <div className="habit-nudge-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '450px', width: '90%', padding: '1rem'}}>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
                <button onClick={onClose} className="btn--icon"><X /></button>
            </div>
            
            <h2 className="habit-nudge-title" style={{marginBottom: '1rem'}}>Share Achievement</h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                {/* 
                   We render the card here. On mobile 400px might be too wide.
                   We can use CSS transform to scale it down for preview if needed.
                */}
                <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center', height: '350px', width: '400px', display: 'flex', justifyContent: 'center' }}>
                     <BadgeShareCard ref={cardRef} userName={userName} emoji={emoji} badgeName={badgeName} />
                </div>
            </div>

            <div style={{marginTop: '0rem'}}>
                 <Button onClick={handleShare} fullWidth disabled={isSharing}>
                    {isSharing ? 'Generating...' : (typeof navigator.share === 'function' ? <><Share2 /> Share Badge</> : <><Save /> Download Image</>)}
                 </Button>
            </div>
        </div>
    </div>
  );
}
