create table Usuario (
    codUsuarioCPF    char(11) not null,
    nomUsuario       varchar(50) not null,
    desSenha         varchar(70),
    desEmail         varchar(50) not null,
    idtPapel         char(1) check (idtPapel in ('A', 'F', 'G')),  -- Administrador, funcionario, Gestor
    idtAtivo         bool not null,
    primary key (codUsuarioCPF)
);

insert into usuario (codUsuarioCPF, nomUsuario, desEmail, idtPapel, idtAtivo)
values
  ('11111111111', 'José Administrador', 'ze@gmail.com', 'A', True),
  ('22222222222', 'José Funcionario', 'ze@gmail.com', 'F', True),
  ('33333333333', 'José Gestor', 'ze@gmail.com', 'G', True);


create table MunicipioIBGE (
    codMunicipioIBGE       int not null,
    nomMunicipio  varchar(50) not null,
    IDH           decimal(4,3) not null,
    perPopulacaoRuralUrbana decimal(6,3) not null,
    primary key (codMunicipioIBGE)
);