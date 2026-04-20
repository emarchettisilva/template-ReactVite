import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import Login from "./Login/page";

import TelaPadrao from "./components/TelaPadrao";
import AuthGate from "./auth/AuthGate";
import PublicRoute from "./auth/PublicRoute";
import { useUsuario } from "./contexts/UsuarioContext";

function ModuloLoader({ rota }: { rota: string }) {
  const Modulo = lazy(() => import(`./${rota}/page.tsx`));

  return (
    <Suspense fallback={<div className="p-6">Carregando módulo...</div>}>
      <Modulo />
    </Suspense>
  );
}

const Home = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Camada da Marca d'Água */}
      <div
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.08]"
        style={{
          backgroundImage: "url('TelaFundo.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain", // Mantém a proporção da logo sem cortar
          maxHeight: "90%", // Evita que a logo encoste nas bordas do cabeçalho
          marginTop: "auto",
          marginBottom: "auto",
        }}
      />
    </div>
  );
};

export default function App() {
  const { menu } = useUsuario();

  return (
    <Routes>
      {/* ROTAS COM LAYOUT PADRÃO */}
      <Route element={<TelaPadrao />}>
        {/* Rota raiz */}
        <Route index element={<Navigate to="Login" replace />} />

        {/* ROTAS PÚBLICAS */}
        <Route
          path="Login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
       
        {/* ROTAS PROTEGIDAS */}
        <Route path="app" element={<AuthGate />}>
          <Route index element={<Home />} />

          {menu?.itens?.map((item) => (
            <Route
              key={item.rota}
              path={`${item.rota}/:titulo`}
              element={<ModuloLoader rota={item.rota} />}
            />
          ))}
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/Login" replace />} />
    </Routes>
  );
}
