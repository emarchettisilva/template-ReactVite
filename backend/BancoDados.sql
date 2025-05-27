drop table if exists Usuario cascade;
drop table if exists Cargo cascade;

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


create table Cargo (
    codCargo smallint not null,
    nomCargo  varchar(30) not null,
    primary key (codCargo)
);

-- Função para obter o próximo valor da sequência para cargo
-- #########################################################################
CREATE OR REPLACE FUNCTION public.get_next_cargo_codCargo()
RETURNS smallint AS $$
DECLARE
    next_id smallint;
BEGIN
    SELECT COALESCE(max(codCargo), 0) + 1
    INTO next_id
    FROM Cargo;
       
    RETURN next_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar o ID automaticamente
CREATE OR REPLACE FUNCTION public.generate_Cargo_codCargo()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codCargo := public.get_next_Cargo_codCargo();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_generate_Cargo_codCargo
BEFORE INSERT ON cargo
FOR EACH ROW
EXECUTE PROCEDURE public.generate_Cargo_codCargo();
-- FIM #################################################################################
