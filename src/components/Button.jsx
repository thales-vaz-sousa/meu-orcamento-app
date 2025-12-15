const Button = ({ children, className = '', ...props }) => {
  const baseClasses = 
    "px-4 py-2 font-semibold rounded-lg transition duration-150 ease-in-out shadow-md";
  
  // Classes padrão para o botão primário
  const defaultClasses = "bg-primary-blue text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-primary-blue/50";
  
  return (
    <button 
      className={`${baseClasses} ${defaultClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;