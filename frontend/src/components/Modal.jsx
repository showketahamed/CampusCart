export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose}>X</button>
        </div>
        {children}
      </div>
    </div>
  );
}
