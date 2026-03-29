import { useCallback, useEffect, useState } from "react";
import ToastNotification from "./ToastNotification";
import { registerToastContainer } from "./toastManager";

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const [exitingToasts, setExitingToasts] = useState(new Set());

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    setToasts((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type, duration },
    ]);
  }, []);

  const removeToast = useCallback((id) => {
    setExitingToasts((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      setExitingToasts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  useEffect(() => {
    registerToastContainer({ addToast, removeToast });
  }, [addToast, removeToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastNotification
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isExiting={exitingToasts.has(toast.id)}
            onRemove={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
