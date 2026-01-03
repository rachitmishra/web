import React, { useState } from 'react';

export const VMConnect: React.FC = () => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const handleConnect = () => {
    if (status === 'connected') return;
    setStatus('connecting');
    setTimeout(() => {
      setStatus('connected');
    }, 2000);
  };

  return (
    <div className="vm-connect" onClick={handleConnect}>
      <div className={`indicator ${status === 'connected' ? 'connected' : ''}`} />
      <span>
        {status === 'disconnected' && 'Connect Cloud VM'}
        {status === 'connecting' && 'Provisioning...'}
        {status === 'connected' && 'debian-12-gcp-us-east1 (SSH)'}
      </span>
    </div>
  );
};
