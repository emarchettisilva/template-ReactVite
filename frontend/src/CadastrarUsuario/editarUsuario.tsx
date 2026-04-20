// src/components/EditarUsuario.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useMensagem } from "../contexts/MensagemContext";
import { useUsuario } from "../contexts/UsuarioContext";
import { formatarCPF } from "../../Utils/formata.ts";
import { useApi } from "../hooks/useApi";
import Botao from "../components/Botao.tsx"

// Interface Usuario mantida para clareza
interface Usuario {
    codUsuarioCPF: string;
    nomUsuario: string;
    desEmail: string;
    idPapel: number;
}

interface EditarUsuarioProps {
    usuario: Usuario;
    modoEdicao: boolean; // true: editar, false: novo
    usuarioLogadoCPF: string;
    onClose: () => void;
    onSave: (usuario: Usuario) => void;
    loading: boolean;
}

const EditarUsuario: React.FC<EditarUsuarioProps> = ({
    usuario,
    modoEdicao,
    usuarioLogadoCPF,
    onClose,
    onSave,
    loading,
}) => {
    const { papeis, estado } = useUsuario();
    const { exibirMensagem } = useMensagem();
    const { fetchApp } = useApi();

    // Estado local para o usuário que está sendo editado (cópia das props)
    const [usuarioLocal, setUsuarioLocal] = useState<Usuario>(usuario);
    //const [cpfError, setCpfError] = useState<string>("");

    // 2. Sincroniza o estado local quando a prop 'usuario' muda
    useEffect(() => {
        setUsuarioLocal(usuario);
    }, [usuario]);
    
    // Define o papel selecionado no listbox, inicialmente com o papel do usuário
    const [papelSelecionadoId, setPapelSelecionadoId] = useState<number>(usuario.idPapel);

    // Atualiza o idPapel do usuárioLocal quando o listbox muda
    useEffect(() => {
        setUsuarioLocal(prev => ({ ...prev, idPapel: papelSelecionadoId }));
    }, [papelSelecionadoId]);

    // 3. Handlers de Mudança
    
    const handleCpfChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const valorFormatado = formatarCPF(e.target.value);
        
        setUsuarioLocal(prev => ({ ...prev, codUsuarioCPF: valorFormatado }));
       
    }, []);

    
    const handleSaveClick = () => {
        onSave(usuarioLocal);
    };
    
    const validarCpfExistente = async () => {
        console.log("Saí do campo CPF! Valor atual:", usuarioLocal.codUsuarioCPF);
        let res
        res = await fetchApp(`/usuarioJaCadastrado/${usuarioLocal.codUsuarioCPF}`);
        
        if (res) { 
            exibirMensagem(res)
        }

    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">
                    {modoEdicao ? "Editar Usuário" : "Novo Usuário"}
                </h3>

                <div className="space-y-4">
                    
                    {/* Input de CPF (Implementação do CPF no input padrão) */}
                    <label className="block">
                        CPF *
                        <input
                            type="text"
                            maxLength={14} // Máscara: 11 dígitos + 3 pontos + 1 traço
                            className={`w-full p-2 border rounded 
                                ${modoEdicao ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
                            }`}
                             
                            value={usuarioLocal.codUsuarioCPF ?? ""}
                            onChange={handleCpfChange}
                            onBlur={validarCpfExistente}
                            readOnly={modoEdicao} // CPF é readOnly na edição
                        />
                    </label>

                    {/* Input de Nome */}
                    <label className="block">
                        Nome *
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-400 rounded"
                            value={usuarioLocal.nomUsuario ?? ""}
                            onChange={(e) =>
                                setUsuarioLocal(prev => ({ ...prev, nomUsuario: e.target.value }))
                            }
                        />
                    </label>
                    
                    {/* Input de E-mail */}
                    <label className="block">
                        E-mail *
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-400 rounded"
                            value={usuarioLocal.desEmail}
                            onChange={(e) =>
                                setUsuarioLocal(prev => ({ ...prev, desEmail: e.target.value }))
                            }
                        />
                    </label>

                    {/* Listbox dos Papéis */}
                    <label htmlFor="papel-select" className="block">Papel *</label>
                    <select
                        id="papel-select"
                        className="w-full p-2 border border-gray-400 rounded"
                        value={papelSelecionadoId}
                        onChange={(e) => setPapelSelecionadoId(Number(e.target.value))}
                    >
                        <option value={0} disabled>
                           -- Selecione um Papel --
                        </option>
                        {papeis
                            .map((p) => (
                                <option key={p.idPapel} value={p.idPapel}>
                                    {p.desPapel}
                                </option>
                            ))}
                    </select>
                </div>
                
                {/* Botões de Ação */}
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
export default EditarUsuario;