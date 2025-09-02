import React, { forwardRef } from 'react';
import { AcademicCapIcon } from './icons';

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

  const isStudent = role === 'Estudiante';

  const getNivel = (grade: string): string => {
    // A simple parser for grade level
    const gradeNumber = parseInt(grade.replace(/[^0-9]/g, ''));
    if (isNaN(gradeNumber)) return 'Secundaria'; // Default if parsing fails
    if (gradeNumber <= 6) return 'Primaria';
    return 'Secundaria';
  };

  const nameLabel = isStudent ? "Nombre completo del alumno:" : "Nombre completo del docente:";
  const idFormatted = id.replace(/\D/g, ''); // Remove non-digit characters from ID

  return (
    // Outer div for the plastic holder effect
    <div className="bg-gray-200/50 p-1.5 rounded-3xl font-sans">
      {/* Slot punches simulation */}
      <div className="h-6 flex justify-center items-center gap-4 my-1">
        <div className="w-12 h-4 bg-white rounded-full shadow-inner"></div>
        <div className="w-4 h-4 bg-white rounded-full shadow-inner"></div>
      </div>

      {/* The card itself, with the ref for html2canvas */}
      <div ref={ref} className="w-[320px] h-[500px] bg-white rounded-2xl shadow-lg flex flex-col relative overflow-hidden p-4">
        
        {/* Header Section */}
        <div className="flex items-center justify-start gap-4">
          {logoImageUrl ? (
            <img src={logoImageUrl} alt="Logo de la Escuela" className="h-14 w-14 object-contain" />
          ) : (
            <div className="h-14 w-14 bg-gray-200 rounded-md flex items-center justify-center">
              <AcademicCapIcon className="w-8 h-8 text-gray-400"/>
            </div>
          )}
          <div className="text-left">
            <p className="font-extrabold text-rose-700 text-xl tracking-tighter">COLEGIOS MONSERRAT</p>
            <p className="text-xs text-gray-500 tracking-wider font-medium">INICIAL, PRIMARIA, SECUNDARIA</p>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="relative flex justify-center z-10 my-3">
          {/* Negative margin pulls the content below it up */}
          <div className="w-32 h-32 rounded-lg bg-gray-200 border-4 border-white shadow-xl flex items-center justify-center -mb-[72px]">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Foto de perfil" className="w-full h-full object-cover rounded-md" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Main Content Body */}
        <div className="bg-white pt-20 px-2 pb-2 flex-grow flex flex-col justify-between rounded-b-xl">
          <div>
            {/* Banner */}
            <div className="bg-rose-600 text-white text-center font-bold py-1.5 rounded-md text-sm tracking-wider shadow-inner">
              TARJETA DE IDENTIFICACIÓN
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center space-y-2 text-center text-xs px-2 pt-2">
              <div>
                <p className="text-rose-700 font-semibold">{nameLabel}</p>
                <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                  <p className="font-bold text-base text-gray-800 uppercase tracking-wide truncate px-2">{name}</p>
                </div>
              </div>
              
              {isStudent ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-rose-700 font-semibold">DNI:</p>
                      <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                        <p className="font-bold text-gray-800">{idFormatted}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-rose-700 font-semibold">Nivel:</p>
                      <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                        <p className="font-bold text-gray-800">{getNivel(detail)}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-rose-700 font-semibold">Aula o Grado y Sección:</p>
                    <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                      <p className="font-bold text-gray-800">{detail}</p>
                    </div>
                  </div>
                </>
              ) : ( // Teacher Layout
                <div className="grid grid-cols-2 gap-2">
                  <div>
                      <p className="text-rose-700 font-semibold">ID Docente:</p>
                      <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                        <p className="font-bold text-gray-800">{idFormatted}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-rose-700 font-semibold">Materia:</p>
                      <div className="border border-rose-300 rounded-md py-1.5 mt-0.5 bg-rose-50/30">
                        <p className="font-bold text-gray-800 truncate px-1">{detail}</p>
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
          
           {/* QR Code Section */}
          <div className="flex flex-col justify-center items-center mt-2">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Código QR de Asistencia" className="w-20 h-20" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                Generando QR...
              </div>
            )}
            <p className="text-[8px] text-gray-500 mt-1">ESCANEAR PARA ASISTENCIA</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default IDCard;