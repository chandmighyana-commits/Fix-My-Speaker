import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  visualMode?: 'waveform' | 'frequency';
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  visualMode = 'waveform',
  height = 90,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnalyser = audioEngine.analyserNode;

    const render = () => {
      // Re-fetch in case analyser changed
      localAnalyser = audioEngine.analyserNode;
      const width = canvas.width;
      const canvasHeight = canvas.height;

      ctx.clearRect(0, 0, width, canvasHeight);

      // Dark futuristic subtle grid
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvasHeight / 2);
      ctx.lineTo(width, canvasHeight / 2);
      ctx.stroke();

      if (!isPlaying || !localAnalyser) {
        // Idle flatline with subtle gentle pulse
        ctx.strokeStyle = '#3f3f46';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvasHeight / 2);
        ctx.lineTo(width, canvasHeight / 2);
        ctx.stroke();
        return;
      }

      if (visualMode === 'waveform') {
        const bufferLength = localAnalyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        localAnalyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f59e0b'; // warm marigold / amber accent
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvasHeight) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, canvasHeight / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        const bufferLength = localAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        localAnalyser.getByteFrequencyData(dataArray);

        const barWidth = (width / (bufferLength / 2)) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (dataArray[i] / 255) * canvasHeight;

          // Gradient bar
          const gradient = ctx.createLinearGradient(0, canvasHeight, 0, 0);
          gradient.addColorStop(0, '#d97706');
          gradient.addColorStop(1, '#fbbf24');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvasHeight - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    if (isPlaying) {
      render();
    } else {
      render();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, visualMode]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950/80">
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        className="w-full block"
      />
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono tracking-wider">
        <span>{visualMode === 'waveform' ? 'TIME DOMAIN' : 'FFT SPECTRUM'}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400' : 'bg-neutral-600'}`}></span>
      </div>
    </div>
  );
};
