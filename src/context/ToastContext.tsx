import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex justify-between items-start gap-4 shadow-lg rounded-lg p-4 min-w-[280px] border-l-4
              ${toast.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' : ''}
              ${toast.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' : ''}
              ${toast.type === 'info' ? 'bg-blue-100 border-blue-500 text-blue-800' : ''}`}
          >
            <div className="flex-1">
              <div className="font-medium mb-2">{toast.message}</div>
              <button
                className="mt-1 text-sm px-3 py-1 bg-white rounded border hover:bg-opacity-90"
                onClick={() => removeToast(toast.id)}
              >
                OK
              </button>
            </div>
            <button
              className="text-xl leading-none text-gray-500 hover:text-black"
              onClick={() => removeToast(toast.id)}
              aria-label="Close toast"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
