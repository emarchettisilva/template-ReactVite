import React from 'react';

interface CustomConfirmModalProps {
  isOpen: boolean; // Controla a visibilidade do modal
  onClose: () => void; // Função para fechar o modal (cancelar)
  onConfirm: () => void; // Função para confirmar a ação
  title: string; // Título do modal de confirmação
  message: string; // Mensagem principal da confirmação
}

const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay escuro que cobre a tela
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Conteúdo do modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
        {/* Título do modal */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {/* Mensagem de confirmação */}
        <p className="text-gray-700 mb-6">{message}</p>
        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmModal;