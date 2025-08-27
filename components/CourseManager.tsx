import React, { useState } from 'react';
import { Course } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, SearchIcon } from './icons';

interface CourseManagerProps {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (courseId: string) => void;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

const CourseManager: React.FC<CourseManagerProps> = ({ courses, addCourse, deleteCourse, showConfirmation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', teacher: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.name && newCourse.teacher) {
      addCourse(newCourse);
      setNewCourse({ name: '', teacher: '' });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (course: Course) => {
    showConfirmation(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar el curso "${course.name}"? Esta acción no se puede deshacer.`,
      () => deleteCourse(course.id)
    );
  };
  
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestión de Cursos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
        >
          <PlusIcon className="w-5 h-5" />
          Añadir Curso
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o profesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            aria-label="Buscar cursos"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nombre del Curso</th>
                <th scope="col" className="px-6 py-3">Profesor</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{course.name}</td>
                    <td className="px-6 py-4">{course.teacher}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(course)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        aria-label={`Eliminar curso ${course.name}`}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                    No hay cursos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Curso">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Curso</label>
              <input type="text" name="name" id="name" value={newCourse.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profesor</label>
              <input type="text" name="teacher" id="teacher" value={newCourse.teacher} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManager;