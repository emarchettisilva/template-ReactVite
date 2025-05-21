rotasLoginPost = [
    {
        "method": "POST", 
           "url": "http://localhost:5000/api/usuario",   
          "data": {"codUsuarioCPF": "50087622655", 
                   "nomUsuario": "José Antônio",
                   "desEmail": "jose@gmail.com",
                   "idtPerfil": "P",
                   "idtAdministrador": False,
                   "idtFuncionario": True,
                   "idtGestor": True,
                   "idtAtivo": True,
                   "vinculos": [{"codVinculo": "1", 
                               "codUsuarioCPF": "50087622655"}
                              ]
             }
    },
    {
        "method": "POST", 
           "url": "http://localhost:5000/api/usuario",   
          "data": {"codUsuarioCPF": "", 
                   "nomUsuario": "",
                   "desEmail": "",
                   "idtPerfil": "",
                   "idtAdministrador": "",
                   "idtFuncionario": "",
                   "idtGestor": "",
                   "idtAtivo": "",
                   "vinculo": [{"codVinculo": "", 
                               "codUsuarioCPF": ""}
                              ]
             }
    }
]

rotasLoginGetPutGet = [
    #idtPerfil,codMunicipioIBGE,codCNPJEmpresaGeo
    {
        "method": "GET", 
        "url": "http://localhost:5000/api/obterUsuarios/S/0/0"
    },
    {
        "method": "GET", 
        "url": "http://localhost:5000/api/obterUsuarios/P/1/0"
    },
    {
        "method": "GET", 
        "url": "http://localhost:5000/api/obterUsuarios/G/0/11111111111111"
    },
    {
        "method": "GET", 
        "url": "http://localhost:5000/api/obterUsuarios/E/1/0"
    },

    #codUsuarioCPF
    {
        "method": "GET",
           "url": "http://localhost:5000/api/loginAcesso/50087622655"
    },
    {
        "method": "PUT", "url": "http://localhost:5000/api/alterarSenha",
          "data": {"codUsuarioCPF": "50087622654", 
                   "desSenha": "123456"
                  }
    },    
    {
        "method": "POST",
           "url": "http://localhost:5000/api/loginAcesso",
          "data": {"codUsuarioCPF": "50087622654", 
                   "desSenha": "123456"
                  }
    },

    {
        "method": "PUT",
           "url": "http://localhost:5000/api/usuario",
          "data": {"nomUsuario": "José Antônio Alterado",
                   "desEmail": "jose@gmail.com",
                   "idtPerfil": "P",
                   "idtAdministrador": False,
                   "idtFuncionario": True,
                   "idtGestor": True,
                   "idtAtivo": True,
                   "codUsuarioCPF": "50087622654"
                  }
    },
    {
        "method": "GET",
           "url": "http://localhost:5000/api/obterUsuariosParaAprovação/P"
    },
    {
        "method": "GET",
           "url": "http://localhost:5000/api/obterUsuariosParaAprovação/E"
    },
    {
        "method": "GET",
           "url": "http://localhost:5000/api/obterUsuariosParaAprovação/G"
    }
]

rotasLoginDelete = [
]