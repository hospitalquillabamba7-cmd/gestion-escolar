import React, { useState, useRef, useEffect } from 'react';
import { View, Notification } from '../types';
import { DashboardIcon, StudentsIcon, CoursesIcon, AIIcon, TeachersIcon, BellIcon, ClockIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, notifications, markNotificationAsRead, markAllNotificationsAsRead }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { view: View.DASHBOARD, label: 'Panel', icon: <DashboardIcon className="w-5 h-5" /> },
    { view: View.STUDENTS, label: 'Estudiantes', icon: <StudentsIcon className="w-5 h-5" /> },
    { view: View.TEACHERS, label: 'Profesores', icon: <TeachersIcon className="w-5 h-5" /> },
    { view: View.COURSES, label: 'Cursos', icon: <CoursesIcon className="w-5 h-5" /> },
    { view: View.ATTENDANCE, label: 'Asistencia', icon: <ClockIcon className="w-5 h-5" /> },
    { view: View.AI_ASSISTANT, label: 'Asistente IA', icon: <AIIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253a4.125 4.125 0 110-8.25 4.125 4.125 0 010 8.25zm0 11.494a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25z"></path></svg>
            </div>
            <h1 className="text-xl font-bold ml-3 text-gray-900 dark:text-white">Gestión Escolar</h1>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      currentView === item.view
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="relative ml-4" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-label="Ver notificaciones"
              >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <div className="py-1">
                    <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Notificaciones</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                            className={`flex items-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${!notification.read ? 'cursor-pointer' : ''}`}
                          >
                            {!notification.read && (
                              <div className="flex-shrink-0 mt-1.5 mr-3">
                                <span className="block h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                              </div>
                            )}
                            <div className={`w-0 flex-1 ${notification.read ? 'opacity-60' : ''}`}>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No tienes notificaciones.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;