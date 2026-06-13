export default function Button({ children, type = 'button', variant = 'primary', onClick, ...props }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} w-100`} // w-100 faz o botão ocupar toda a largura
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}