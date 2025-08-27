
import React, { useState, useRef, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { Message } from '../types';
import Spinner from './Spinner';
import Modal from './Modal';
import { ClipboardListIcon } from './icons';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: 'Hola. Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy con tus tareas escolares?',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New state for task generation modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTopic, setTaskTopic] = useState('');
  const [taskResult, setTaskResult] = useState('');
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateText(input);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // New handler for generating tasks
  const handleGenerateTasks = async () => {
    if (taskTopic.trim() === '' || isGeneratingTask) return;
    setIsGeneratingTask(true);
    setTaskResult('');

    try {
        const prompt = `Por favor, genera una lista de 5 ejercicios o tareas para estudiantes sobre el tema: "${taskTopic}". Las tareas deben ser apropiadas para un nivel de secundaria, creativas y fomentar el pensamiento crítico. Formatea la respuesta con títulos claros y numeración.`;
        const result = await generateText(prompt);
        setTaskResult(result);
    } catch (error) {
        console.error("Error generating tasks:", error);
        setTaskResult('Hubo un error al generar las tareas. Por favor, inténtalo de nuevo.');
    } finally {
        setIsGeneratingTask(false);
    }
  };

  const handleOpenTaskModal = () => {
    setTaskTopic('');
    setTaskResult('');
    setIsTaskModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Asistente de IA</h2>
           <button
              onClick={handleOpenTaskModal}
              className="flex items-center gap-2 bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300"
              aria-label="Generar tareas o ejercicios"
            >
              <ClipboardListIcon className="w-5 h-5" />
              <span>Generar Tareas</span>
            </button>
        </div>
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none flex items-center">
                  <Spinner />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Generador de Tareas">
        <div className="space-y-4">
            <div>
                <label htmlFor="task-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tema o Materia
                </label>
                <input
                    type="text"
                    id="task-topic"
                    value={taskTopic}
                    onChange={(e) => setTaskTopic(e.target.value)}
                    placeholder="Ej: La fotosíntesis, Ecuaciones de primer grado..."
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    aria-label="Tema para generar tareas"
                />
            </div>
            <button
                onClick={handleGenerateTasks}
                disabled={isGeneratingTask || !taskTopic.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
                {isGeneratingTask ? <Spinner /> : 'Generar Tareas'}
            </button>
            {(isGeneratingTask || taskResult) && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg max-h-64 overflow-y-auto border dark:border-gray-700">
                    {isGeneratingTask ? (
                        <div className="flex justify-center items-center h-32">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                           {taskResult}
                        </div>
                    )}
                </div>
            )}
        </div>
      </Modal>
    </>
  );
};

export default AIAssistant;
