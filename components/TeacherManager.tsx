import React, { useState } from 'react';
import { Teacher } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, IdCardIcon, PencilIcon, SearchIcon } from './icons';
import IDCardGenerator from './IDCardGenerator';

interface TeacherManagerProps {
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'profilePictureUrl'>) => void;
  deleteTeacher: (teacherId: string) => void;
  logoImageUrl: string | null;
  updateTeacherProfilePicture: (teacherId: string, url: string) => void;
  updateTeacher: (teacherId: string, updatedData: Omit<Teacher, 'id' | 'profilePictureUrl'>) => void;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

const TeacherManager: React.FC<TeacherManagerProps> = ({ teachers, addTeacher, deleteTeacher, logoImageUrl, updateTeacherProfilePicture, updateTeacher, showConfirmation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [selectedTeacherIdForIdCard, setSelectedTeacherIdForIdCard] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacher.name && newTeacher.subject) {
      addTeacher(newTeacher);
      setNewTeacher({ name: '', subject: '' });
      setIsModalOpen(false);
    }
  };

  const openIdCardModal = (teacher: Teacher) => {
    setSelectedTeacherIdForIdCard(teacher.id);
    setIsIdCardModalOpen(true);
  };

  const closeIdCardModal = () => {
    setIsIdCardModalOpen(false);
    setSelectedTeacherIdForIdCard(null);
  };

  const selectedTeacherForId = selectedTeacherIdForIdCard ? teachers.find(t => t.id === selectedTeacherIdForIdCard) : null;

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingTeacher(null);
    setIsEditModalOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTeacher) return;
    const { name, value } = e.target;
    setEditingTeacher({ ...editingTeacher, [name]: value });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher && editingTeacher.name && editingTeacher.subject) {
      updateTeacher(editingTeacher.id, { name: editingTeacher.name, subject: editingTeacher.subject });
      closeEditModal();
    }
  };

  const handleDelete = (teacher: Teacher) => {
    showConfirmation(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar a ${teacher.name}? Esta acción no se puede deshacer.`,
      () => deleteTeacher(teacher.id)
    );
  };
  
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestión de Profesores</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
        >
          <PlusIcon className="w-5 h-5" />
          Añadir Profesor
        </button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            aria-label="Buscar profesores"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Materia</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{teacher.name}</td>
                  <td className="px-6 py-4">{teacher.subject}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openIdCardModal(teacher)}
                        className="text-teal-600 hover:text-teal-800 dark:hover:text-teal-400 transition-colors p-1"
                        aria-label={`Generar carnet para ${teacher.name}`}
                        title="Generar Carnet"
                      >
                        <IdCardIcon className="w-6 h-6" />
                      </button>
                       <button
                        onClick={() => openEditModal(teacher)}
                        className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 transition-colors p-1"
                        aria-label={`Editar a ${teacher.name}`}
                        title="Editar Profesor"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(teacher)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                        aria-label={`Eliminar a ${teacher.name}`}
                        title="Eliminar Profesor"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Profesor">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input type="text" name="name" id="name" value={newTeacher.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia</label>
              <input type="text" name="subject" id="subject" value={newTeacher.subject} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">Guardar</button>
          </div>
        </form>
      </Modal>

      {editingTeacher && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Profesor">
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="edit-name"
                  value={editingTeacher.name}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required
                />
              </div>
              <div>
                <label htmlFor="edit-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia</label>
                <input
                  type="text"
                  name="subject"
                  id="edit-subject"
                  value={editingTeacher.subject}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeEditModal} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">Cancelar</button>
              <button type="submit" className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">Guardar Cambios</button>
            </div>
          </form>
        </Modal>
      )}

      {selectedTeacherForId && (
        <Modal isOpen={isIdCardModalOpen} onClose={closeIdCardModal} title="Carnet de Identificación">
          <IDCardGenerator
            personData={{
              id: selectedTeacherForId.id,
              name: selectedTeacherForId.name,
              detail: selectedTeacherForId.subject,
              profilePictureUrl: selectedTeacherForId.profilePictureUrl
            }}
            role="Docente"
            logoImageUrl={logoImageUrl}
            onUpdateProfilePicture={(url) => updateTeacherProfilePicture(selectedTeacherForId.id, url)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TeacherManager;