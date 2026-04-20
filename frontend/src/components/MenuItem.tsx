import { Link } from "react-router-dom";

export default function MenuItem({ rota, label, onClick }: any) {
  // Codifica o título para a URL (ex: "Dados Gerais" vira "Dados%20Gerais")
  const tituloUrl = encodeURIComponent(label);

  const handleClick = () => {
    // Executamos o fechamento do menu lateral (passado pela TelaPadrao)
    if (onClick) onClick();
  };

  return (
    <Link
      // envia título e fase na URL
      to={`/app/${rota}/${tituloUrl}`}
      onClick={handleClick}
      className="block w-full px-4 py-1.5 mb-0.5 text-white font-bold text-lg bg-blue-400 hover:bg-blue-600 rounded shadow-sm transition-all no-underline"
    >
      {label}
    </Link>
  );
}