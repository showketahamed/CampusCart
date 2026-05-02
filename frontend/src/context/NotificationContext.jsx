import { createContext, useCallback, useMemo, useState } from "react";

export const NotificationContext = createContext(null);

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((message, type = "success", timeout = 3000) => {
    const id = uid();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), timeout);
  }, [remove]);

  const value = useMemo(() => ({
    notifySuccess: (message, timeout) => notify(message, "success", timeout),
    notifyError: (message, timeout) => notify(message, "error", timeout),
    remove
  }), [notify, remove]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {items.map((item) => (
          <div key={item.id} className={`toast ${item.type === "error" ? "toast-error" : "toast-success"}`}>
            {item.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
