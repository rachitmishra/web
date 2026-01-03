export const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio context errors
  }
};

export const pcmToWav = (base64Pcm: string, sampleRate: number) => {
  const binaryString = window.atob(base64Pcm);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const buffer = bytes.buffer;
  const view = new DataView(buffer);

  const wavBuffer = new ArrayBuffer(44 + buffer.byteLength);
  const wavView = new DataView(wavBuffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      wavView.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  wavView.setUint32(4, 32 + buffer.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  wavView.setUint32(16, 16, true);
  wavView.setUint16(20, 1, true); // PCM
  wavView.setUint16(22, 1, true); // Mono
  wavView.setUint32(24, sampleRate, true);
  wavView.setUint32(28, sampleRate * 2, true);
  wavView.setUint16(32, 2, true);
  wavView.setUint16(34, 16, true);
  writeString(36, "data");
  wavView.setUint32(40, buffer.byteLength, true);

  for (let i = 0; i < buffer.byteLength; i++) {
    wavView.setUint8(44 + i, view.getUint8(i));
  }

  return new Blob([wavBuffer], { type: "audio/wav" });
};
