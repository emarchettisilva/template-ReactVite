# db.py
import psycopg2
import logging
from config import DB_CONFIG
import enum
import json
from flask import jsonify

class Mode(enum.Enum):
    SELECT = 1
    BEGIN = 2
    DEFAULT = 3
    COMMIT = 4


"""
    Executa uma comando SQL com tratamento de erros e
    controle de transação. 
    retorna os resultados (se houver).

    Args:
        sql (str): A consulta SQL com placeholders.
        params (tuple ou dict): Os parâmetros a serem substituídos na consulta.
        mode: pode ser uma das 4 constantes
          BEGIN -> só conecta ou inicia uma transaçao explicita)
          DEFAULT -> conecta se não houver conexão e commita se not inTransactio
          COMMIT -> só comita (fim de transação explicita)
          SELECT -> espera retornar dados
                          
    Returns:
        list: Uma lista de resultados da consulta 
        (se for um SELECT), ou None em caso de erro ou outras consultas.
    """
class Db:
    def __init__(self, debug=True):
        self.debug = debug
        self.conn = None
        self.cursor = None
        self.inTransaction = False
        self.idInsert = None
        self.tipo= "SUCESSO"  # AVISO ou ERRO
        self.mensagem = []
        self.qtdAtu = 0

        logging.basicConfig(level=logging.ERROR,
                            filename='app.log',
                            filemode='a',
                            format='%(asctime)s - %(levelname)s - %(message)s')

    def execSql(self, sql: str, params: tuple=None, mode: Mode=Mode.DEFAULT, atuIdInsert: bool  =False):
        results = None
        try:
            if mode == Mode.BEGIN:
                self.inTransaction = True
                sql = "BEGIN;\n" + sql
                
            if not self.conn:    
                self.conn = self._get_connection()
                self.cursor = self.conn.cursor()
            
            if self.debug:
                full_sql = self.cursor.mogrify(sql, params).decode("utf-8")
                print("🛢️ Mostrando SQL")
                print(full_sql)
                print(" Fim Sql 🛢️")

            self.cursor.execute(sql, params)
            
            if atuIdInsert:
                self.idInsert = self.cursor.fetchone()[0]

            if mode == Mode.SELECT:
                results = self.cursor.fetchall()
            else:
                self.qtdAtu += self.cursor.rowcount
                if self.inTransaction:
                    results = ''
                else:
                    self.mensagem.append(f"Atualização realizada com sucesso - {self.qtdAtu} registros atualizados!")

            if mode == Mode.COMMIT:
                self.conn.commit()
                self.mensagem.append(f"Transação realizada com sucesso - {self.qtdAtu} registros atualizados!")
                
            if not self.inTransaction:
                self.conn.commit()
                self._finalizar()

        except Exception as e:
            self.tipo = "ERRO"
            self.mensagem.append(f"{e}")

            logging.error(self.mensagem)
           
            if self.conn:
                self.conn.rollback()
            self._finalizar()
        finally:
            if isinstance(results, list):
                pass
                #results = json.dumps(results, indent=2, ensure_ascii=False)
            else:
                if results is None:
                    results = {"tipo": self.tipo,
                               "mensagem": self.mensagem}
            if self.debug:        
                print("Resposta API")
                print(results)
                print("Fim Resposta API")
            return results 

    def getIdInsert(self):
        return self.idInsert
    
    def _finalizar(self):
          if self.conn:
            self.cursor.close()
            self.conn.close()

    def _get_connection(self):
        return psycopg2.connect(**DB_CONFIG)

    def getErro(self, e):
        return {"tipo": self.tipo,
                "mensagem": [f"{self.mensagem}: {e}"]}