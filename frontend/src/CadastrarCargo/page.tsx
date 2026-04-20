'use client'; 

import { useEffect, useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { useMensagem } from "../contexts/MensagemContext";
import CustomConfirmModal from '../components/customConfirmModal'; 
import EditarCargo from './editarCargo';
import Botao from "../components/Botao"

interface Cargo {
  codCargo: number;
  nomCargo: string;
}

export default function page() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cargoEditando, setCargoEditando] = useState<Cargo | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cargoToDelete, setCargoToDelete] = useState<Cargo | null>(null); 
  const { fetchApp, loading } = useApi(); 
  const { exibirMensagem } = useMensagem();

  // --- Funções de API (Centralizadas no componente pai) ---
  
  const buscarCargos = useCallback(async () => {
    const data = await fetchApp("/cargo", {}, false)
    if (data) {
      setCargos(data)
    } else {
      setCargos([])
    }
  }, [fetchApp]);

  useEffect(() => {
    buscarCargos();
  }, [buscarCargos]);

  const salvarCargo = async (cargo: Cargo) => {
    const metodo = cargo.codCargo > 0 ? "PUT" : "POST";
        
    const res = await fetchApp("/cargo", {
      method: metodo,
      body: JSON.stringify(cargo),
    });

    if (res) {
      buscarCargos(); // Recarrega a lista
      setCargoEditando(null); // Fecha o modal 
    }     
  };
  
  // Função para abrir o modal em modo Edição (busca o cargo antes de abrir)
  const handleEditarClick = async (codCargo: number) => {
    const data = await fetchApp(`/obterCargoPorId/${codCargo}`);
   
    if (data) {
      setCargoEditando(data[0]);
      setModoEdicao(true);
    }
  };

  const handleNovoCargo = () => {
    setCargoEditando({
      codCargo: 0,
      nomCargo: ""
    });
    setModoEdicao(false);
  };
  
  // --- Funções de Exclusão (Mantidas) ---

  const handleDeleteClick = (cargo: Cargo) => {
      setCargoToDelete(cargo);
      setIsConfirmModalOpen(true);
  };
    
  const handleDeleteCancel = () => {
    setIsConfirmModalOpen(false);
    setCargoToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!cargoToDelete) return;

    setIsConfirmModalOpen(false);

    const res = await fetchApp(`/cargo/${cargoToDelete.codCargo}`, {
      method: "DELETE",
    });

    if (res) {
      exibirMensagem(res);
      buscarCargos();
    } 
  }

  // --- JSX da Listagem e Botões ---

  return (
    <div className="p-4">
      {loading && <p>Carregando...</p>}
      
      <div className="overflow-x-auto shadow rounded-lg mb-4">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2">Nome do Cargo</th>
              <th className="border border-gray-400 px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo) => (
              <tr key={cargo.codCargo} className="hover:bg-gray-50">
                <td className="border border-gray-400 px-4 py-2">
                  {cargo.nomCargo}
                </td>
                <td className="border border-gray-400 px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-4">
                    <Botao
                      titulo="" 
                      variante="Editar" 
                      hint="Editar este cargo"
                      onClick={() => handleEditarClick(cargo.codCargo)}
                    />
                    <Botao
                      titulo="" 
                      variante="Excluir" 
                      hint="Excluir este cargo"
                      onClick={() => handleDeleteClick(cargo)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Botao 
        variante="Incluir" 
        titulo="Inserir Novo Cargo"
        onClick={handleNovoCargo}
        loading={loading}
      />
      
      {/* Componente Modal de Edição */}
      {cargoEditando && (
        <EditarCargo
          key={cargoEditando.codCargo}
          cargo={cargoEditando}
          modoEdicao={modoEdicao}
          onClose={() => setCargoEditando(null)}
          onSave={salvarCargo}
          loading={loading}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <CustomConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o Cargo "${cargoToDelete?.nomCargo}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
