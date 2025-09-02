import React, { useState } from 'react';
import { Student, Course } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, AcademicCapIcon, ChevronDownIcon, IdCardIcon, SearchIcon, ExcelIcon } from './icons';
import IDCardGenerator from './IDCardGenerator';

interface StudentManagerProps {
  students: Student[];
  courses: Course[];
  addStudent: (student: Pick<Student, 'id' | 'name' | 'age' | 'grade'>) => void;
  deleteStudent: (studentId: string) => void;
  assignCoursesToStudent: (studentId: string, courseIds: string[]) => void;
  addCourseToStudentHistory: (studentId: string, courseId: string) => void;
  logoImageUrl: string | null;
  updateStudentProfilePicture: (studentId: string, url: string) => void;
  showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, courses, addStudent, deleteStudent, assignCoursesToStudent, addCourseToStudentHistory, logoImageUrl, updateStudentProfilePicture, showConfirmation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentIdForIdCard, setSelectedStudentIdForIdCard] = useState<string | null>(null);
  const [assignedCourseIds, setAssignedCourseIds] = useState<Set<string>>(new Set());
  const [newStudent, setNewStudent] = useState({ id: '', name: '', age: '', grade: '' });
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [courseToAdd, setCourseToAdd] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleHistory = (studentId: string) => {
    setExpandedStudentId(prevId => {
      const newId = prevId === studentId ? null : studentId;
      if (newId !== prevId) {
        setCourseToAdd('');
      }
      return newId;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.id && newStudent.name && newStudent.age && newStudent.grade) {
      addStudent({ id: newStudent.id, name: newStudent.name, age: Number(newStudent.age), grade: newStudent.grade });
      setNewStudent({ id: '', name: '', age: '', grade: '' });
      setIsModalOpen(false);
    }
  };

  const openAssignModal = (student: Student) => {
    setSelectedStudent(student);
    setAssignedCourseIds(new Set(student.courseIds || []));
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedStudent(null);
    setAssignedCourseIds(new Set());
  };

  const handleCourseSelectionChange = (courseId: string) => {
    setAssignedCourseIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent) {
      assignCoursesToStudent(selectedStudent.id, Array.from(assignedCourseIds));
      closeAssignModal();
    }
  };

  const handleAddCourseToHistory = (studentId: string) => {
    if (courseToAdd) {
      addCourseToStudentHistory(studentId, courseToAdd);
      setCourseToAdd('');
    }
  };
  
  const openIdCardModal = (student: Student) => {
    setSelectedStudentIdForIdCard(student.id);
    setIsIdCardModalOpen(true);
  };

  const closeIdCardModal = () => {
    setIsIdCardModalOpen(false);
    setSelectedStudentIdForIdCard(null);
  };

  const handleDelete = (student: Student) => {
    showConfirmation(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar a ${student.name}? Esta acción no se puede deshacer.`,
      () => deleteStudent(student.id)
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStudentForId = selectedStudentIdForIdCard ? students.find(s => s.id === selectedStudentIdForIdCard) : null;

  const handleExportToCSV = () => {
    const headers = [
      "DNI",
      "Nombre",
      "Edad",
      "Grado",
      "Cursos Inscritos",
      "Historial de Cursos Completados"
    ];

    const formatCsvCell = (value: any): string => {
      const stringValue = String(value ?? '');
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = filteredStudents.map(student => {
      const enrolledCourses = student.courseIds
        ?.map(id => courses.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join('; ') || 'Ninguno';

      const completedCourses = student.courseHistory
        ?.map(course => `${course.name} (${course.teacher})`)
        .join('; ') || 'Ninguno';
      
      return [
        student.id,
        student.name,
        student.age,
        student.grade,
        enrolledCourses,
        completedCourses
      ].map(formatCsvCell).join(',');
    });

    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lista_estudiantes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Gestión de Estudiantes</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportToCSV}
            className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
            aria-label="Exportar datos a Excel"
          >
            <ExcelIcon className="w-5 h-5" />
            Exportar a Excel
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            Añadir Estudiante
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o grado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            aria-label="Buscar estudiantes"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">DNI</th>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Edad</th>
                <th scope="col" className="px-6 py-3">Grado</th>
                <th scope="col" className="px-6 py-3">Cursos Inscritos</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <React.Fragment key={student.id}>
                  <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student.name}</td>
                    <td className="px-6 py-4">{student.age}</td>
                    <td className="px-6 py-4">{student.grade}</td>
                    <td className="px-6 py-4">
                      <span className="line-clamp-2">
                        {(student.courseIds && student.courseIds.length > 0)
                          ? student.courseIds.map(id => courses.find(c => c.id === id)?.name).filter(Boolean).join(', ')
                          : <span className="text-gray-400 italic">Ninguno</span>
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button
                          onClick={() => openIdCardModal(student)}
                          className="text-teal-600 hover:text-teal-800 dark:hover:text-teal-400 transition-colors p-1"
                          aria-label={`Generar carnet para ${student.name}`}
                          title="Generar Carnet"
                        >
                          <IdCardIcon className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => toggleHistory(student.id)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full transition-colors"
                          aria-label={`Ver historial de ${student.name}`}
                          title="Ver Historial"
                        >
                          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${expandedStudentId === student.id ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => openAssignModal(student)}
                          className="text-primary-600 hover:text-primary-800 dark:hover:text-primary-400 transition-colors p-1"
                          aria-label={`Asignar cursos a ${student.name}`}
                          title="Asignar Cursos"
                        >
                          <AcademicCapIcon className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1"
                          aria-label={`Eliminar a ${student.name}`}
                           title="Eliminar Estudiante"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedStudentId === student.id && (
                    <tr className="bg-gray-50 dark:bg-gray-900/50 transition-all duration-300">
                      <td colSpan={6} className="p-4 sm:p-6">
                        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 dark:border-gray-600">Historial de Cursos Completados</h4>
                          {(student.courseHistory && student.courseHistory.length > 0) ? (
                            <ul className="list-disc list-inside space-y-2 text-sm">
                              {student.courseHistory.map(course => (
                                <li key={course.id} className="text-gray-700 dark:text-gray-300">
                                  <span className="font-medium">{course.name}</span>
                                  <span className="text-gray-500 dark:text-gray-400 ml-2">({course.teacher})</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">No hay historial de cursos para este estudiante.</p>
                          )}

                          <div className="mt-4 pt-4 border-t dark:border-gray-600">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Añadir Curso al Historial</h5>
                            <div className="flex items-center gap-2">
                              <select
                                value={courseToAdd}
                                onChange={(e) => setCourseToAdd(e.target.value)}
                                className="flex-grow block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                aria-label="Seleccionar curso para añadir al historial"
                              >
                                <option value="">Selecciona un curso...</option>
                                {courses
                                  .filter(c => !(student.courseHistory || []).some(hc => hc.id === c.id))
                                  .map(course => (
                                    <option key={course.id} value={course.id}>
                                      {course.name}
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => handleAddCourseToHistory(student.id)}
                                disabled={!courseToAdd}
                                className="bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-primary-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                Añadir
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Nuevo Estudiante">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
             <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">DNI</label>
              <input type="text" name="id" id="id" value={newStudent.id} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required pattern="\d{8}" title="El DNI debe contener 8 dígitos." />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input type="text" name="name" id="name" value={newStudent.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edad</label>
              <input type="number" name="age" id="age" value={newStudent.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grado</label>
              <input type="text" name="grade" id="grade" value={newStudent.grade} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">Guardar</button>
          </div>
        </form>
      </Modal>
      
      {selectedStudent && (
        <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} title={`Asignar Cursos a ${selectedStudent.name}`}>
          <form onSubmit={handleAssignSubmit}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Selecciona los cursos en los que se inscribirá al estudiante.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-b py-4 dark:border-gray-700">
              {courses.length > 0 ? courses.map(course => (
                <label key={course.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 bg-gray-100 dark:bg-gray-900"
                    checked={assignedCourseIds.has(course.id)}
                    onChange={() => handleCourseSelectionChange(course.id)}
                    aria-labelledby={`course-name-${course.id}`}
                  />
                  <span id={`course-name-${course.id}`} className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">{course.name} <span className="text-gray-500 text-xs">({course.teacher})</span></span>
                </label>
              )) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay cursos disponibles para asignar.</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeAssignModal} className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors">Cancelar</button>
              <button type="submit" className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors">Guardar Cambios</button>
            </div>
          </form>
        </Modal>
      )}

      {selectedStudentForId && (
        <Modal isOpen={isIdCardModalOpen} onClose={closeIdCardModal} title={`Carnet de Identificación`}>
          <IDCardGenerator
            personData={{
              id: selectedStudentForId.id,
              name: selectedStudentForId.name,
              detail: selectedStudentForId.grade,
              profilePictureUrl: selectedStudentForId.profilePictureUrl
            }}
            role="Estudiante"
            logoImageUrl={logoImageUrl}
            onUpdateProfilePicture={(url) => updateStudentProfilePicture(selectedStudentForId.id, url)}
          />
        </Modal>
      )}
    </div>
  );
};

export default StudentManager;
