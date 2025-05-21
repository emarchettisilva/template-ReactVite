
rotasMunicipioPost = [
    {
        "method": "POST",
           "url": "http://localhost:5000/api/municipioIBGE",
          "data": {"codMunicipioIBGE": 1, 
                   "nomMunicipio": "Abaete",
                   "IDH": 0.7,
                   "perPopulacaoRuralUrbana": 60,
                }
    }
]

rotasMunicipioGetPutGet = [
    {
        "method": "GET",
        "url": "http://127.0.0.1:5000/api/obterMunicipioIBGEPorId/1"
    },
    {
        "method": "PUT",
           "url": "http://localhost:5000/api/municipioIBGE",
          "data": {"nomMunicipio": "Abaeté Alterado",
              "IDH": 0.8,
              "perPopulacaoRuralUrbana": 70,
              "codMunicipioIBGE": 1,}
    },
    {
        "method": "GET",
           "url": "http://127.0.0.1:5000/api/municipioIBGE"
    },
    {
        "method": "GET",
           "url": "http://127.0.0.1:5000/api/obterMunicipioIBGEPorId/1"
    },
    {
        "method": "PUT",
           "url": "http://localhost:5000/api/municipioIBGE",
          "data": {"nomMunicipio": "",
                   "IDH": '',
                   "perPopulacaoRuralUrbana": None,
                   "codMunicipioIBGE": '',}
    },
]

rotasMunicipioDelete = [
    {"method": "DELETE",
        "url": "http://localhost:5000/api/municipioIBGE/1"
    },
]
