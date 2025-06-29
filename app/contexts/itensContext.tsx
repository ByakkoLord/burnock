import React, { createContext, useState } from "react";

type ItensContextType = {
  status: any[]; // ou troque "any" pelo tipo real dos seus itens, ex: string[]
  setStatus: (status: any[]) => void;
};

// Valor inicial com tipos corretos
const ItensContext = createContext<ItensContextType>({
  status: [],
  setStatus: () => {}, // função vazia só pra inicialização
});

export const ItensProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<any[]>([]); // pode ser string[], number[], etc.

  return (
    <ItensContext.Provider value={{ status, setStatus }}>
      {children}
    </ItensContext.Provider>
  );
};

export default ItensContext;
