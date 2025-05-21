# routes/municipio_routes.py
from flask import Blueprint, request
from db import Db, Mode

from valida import Valida
import util

municipioIBGE_bp = Blueprint("municipioIBGE_bp", __name__)

@municipioIBGE_bp.route("/municipioIBGE", methods=["GET"])
def get_municipioIBGE():
    sql = """
        SELECT codMunicipioIBGE,
               nomMunicipio,
               IDH,
               perPopulacaoRuralUrbana
          FROM MunicipioIBGE
        """
    
    try:
        db = Db()
        municipios = db.execSql(sql, None, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    
    # Formata a resposta para um JSON nomeado
    municipios_formatados = []
    for municipio in municipios:
        municipios_formatados.append({
            "codMunicipioIBGE": municipio[0],
            "nomMunicipio": municipio[1],
            "IDH": municipio[2],
            "perPopulacaoRuralUrbana": municipio[3],
        })

    return municipios_formatados


# Rota para obter um municipio específico
@municipioIBGE_bp.route("/obterMunicipioIBGEPorId/<int:codMunicipioIBGE>", methods=["GET"])
def obter_municipioIBGEPorId(codMunicipioIBGE):
    valida = Valida()
    valida.codMunicipioIBGE(codMunicipioIBGE)
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        SELECT codMunicipioIBGE,
               nomMunicipio, 
               IDH,
               perPopulacaoRuralUrbana
          FROM MunicipioIBGE
         WHERE codMunicipioIBGE = %s
    """
    params = (codMunicipioIBGE,)
    
    db = Db()
    try:   
        municipio = db.execSql(sql, params, Mode.SELECT)
    except Exception as e:
        return db.getErro(e)

    print(f"resposta {municipio}")
    if not municipio:
        return util.formataAviso("Municipio IBGE não encontrado")

    linha = municipio[0]
    municipio_formatado = [{
        "codMunicipioIBGE": linha[0],
        "nomMunicipio": linha[1],
        "IDH": linha[2],
        "perPopulacaoRuralUrbana": linha[3]
    }]

    return municipio_formatado

# Rota para adicionar um municipio
@municipioIBGE_bp.route('/municipioIBGE', methods=['POST'])
def add_municipioIBGE():
    data = request.json
         
    codMunicipioIBGE = data.get('codMunicipioIBGE')
    nomMunicipio = data.get('nomMunicipio')
    IDH = data.get('IDH')
    perPopulacaoRuralUrbana = data.get('perPopulacaoRuralUrbana')

    valida = Valida()
    valida.codMunicipioIBGE(codMunicipioIBGE)
    valida.nomMunicipio(nomMunicipio)
    valida.IDH(IDH)
    valida.perPopulacaoRuralUrbana(perPopulacaoRuralUrbana) 
  
    if valida.temMensagem():
        return valida.getMensagens

    sql = """
        INSERT INTO MunicipioIBGE
          (codMunicipioIBGE, nomMunicipio, IDH, perPopulacaoRuralUrbana)
            VALUES (%s, %s, %s, %s)
    """
    params = (codMunicipioIBGE, nomMunicipio, IDH, perPopulacaoRuralUrbana,)
    
    db = Db()
    try: 
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

    
@municipioIBGE_bp.route('/municipioIBGE', methods=['PUT'])
def update_municipioIBGE():
    data = request.json  

    codMunicipioIBGE = data.get('codMunicipioIBGE')
    nomMunicipio = data.get('nomMunicipio')
    IDH = data.get('IDH')
    perPopulacaoRuralUrbana = data.get('perPopulacaoRuralUrbana')

    valida = Valida()
    valida.codMunicipioIBGE(codMunicipioIBGE)
    valida.nomMunicipio(nomMunicipio)
    valida.IDH(IDH)
    valida.perPopulacaoRuralUrbana(perPopulacaoRuralUrbana) 

    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        UPDATE MunicipioIBGE
           SET nomMunicipio = %s,
               IDH = %s,
               perPopulacaoRuralUrbana = %s
         WHERE codMunicipioIBGE = %s
        """
    params = (nomMunicipio, IDH, perPopulacaoRuralUrbana, codMunicipioIBGE,)
        
    try:
        db = Db()
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

@municipioIBGE_bp.route("/municipioIBGE/<int:codMunicipioIBGE>", methods=["DELETE"])
def deletar_municipio(codMunicipioIBGE):
    valida = Valida()
    valida.codMunicipioIBGE(codMunicipioIBGE)
    
    if valida.temMensagem():
        return valida.getMensagens()

    sql = """
        DELETE FROM MunicipioIBGE 
         WHERE codMunicipioIBGE = %s
    """
    params = (codMunicipioIBGE,)

    try:  
        db = Db()  
        return db.execSql(sql, params)
    except Exception as e:
        return db.getErro(e)

