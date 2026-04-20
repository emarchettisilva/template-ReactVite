import { Navigate, Outlet } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext";

export default function AuthGate() {
  const { backend } = useUsuario();
  return backend ? <Outlet /> : <Navigate to="/Login" replace />;
}
