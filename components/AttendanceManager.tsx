import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord } from '../types';
import { QrCodeIcon, SearchIcon } from './icons';
import QRCodeScanner from './QRCodeScanner';
import Spinner from './Spinner';

interface AttendanceManagerProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  handleCheckIn: (studentId: string) => void;
  handleCheckOut: (studentId: string) => void;
}

const AttendanceManager: React.FC<AttendanceManagerProps> = ({ students, attendanceRecords, handleCheckIn, handleCheckOut }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lastAttendanceRecord = useMemo(() => {
    if (!foundStudent) return null;
    const today = new Date().toISOString().split('T')[0];
    const studentRecordsToday = attendanceRecords.filter(
        r => r.studentId === foundStudent.id && r.checkInTime.startsWith(today)
    );
    // Sort by check-in time descending to get the latest record
    return studentRecordsToday.sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())[0] || null;
  }, [foundStudent, attendanceRecords]);

  const studentAttendanceStatus = useMemo(() => {
    if (!foundStudent) return null;
    // 'Checked Out' is the default status if no record is found
    return lastAttendanceRecord?.status || 'Checked Out';
  }, [foundStudent, lastAttendanceRecord]);


  const dailyLog = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords
      .filter(r => r.checkInTime.startsWith(today))
      .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
  }, [attendanceRecords]);
  
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const findStudent = (id: string) => {
    setIsLoading(true);
    const student = students.find(s => s.id === id);
    setTimeout(() => { // Simulate a quick search
      if (student) {
        setFoundStudent(student);
        setSearchId('');
      } else {
        setFoundStudent(null);
        showFeedback('error', 'Estudiante no encontrado con ese DNI.');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      findStudent(searchId.trim());
    }
  };

  const onScanSuccess = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.id) {
        findStudent(parsed.id);
      } else {
        showFeedback('error', 'Código QR inválido.');
      }
    } catch (e) {
      // If it's not JSON, maybe it's just the DNI string
      if (/^\d+$/.test(data)) { // Check for a numeric string
        findStudent(data);
      } else {
        showFeedback('error', 'Formato de código QR no reconocido.');
      }
    }
    setIsScannerOpen(false);
  };
  
  const handleAction = (action: 'check-in' | 'check-out') => {
    if (!foundStudent) return;

    if (action === 'check-in') {
      handleCheckIn(foundStudent.id);
      showFeedback('success', `${foundStudent.name} ha registrado su entrada.`);
    } else {
      handleCheckOut(foundStudent.id);
      showFeedback('success', `${foundStudent.name} ha registrado su salida.`);
    }
    // The status will update via props, triggering a re-render
  };
  
  return (
    <>
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Control de Asistencia</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4">Registrar Asistencia</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    placeholder="Ingresar DNI del alumno"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Buscar</button>
              </form>
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">O</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors"
              >
                <QrCodeIcon className="w-6 h-6" />
                Escanear Código QR
              </button>
            </div>
            
            {isLoading && <div className="flex justify-center p-4"><Spinner/></div>}

            {feedback && (
              <div className={`p-4 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                {feedback.message}
              </div>
            )}

            {foundStudent && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
                <div className="text-center">
                  <img
                    src={foundStudent.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundStudent.name)}&background=random`}
                    alt={foundStudent.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                  <h4 className="font-bold text-xl">{foundStudent.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{foundStudent.grade}</p>
                  <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${studentAttendanceStatus === 'Checked In' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                    {studentAttendanceStatus === 'Checked In' ? 'Presente' : 'Ausente'}
                  </span>
                   <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-4 dark:border-gray-700">
                    {studentAttendanceStatus === 'Checked In' && lastAttendanceRecord ? (
                      <p>Última entrada: <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(lastAttendanceRecord.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></p>
                    ) : (
                      <p>El estudiante necesita registrar su entrada.</p>
                    )}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAction('check-in')}
                    disabled={studentAttendanceStatus === 'Checked In'}
                    className="py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Registrar Entrada
                  </button>
                  <button
                    onClick={() => handleAction('check-out')}
                    disabled={studentAttendanceStatus !== 'Checked In'}
                    className="py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Registrar Salida
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Daily Log */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-4">Registro de Hoy ({new Date().toLocaleDateString()})</h3>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Estudiante</th>
                    <th className="px-4 py-3">Entrada</th>
                    <th className="px-4 py-3">Salida</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {dailyLog.length > 0 ? dailyLog.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{record.studentName}</td>
                      <td className="px-4 py-3">{new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-4 py-3">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.status === 'Checked In' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
                          {record.status === 'Checked In' ? 'Presente' : 'Registró Salida'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">No hay registros de asistencia hoy.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <QRCodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={onScanSuccess}
      />
    </>
  );
};

export default AttendanceManager;