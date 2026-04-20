// src/app/cadastrar-usuario/page.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { useMensagem } from "../contexts/MensagemContext";
import { useUsuario } from "../contexts/UsuarioContext";
import CustomConfirmModal from '../components/customConfirmModal'; 
import EditarUsuario from "./editarUsuario"; 
import { useApi } from "../hooks/useApi";
import Botao from "../components/Botao"

interface Usuario {
    codUsuarioCPF: string;
    nomUsuario: string;
    desEmail: string;
    idPapel: number;
}

export default function CadastrarUsuario() {
    const { estado, backend, papeis } = useUsuario();
    const { exibirMensagem } = useMensagem();
    const { fetchApp } = useApi();
    const [loading] = useState(false);

    // Estados da página (Lista, Loading, Modal de Confirmação)
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

    // Estado de Edição (Controla se o modal está aberto e qual usuário está sendo editado/criado)
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
    const [modoEdicao, setModoEdicao] = useState(false); // true: editar, false: novo

    // Carregamento de Usuários (Mantido)
    const carregarUsuarios = useCallback(async () => {
        let url = `/obterUsuarios`;
        
        const data = await fetchApp(url);
        setUsuarios(data);
        
    }, [exibirMensagem]);

    useEffect(() => {
        carregarUsuarios();
    }, [carregarUsuarios]);

    const salvarUsuario = async (payload: Usuario) => {
        // Recebe o usuário atualizado do modal e executa a chamada API
        const payloadCompleto = {
            ...payload,
            codUsuarioLogado: backend?.codUsuarioCPF
        };
        
        const metodo = modoEdicao ? "PUT" : "POST";

        const res = await fetchApp("/usuario", {
            method: metodo,
            body: JSON.stringify(payloadCompleto),
        });

        if (res) {
          carregarUsuarios();
          setUsuarioEditando(null);
        }        
    };

    const handleDeleteClick = (usuario: Usuario) => {
        setUsuarioToDelete(usuario);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteCancel = () => {
        setIsConfirmModalOpen(false);
        setUsuarioToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!usuarioToDelete) return;

        setIsConfirmModalOpen(false);

        const mensagem = await fetchApp(`/usuario/${usuarioToDelete.codUsuarioCPF}`,
                { method: "DELETE", }
            );
        exibirMensagem(mensagem)
        carregarUsuarios();
        setUsuarioToDelete(null);
    };

    // Funções de Edição/Criação
    const handleNovoUsuario = () => {
        setUsuarioEditando({
            codUsuarioCPF: "",
            nomUsuario: "",
            desEmail: "",
            idPapel: 0
        });
        setModoEdicao(false);
    };

    const handleEditarUsuario = (usuario: Usuario) => {
        setUsuarioEditando(usuario);
        setModoEdicao(true);
    };


    return (
        <div className="p-4">
            
            {/* Tabela de Usuários */}
            <div className="overflow-x-auto shadow rounded-lg">
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">CPF</th>
                            <th className="border border-gray-400 px-4 py-2">Nome</th>
                            <th className="border border-gray-400 px-4 py-2">E-mail</th>
                            <th className="border border-gray-400 px-4 py-2">Papel</th>
                            <th className="border border-gray-400 px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.codUsuarioCPF} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{usuario.codUsuarioCPF}</td>
                                <td className="border px-4 py-2">{usuario.nomUsuario}</td>
                                <td className="border px-4 py-2">{usuario.desEmail}</td>
                                <td className="border px-4 py-2">
                                    {/* Lógica de busca de Papel mantida */}
                                    {papeis.find(
                                        p => Number(p.idPapel) === Number(usuario.idPapel)
                                    )?.desPapel || "Papel inválido"}
                                </td>
                              
                                <td className="border px-4 py-2">
                                    <div className="flex items-center justify-center gap-4">
                                        <Botao
                                            titulo="" 
                                            variante="Editar" 
                                            hint="Editar este usuário"
                                            onClick={() => handleEditarUsuario(usuario)}
                                        />
                                        <Botao
                                            titulo="" 
                                            variante="Excluir" 
                                            hint="Excluir este usuário"
                                            onClick={() => handleDeleteClick(usuario)}
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
                titulo="Incluir Usuário"
                onClick={handleNovoUsuario}
                loading={loading}
            />

            {/* Modal de Edição (Novo Componente) */}
            {usuarioEditando && (
                <EditarUsuario
                    usuario={usuarioEditando}
                    modoEdicao={modoEdicao}
                    usuarioLogadoCPF={backend?.codUsuarioCPF || ""}
                    onClose={() => setUsuarioEditando(null)}
                    onSave={salvarUsuario}
                    loading={loading}
                />
            )}

            {/* Modal de Confirmação de Exclusão (Mantido) */}
            <CustomConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o Usuário "${usuarioToDelete?.nomUsuario}"? Esta ação não pode ser desfeita.`}
            />
        </div>
    );
}