// src/app/lista-cargo/EditarCargoModal.tsx
import React, { useState, useEffect } from "react";
import Botao from "../components/Botao"

interface Cargo {
  codCargo: number;
  nomCargo: string;
}

interface EditarCargoModalProps {
  cargo: Cargo; // O cargo que está sendo editado/criado
  modoEdicao: boolean;
  onClose: () => void;
  onSave: (cargo: Cargo) => void;
  loading: boolean;
}

const EditarCargo: React.FC<EditarCargoModalProps> = ({
  cargo,
  modoEdicao,
  onClose,
  onSave,
  loading
}) => {
  const [cargoLocal, setCargoLocal] = useState<Cargo>(cargo);
  
  // Sincroniza o estado local quando a prop 'cargo' muda
  useEffect(() => {
    if (cargo) {
      setCargoLocal(cargo);
    }
  }, [cargo]);

  const handleSaveClick = () => {
    onSave(cargoLocal);
  };

  return (
    // Simulação de um modal (Pode ser ajustado para usar seu componente Modal real)
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">
          {modoEdicao ? "Editar Cargo" : "Novo Cargo"}
        </h3>

        <div className ="space-y-4">
          <label className="block text-gray-700 font-medium">
            Nome do Cargo *
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={cargoLocal.nomCargo || ""}
              onChange={(e) =>
                setCargoLocal((prev) => ({ ...prev, nomCargo: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="mt-6 flex justify-center gap-4 border-t pt-4">
          <Botao
            titulo="Cancelar" 
            variante="Cancelar" 
            onClick={onClose} 
          />
          
          <Botao 
            variante="Salvar" 
            titulo={modoEdicao ? "Salvar Alterações" : "Cadastrar"} 
            onClick={handleSaveClick}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditarCargo;