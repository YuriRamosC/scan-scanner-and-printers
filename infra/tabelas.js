class Tabelas {
    init(conexao) {
        this.conexao = conexao;

        this.criarImpressoras();
    }

    criarImpressoras() {
        const sql = `CREATE TABLE IF NOT EXISTS Impressoras
        (id int NOT NULL AUTO_INCREMENT,
            id_way VARCHAR(50) NOT NULL,
            tipo_conexao VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL,
            serialNumber VARCHAR(50) NOT NULL,
            lastCommunication VARCHAR(50) NOT NULL,
            installationPoint VARCHAR(60),
            observation TEXT,
            ipAddress VARCHAR(50),
            manufacturer VARCHAR(30),
            model VARCHAR(30),
            customer_name VARCHAR(50),
            scan_status VARCHAR(50),
            scan_observation TEXT,
            PRIMARY KEY(id))`;

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