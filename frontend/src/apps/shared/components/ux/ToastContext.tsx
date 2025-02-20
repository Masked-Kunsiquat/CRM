
import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

type ToastType = "success" | "error" | "warning";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} className="w-80">
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.type === "success" ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" :
                toast.type === "error" ? "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" :
                "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
              }`}
            >
              {toast.type === "success" && <HiCheck className="h-5 w-5" />}
              {toast.type === "error" && <HiX className="h-5 w-5" />}
              {toast.type === "warning" && <HiExclamation className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
            <Toast.Toggle />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
