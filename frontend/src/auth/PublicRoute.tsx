import { Navigate } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { backend } = useUsuario();

  if (backend) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
