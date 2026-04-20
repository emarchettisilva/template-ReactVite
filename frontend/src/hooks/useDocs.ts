import { useState } from "react";
import {
  DocumentoComUpload,
  DocumentoMetadadosBackend,
} from "../Types/documento";
import { useApi } from "../hooks/useApi";

export function useDocs() {
  const [documentos, setDocumentos] = useState<DocumentoComUpload[]>([]);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [initialDocs, setInitialDocs] = useState<DocumentoComUpload[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState<boolean>(false);
  const [tipoDoc, setTipoDoc] = useState<"B" | "I" | "P" | "E" | "G" | "R">(
    "P",
  ); //usado para telas com mais de um tipo de doc onde não há abas

  const { fetchApp } = useApi();
  const handleGeraInitialDocs = async (
    listIdFile: number[] | null,
    idtTipo: number,
    isModal: boolean = false,
  ) => {
    if (!listIdFile) return;

    let str: string = "";
    listIdFile.forEach((idFileUsuario) => {
      str = `${str}&idFile=${idFileUsuario}`;
    });

    const data = await fetchApp(
      `/obterDocumentosMetadados?idtTipo=${idtTipo}${str}`,
    );

    const docsMeta: DocumentoMetadadosBackend[] = data;
    const docs: DocumentoComUpload[] = [];
    for (let i = 0; i < docsMeta.length; i++) {
      docs.push({
        nroSeq: docsMeta[i].nroSeq,
        desDocto: docsMeta[i].desDocto,
        idFile: listIdFile[i],
        fileName: docsMeta[i].nomFile,
      });
    }

    setInitialDocs(docs);
    if (isModal) {
      setIsDocModalOpen(true);
    }
  };

  const geraFormDataDocumentoPost = (formDataEnvio: FormData) => {
    if (documentos.length > 0 && documentos[0] !== null) {
      formDataEnvio.append(
        "documentosMetadados",
        JSON.stringify(
          documentos.map((d) => ({
            nroSeq: d.nroSeq,
            desDocto: d.desDocto,
            idtObrigatorio: d.idtObrigatorio,
            docFileName: d.fileName,
          })),
        ),
      );
      documentos.forEach((doc) => {
        if (doc.file) {
          formDataEnvio.append("documentos", doc.file);
        } else {
          const emptyFile = new Blob([], { type: "application/octet-stream" });
          formDataEnvio.append("documentos", emptyFile, "vazio.txt");
        }
      });
    }
  };

  const geraFormDataDocumentoPut = (formDataEnvio: FormData) => {
    if (documentos.length > 0 && documentos[0] !== null) {
      formDataEnvio.append(
        "documentosMetadados",
        JSON.stringify(
          documentos.map((d) => ({
            nroSeq: d.nroSeq,
            desDocto: d.desDocto,
            isDeleted: d.idtDeletado,
            idFile: d.idFile,
          })),
        ),
      );
      documentos.forEach((doc) => {
        if (doc.file) {
          formDataEnvio.append("documentos", doc.file);
        } else {
          const emptyFile = new Blob([], { type: "application/octet-stream" });
          formDataEnvio.append("documentos", emptyFile, "vazio.txt");
        }
      });
    }
  };

  return {
    documentos,
    setDocumentos,
    initialDocs,
    setInitialDocs,
    isDocModalOpen,
    setIsDocModalOpen,
    buscaRealizada,
    setBuscaRealizada,
    tipoDoc,
    setTipoDoc,
    handleGeraInitialDocs,
    geraFormDataDocumentoPost,
    geraFormDataDocumentoPut,
  };
}
