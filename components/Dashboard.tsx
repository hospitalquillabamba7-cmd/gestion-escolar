import React from 'react';
import { Student, Course, Teacher, View } from '../types';
import { StudentsIcon, CoursesIcon, ExportIcon, QuestionMarkCircleIcon, TeachersIcon } from './icons';

interface DashboardProps {
  students: Student[];
  courses: Course[];
  teachers: Teacher[];
  logoImageUrl: string | null;
  setCurrentView: (view: View) => void;
}

const InfoCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-6 transform hover:scale-105 transition-transform duration-300">
      <div className="bg-primary-100 dark:bg-primary-900/50 p-4 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ students, courses, teachers, logoImageUrl, setCurrentView }) => {

  const handleExportData = () => {
    const dataToExport = {
      students,
      courses,
      teachers,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'datos_escolares.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="animate-fade-in">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Panel Principal</h2>
          <div className="flex flex-wrap gap-3">
             <button
              onClick={() => setCurrentView(View.AI_ASSISTANT)}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
              aria-label="Abrir el Asistente de IA"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span>Asistente IA</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
              aria-label="Exportar datos de estudiantes y cursos a un archivo JSON"
            >
              <ExportIcon className="w-5 h-5" />
              Exportar Datos
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard 
                title="Total de Estudiantes" 
                value={students.length} 
                icon={<StudentsIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />} 
            />
             <InfoCard 
                title="Total de Profesores" 
                value={teachers.length} 
                icon={<TeachersIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />} 
            />
            <InfoCard 
                title="Total de Cursos" 
                value={courses.length} 
                icon={<CoursesIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />} 
            />
        </div>

        {logoImageUrl ? (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Logo de la Escuela</h3>
            <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700/50 p-6 rounded-lg">
              <img 
                src={logoImageUrl} 
                alt="Logo de la escuela" 
                className="w-48 h-48 object-contain rounded-full shadow-md bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">¡Bienvenido!</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Este es tu centro de control para la gestión escolar. Desde aquí puedes supervisar las estadísticas clave, gestionar estudiantes y cursos, y utilizar el asistente de IA para agilizar tus tareas.
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Selecciona una opción del menú de navegación para comenzar.
              </p>
          </div>
        )}
    </div>
  );
};

export default Dashboard;