// Exemplo: src/components/Input.jsx
const Input = ({ label, type = 'text', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-text-dark mb-1">
      {label}
    </label>
    <input
      type={type}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue transition duration-150 ease-in-out shadow-custom"
      {...props}
    />
  </div>
);
export default Input;