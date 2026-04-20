import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { ICargo } from "../Types/cadastro";

// Esta variável vive fora do ciclo de vida do componente (persiste na sessão)
let listaCargosCache: ICargo[] | null = null;
let promiseEmAndamento: Promise<ICargo[] | null> | null = null;

interface SelectCargoProps {
  value: string | number;
  onChange: (cod: string, nome: string) => void;
  className?: string;
}

const SelectCargo: React.FC<SelectCargoProps> = ({ value, onChange, className }) => {
  const { fetchApp } = useApi();
  const [options, setOptions] = useState<ICargo[]>(listaCargosCache || []);
  const [isLoading, setIsLoading] = useState(!listaCargosCache);

  useEffect(() => {
    // Se já temos os dados no cache (segunda vez em diante), não faz nada
    if (listaCargosCache) return;

    const carregarCargos = async () => {
      // Se outra instância já estiver buscando, espera a mesma promessa
      if (promiseEmAndamento) {
        const data = await promiseEmAndamento;
        if (data) setOptions(data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Criamos a promessa e guardamos na variável global
      promiseEmAndamento = fetchApp("/cargo", {}, false);
      
      const data = await promiseEmAndamento;
      if (data) {
        listaCargosCache = data; // Salva para as próximas chamadas
        setOptions(data);
      }
      setIsLoading(false);
      promiseEmAndamento = null; // Limpa a promessa após concluir
    };

    carregarCargos();
  }, [fetchApp]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const label = e.target.options[e.target.selectedIndex].text;
    onChange(val, val === "" ? "" : label);
  };

  return (
    <select
      className={className}
      value={String(value || "")}
      onChange={handleSelectChange}
      disabled={isLoading}
    >
      <option value="">{isLoading ? "Carregando cargos..." : "Selecione o cargo..."}</option>
      {options.map((cargo) => (
        <option key={cargo.codCargo} value={cargo.codCargo}>
          {cargo.nomCargo}
        </option>
      ))}
    </select>
  );
};

export default SelectCargo;