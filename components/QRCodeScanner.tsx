import React, { useRef, useEffect, useCallback, useState } from 'react';
import jsQR from 'jsqr';
import Modal from './Modal';

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tick = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          onScan(code.data);
          onClose(); // Automatically close on successful scan
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tick);
  }, [onScan, onClose]);
  
  const stopScan = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startScan = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("La cámara no es compatible con este navegador. Intenta con Chrome o Firefox.");
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute("playsinline", "true"); // Required for iOS
        await videoRef.current.play();
        animationFrameId.current = requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.error("Failed to get media stream", err);
      let errorMessage = "No se pudo acceder a la cámara. Por favor, revisa los permisos en tu navegador.";
      if (err.name === 'NotAllowedError') {
        errorMessage = "Has denegado el acceso a la cámara. Por favor, habilita los permisos en la configuración de tu navegador.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No se encontró una cámara. Asegúrate de que tu dispositivo tenga una cámara y esté conectada.";
      } else if (err.name === 'NotReadableError') {
          errorMessage = "No se puede leer el video de la cámara. Puede que esté siendo utilizada por otra aplicación.";
      } else if (err.name === 'SecurityError' || err.name === 'TypeError') {
        errorMessage = "El acceso a la cámara está bloqueado. Esta función solo puede ser usada en una conexión segura (HTTPS).";
      }
      setError(errorMessage);
    }
  }, [tick]);

  useEffect(() => {
    if (isOpen) {
      startScan();
    } else {
      stopScan();
    }
    return () => {
      stopScan();
    };
  }, [isOpen, startScan, stopScan]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escanear Código QR">
      <div className="relative w-full aspect-square bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
        {error ? (
          <p className="text-center text-red-400 p-4">{error}</p>
        ) : (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-8 border-white/30 rounded-md pointer-events-none" />
            {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <p className="text-white">Iniciando cámara...</p>
                </div>
            )}
          </>
        )}
      </div>
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Apunta la cámara al código QR del carnet del estudiante.
      </p>
    </Modal>
  );
};

export default QRCodeScanner;
