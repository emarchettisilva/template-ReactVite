import requests
import re
import json
from criterioPontuacao_routes import rotasCriterioPontuacaoPost, rotasCriterioPontuacaoGetPutGet, rotasCriterioPontuacaoDelete
from edital_routes import rotasEditalPost, rotasEditalGetPutGet, rotasEditalDelete
from municipio_routes import rotasMunicipioPost, rotasMunicipioGetPutGet, rotasMunicipioDelete
from empresaGeo_routes import rotasEmpresaGeoPost, rotasEmpresaGeoGetPutGet, rotasEmpresaGeoDelete
from emater_routes import rotasEmaterPost, rotasEmaterGetPutGet, rotasEmaterDelete
from login_routes import rotasLoginPost, rotasLoginGetPutGet, rotasLoginDelete
from prefeitura_routes import rotasPrefeituraPost, rotasPrefeituraGetPutGet, rotasPrefeituraDelete
from processo_routes import rotasProcessoPost, rotasProcessoGetPutGet, rotasProcessoDelete
from beneficiario_routes import rotasBeneficiarioPost, rotasBeneficiarioGetPutGet, rotasBeneficiarioDelete


# Cabeçalhos comuns (se necessário token ou content-type)
headers = {
    "Content-Type": "application/json",
}

def testaRota(rotas, headers=None):
    headers = headers or {}
    for rota in  rotas:
        try:
            method = rota.get("method")
            url = rota.get("url")
            data = rota.get("data")

            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                print(f"🚫 Método {method} não suportado: {url}")
                continue
            
            status = response.status_code
            if status < 400:
                icone = '✅'
            else:
                icone = '❌' 

            print(f"{icone} Método: {method} status {status} url {url}:")
        
            try:
                conteudo = response.json()
                if conteudo == '':
                   continue
                
            except json.JSONDecodeError:
                html = response.text
                # Expressão regular para capturar conteúdo de <div class="plain">...</div>
                match = re.search(r'<div\s+class=["\']plain["\'].*?>(.*?)</div>', html, re.DOTALL)
                print("Conteúdo da resposta bruta (possivelmente HTML):")
                if match:
                    conteudo = match.group(1).strip()
                    print(conteudo)
                else:
                    print(f"⚠️ {response.text}")
                print("-----------------------------------❌")
                continue
            except requests.exceptions.RequestException as err:
                print(f"Erro de conexão: {err}")
                continue

            if data is not None:
                print(f"📥 Dados recebidos para atualização:")
                print(json.dumps(data, indent=2, ensure_ascii=False))
                print("--------------------------------------📥\n")
            
            if isinstance(conteudo, dict):
                tipo = conteudo.get("tipo")
                mensagem = conteudo.get("mensagem", "")
                
                print(f"ℹ️ Tipo: {tipo}")
                if isinstance(mensagem, list):
                    for linha in mensagem:
                        if linha.strip():
                            print(linha.strip())
                else:
                    print(mensagem)
                print(f"-----------------------------------------------------------ℹ️\n")
            else:
                print(f"🔍 Resposta Select:")
                print(json.dumps(conteudo, indent=2, ensure_ascii=False))
                print(f"Fim Select -----------------------------🔍\n")

        except Exception as e:
            print(f"❌ ERRO ao acessar {url}: {str(e)}")


print("✅ Validando rotas...\n")

#testaRota(rotasMunicipioDelete)
#testaRota(rotasMunicipioPost)
#testaRota(rotasMunicipioGetPutGet)

#testaRota(rotasCriterioPontuacaoDelete)
#testaRota(rotasCriterioPontuacaoPost)
#testaRota(rotasCriterioPontuacaoGetPutGet)

#testaRota(rotasEditalDelete)
#testaRota(rotasEditalPost)
#testaRota(rotasEditalGetPutGet)

#testaRota(rotasPrefeituraDelete)
#testaRota(rotasPrefeituraPost)
#testaRota(rotasPrefeituraGetPutGet)


#testaRota(rotasEmaterDelete)
#testaRota(rotasEmaterPost)
#testaRota(rotasEmaterGetPutGet)


#testaRota(rotasEmpresaGeoDelete)
#testaRota(rotasEmpresaGeoPost)
#testaRota(rotasEmpresaGeoGetPutGet)

#testaRota(rotasProcessoDelete)
#testaRota(rotasProcessoPost)
#testaRota(rotasProcessoGetPutGet)

#testaRota(rotasBeneficiarioDelete)
#testaRota(rotasBeneficiarioPost)
#testaRota(rotasBeneficiarioGetPutGet)

testaRota(rotasLoginDelete)
testaRota(rotasLoginPost)
testaRota(rotasLoginGetPutGet)



