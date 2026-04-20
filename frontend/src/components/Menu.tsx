import MenuItem from "./MenuItem"
interface MenuProps {
  itens: { rota: string; label: string }[];
  aoClicar?: () => void;
}

export default function Menu({ itens, aoClicar }: MenuProps) {
  return (
    <div className="flex flex-col w-100 h-full bg-gray-200 border-r border-gray-300">
      {/* Container de scroll para os itens */}
      <div className="flex flex-col w-full overflow-y-auto p-2">
        {itens.map((item, index) => (
          <MenuItem 
            key={index} 
            label={item.label} 
            rota={item.rota} 
            onClick={aoClicar} 
          />
        ))}
      </div>
    </div>
  );
}