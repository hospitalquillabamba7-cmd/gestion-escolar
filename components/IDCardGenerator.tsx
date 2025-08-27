import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import IDCard from './IDCard';
import Spinner from './Spinner';
import { CameraIcon, UploadIcon } from './icons';
import PhotoCaptureModal from './PhotoCaptureModal';

interface PersonData {
  id: string;
  name: string;
  detail: string;
  profilePictureUrl?: string | null;
}

interface IDCardGeneratorProps {
  personData: PersonData;
  role: 'Estudiante' | 'Docente';
  logoImageUrl: string | null;
  onUpdateProfilePicture: (url: string) => void;
}

const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({ personData, role, logoImageUrl, onUpdateProfilePicture }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({ id: personData.id, name: personData.name, role });
        const url = await QRCode.toDataURL(qrData, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 1,
          color: {
            dark: "#000000FF",
            light: "#FFFFFFFF"
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };
    if (personData.id) {
        generateQR();
    }
  }, [personData, role]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `carnet-${personData.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSavePhoto = (url: string) => {
    onUpdateProfilePicture(url);
    setIsPhotoModalOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateProfilePicture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <IDCard
          ref={cardRef}
          name={personData.name}
          id={personData.id}
          role={role}
          detail={personData.detail}
          logoImageUrl={logoImageUrl}
          qrCodeUrl={qrCodeUrl}
          profilePictureUrl={personData.profilePictureUrl}
        />
        <div className="mt-6 flex flex-wrap justify-center gap-3 w-full max-w-[320px]">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex items-center justify-center gap-2 flex-1 min-w-[130px] py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors"
          >
            <CameraIcon className="w-5 h-5" />
            Tomar Foto
          </button>
          <button
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 flex-1 min-w-[130px] py-2 px-4 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition-colors"
          >
            <UploadIcon className="w-5 h-5" />
            Subir Foto
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading || !qrCodeUrl}
            className="flex items-center justify-center gap-2 w-full mt-2 py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
          >
            {isDownloading ? <Spinner/> : 'Descargar Carnet'}
          </button>
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
        />
      </div>
      {isPhotoModalOpen && (
        <PhotoCaptureModal 
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSave={handleSavePhoto}
        />
      )}
    </>
  );
};

export default IDCardGenerator;