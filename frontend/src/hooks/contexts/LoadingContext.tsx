import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface LoadingContextData {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextData | undefined>(
  undefined
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ loading, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Hook de consumo
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading deve ser usado dentro de LoadingProvider");
  }
  return context;
};
