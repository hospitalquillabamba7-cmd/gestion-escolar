import React, { forwardRef } from 'react';
import { AcademicCapIcon, TeachersIcon } from './icons';

interface IDCardProps {
  name: string;
  id: string;
  role: 'Estudiante' | 'Docente';
  detail: string;
  logoImageUrl: string | null;
  qrCodeUrl: string;
  profilePictureUrl?: string | null;
}

const IDCard = forwardRef<HTMLDivElement, IDCardProps>(({ name, id, role, detail, logoImageUrl, qrCodeUrl, profilePictureUrl }, ref) => {

  const RoleIcon = role === 'Estudiante'
    ? <AcademicCapIcon className="w-5 h-5 text-gray-500" />
    : <TeachersIcon className="w-5 h-5 text-gray-500" />;

  const detailLabel = role === 'Estudiante' ? 'Grado' : 'Materia';

  return (
    <div ref={ref} className="w-[320px] h-[500px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col font-sans relative overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between pb-4 border-b-2 border-primary-500">
        <h1 className="text-xl font-bold text-gray-800">Identificación</h1>
        {logoImageUrl ? (
          <img src={logoImageUrl} alt="Logo Escolar" className="h-12 w-12 object-contain" />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
            <AcademicCapIcon className="w-6 h-6 text-gray-400"/>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 my-6 self-center">
         {profilePictureUrl ? (
          <img 
            src={profilePictureUrl} 
            alt="Foto de perfil" 
            className="w-36 h-36 object-cover bg-gray-300 rounded-full border-4 border-white shadow-md" 
          />
        ) : (
          <div className="w-36 h-36 bg-gray-300 rounded-full border-4 border-white shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 truncate" title={name}>{name}</h2>
        <p className="text-sm font-medium text-primary-600">{`ID: ${id}`}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
        <div className="flex items-center">
          {RoleIcon}
          <span className="ml-3 text-gray-700">Rol: <span className="font-semibold">{role}</span></span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="ml-3 text-gray-700">{detailLabel}: <span className="font-semibold">{detail}</span></span>
        </div>
      </div>
      
      <div className="mt-auto flex justify-center items-center">
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
        ) : (
          <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-md"></div>
        )}
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full -z-1"></div>
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-primary-500/10 rounded-full -z-1"></div>
    </div>
  );
});

export default IDCard;