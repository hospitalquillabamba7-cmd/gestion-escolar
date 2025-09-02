import React, { useState, useCallback } from 'react';
import { Student, Course, View, Teacher, Notification, AttendanceRecord } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import CourseManager from './components/CourseManager';
import AIAssistant from './components/AIAssistant';
import TeacherManager from './components/TeacherManager';
import AttendanceManager from './components/AttendanceManager';
import Modal from './components/Modal';

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([
    { id: '78945612', name: 'Ana García', age: 15, grade: '10º', courseIds: ['C01'], courseHistory: [
        { id: 'CH01', name: 'Introducción a la Programación', teacher: 'Sr. Salas' },
        { id: 'CH02', name: 'Química General', teacher: 'Sra. Rios' },
    ], profilePictureUrl: null},
    { id: '78123456', name: 'Luis Fernández', age: 16, grade: '11º', courseIds: ['C01', 'C03'], courseHistory: [
        { id: 'CH03', name: 'Literatura Española', teacher: 'Sra. Vega' }
    ], profilePictureUrl: null},
    { id: '78789012', name: 'Elena Rodríguez', age: 14, grade: '9º', courseIds: ['C02'], profilePictureUrl: null },
  ]);
  const [courses, setCourses] = useState<Course[]>([
    { id: 'C01', name: 'Matemáticas Avanzadas', teacher: 'Ricardo Pérez' },
    { id: 'C02', name: 'Historia Mundial', teacher: 'Laura Gómez' },
    { id: 'C03', name: 'Física I', teacher: 'Carlos Morales' },
  ]);
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 'T01', name: 'Ricardo Pérez', subject: 'Matemáticas', profilePictureUrl: null },
    { id: 'T02', name: 'Laura Gómez', subject: 'Historia', profilePictureUrl: null },
    { id: 'T03', name: 'Carlos Morales', subject: 'Física', profilePictureUrl: null },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      title: 'Entrega de Proyecto de Ciencias',
      message: 'El proyecto de la feria de ciencias debe entregarse el viernes.',
      date: '2024-08-15',
      read: false,
    },
    {
      id: 'N002',
      title: 'Reunión de Padres y Profesores',
      message: 'La reunión trimestral será el próximo lunes a las 6 PM.',
      date: '2024-08-19',
      read: false,
    },
    {
      id: 'N003',
      title: 'Día de Fotografía Escolar',
      message: 'Recuerda sonreír para las fotos escolares mañana en el gimnasio.',
      date: '2024-08-12',
      read: true,
    },
  ]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmation({ isOpen: true, title, message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmation && confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    setConfirmation(null);
  };
  
  const handleCancel = () => {
    setConfirmation(null);
  };

  const addStudent = useCallback((student: Pick<Student, 'id' | 'name' | 'age' | 'grade'>) => {
    setStudents(prev => [...prev, { ...student, courseIds: [], profilePictureUrl: null }]);
  }, []);

  const deleteStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  const updateStudentProfilePicture = useCallback((studentId: string, url: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, profilePictureUrl: url } : s));
  }, []);

  const assignCoursesToStudent = useCallback((studentId: string, courseIds: string[]) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, courseIds } : student
      )
    );
  }, []);

  const addCourseToStudentHistory = useCallback((studentId: string, courseId: string) => {
    const courseToAdd = courses.find(c => c.id === courseId);
    if (!courseToAdd) return;

    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const history = student.courseHistory || [];
          if (history.some(c => c.id === courseId)) {
            return student;
          }
          return {
            ...student,
            courseHistory: [...history, courseToAdd],
          };
        }
        return student;
      })
    );
  }, [courses]);

  const addCourse = useCallback((course: Omit<Course, 'id'>) => {
    setCourses(prev => [...prev, { ...course, id: `C${Date.now()}` }]);
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setStudents(prevStudents =>
      prevStudents.map(student => ({
        ...student,
        courseIds: student.courseIds?.filter(id => id !== courseId),
      }))
    );
  }, []);

  const addTeacher = useCallback((teacher: Omit<Teacher, 'id' | 'profilePictureUrl'>) => {
    setTeachers(prev => [...prev, { ...teacher, id: `T${Date.now()}`, profilePictureUrl: null }]);
  }, []);

  const deleteTeacher = useCallback((teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  }, []);

  const updateTeacher = useCallback((teacherId: string, updatedData: Omit<Teacher, 'id' | 'profilePictureUrl'>) => {
    setTeachers(prev =>
      prev.map(t =>
        t.id === teacherId
          ? { ...t, name: updatedData.name, subject: updatedData.subject }
          : t
      )
    );
  }, []);

  const updateTeacherProfilePicture = useCallback((teacherId: string, url: string) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, profilePictureUrl: url } : t));
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const handleCheckIn = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const today = new Date().toISOString().split('T')[0];
    const hasActiveCheckIn = attendanceRecords.some(
      r => r.studentId === studentId && r.checkInTime.startsWith(today) && r.status === 'Checked In'
    );

    if (hasActiveCheckIn) {
      console.warn("Student already checked in today.");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `ATT${Date.now()}`,
      studentId,
      studentName: student.name,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      status: 'Checked In',
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
  }, [students, attendanceRecords]);

  const handleCheckOut = useCallback((studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setAttendanceRecords(prev =>
      prev.map(r => {
        if (r.studentId === studentId && r.checkInTime.startsWith(today) && r.status === 'Checked In') {
          return { ...r, checkOutTime: new Date().toISOString(), status: 'Checked Out' };
        }
        return r;
      })
    );
  }, []);


  const renderContent = () => {
    switch (currentView) {
      case View.STUDENTS:
        return <StudentManager
          students={students}
          addStudent={addStudent}
          deleteStudent={deleteStudent}
          courses={courses}
          assignCoursesToStudent={assignCoursesToStudent}
          addCourseToStudentHistory={addCourseToStudentHistory}
          logoImageUrl={logoImageUrl}
          updateStudentProfilePicture={updateStudentProfilePicture}
          showConfirmation={showConfirmation}
        />;
      case View.TEACHERS:
        return <TeacherManager
          teachers={teachers}
          addTeacher={addTeacher}
          deleteTeacher={deleteTeacher}
          logoImageUrl={logoImageUrl}
          updateTeacherProfilePicture={updateTeacherProfilePicture}
          updateTeacher={updateTeacher}
          showConfirmation={showConfirmation}
        />;
      case View.COURSES:
        return <CourseManager 
          courses={courses} 
          addCourse={addCourse} 
          deleteCourse={deleteCourse} 
          showConfirmation={showConfirmation}
        />;
      case View.ATTENDANCE:
        return <AttendanceManager
          students={students}
          attendanceRecords={attendanceRecords}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
        />;
      case View.AI_ASSISTANT:
        return <AIAssistant />;
      case View.DASHBOARD:
      default:
        return <Dashboard 
          students={students} 
          courses={courses}
          teachers={teachers}
          logoImageUrl={logoImageUrl}
          setCurrentView={setCurrentView} 
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
      />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      {confirmation?.isOpen && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default App;
