import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from './Modal';
import { CameraIcon, RefreshIcon } from './icons';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({ isOpen, onClose, onSave }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError("No se pudo acceder a la cámara. Por favor, revisa los permisos en tu navegador.");
        }
      };
      startCamera();
    } else {
      cleanupCamera();
      setCapturedImage(null);
      setError(null);
    }

    return () => {
      cleanupCamera();
    };
  }, [isOpen, cleanupCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        cleanupCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
    if (isOpen) {
        // We know useEffect will restart the camera
    }
  };

  const handleSave = () => {
    if (capturedImage) {
      onSave(capturedImage);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Capturar Foto de Perfil">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm h-64 bg-gray-900 rounded-lg overflow-hidden relative flex items-center justify-center">
          {error ? (
            <p className="text-center text-red-400 p-4">{error}</p>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captura" className="object-contain h-full w-full" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
          {!stream && !capturedImage && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <p className="text-white">Iniciando cámara...</p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-6 w-full flex justify-center gap-4">
          {capturedImage ? (
            <>
              <button onClick={handleRetake} className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">
                <RefreshIcon className="w-5 h-5"/>
                Volver a Tomar
              </button>
              <button onClick={handleSave} className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">
                Guardar Foto
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              disabled={!stream || !!error}
              className="flex items-center gap-2 py-2 px-6 bg-primary-600 text-white font-semibold rounded-full shadow-md hover:bg-primary-700 transition-colors disabled:bg-gray-400"
            >
              <CameraIcon className="w-6 h-6" />
              Capturar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PhotoCaptureModal;