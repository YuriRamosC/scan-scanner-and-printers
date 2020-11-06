class Tabelas {
    init(conexao) {
        this.conexao = conexao

        this.criarImpressoras()
    }

    criarImpressoras() {
        const sql = `CREATE TABLE IF NOT EXISTS Impressoras
        (id int NOT NULL AUTO_INCREMENT,
            empresa varchar(50) NOT NULL,
            fabricante varchar(20),
            modelo varchar(20) NOT NULL,
            numero_serie VARCHAR(50) NOT NULL,
            ponto VARCHAR(50) NOT NULL,
            ip VARCHAR(50) NOT NULL,
            ultima_comun datetime,
            observacoes text,
            PRIMARY KEY(id))`

        this.conexao.query(sql, erro => {
            if (erro) {
                console.log(erro)
            } else {
                console.log('Tabela Impressoras criada com sucesso')
            }
        })
    }
}

module.exports = new Tabelas