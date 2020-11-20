class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarImpressoras();
        this.criarAnotacoes();
        this.inserirAnotacoes('andre', 'pink', 0);
        this.inserirAnotacoes('devilPrinter','border-left-color: rgb(99, 0, 0)', 0);
        this.inserirAnotacoes('cantCheck', 'red', 0);
        this.inserirAnotacoes('noMonitoring', 'grey', 0);
        this.inserirAnotacoes('recentlyLost', 'border-left-color: rgb(187, 43, 98)', 0);
        this.inserirAnotacoes('keven', 'orange', 0);
        this.inserirAnotacoes('everythingOk','green', 0);
        this.inserirAnotacoes('recentlyOnline', 'blue', 0);
    }
    criarAnotacoes() {
        const sql = `
        CREATE TABLE IF NOT EXISTS Anotacoes(
            id int NOT NULL AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            color VARCHAR(50) NOT NULL,
            priorityLevel INT DEFAULT 0,
            PRIMARY KEY(id))`;
        this.conexao.query(sql, erro => {
            if (erro) {
                console.log(erro)
            } else {
                console.log('Tabela Anotações criada com sucesso')
            }
        })
    }

    inserirAnotacoes(name, color, priority) {
        const sql = `
        INSERT INTO Anotacoes (
            name,
            color,
            prioritylevel
        ) SELECT '${name}', '${color}', ${priority} WHERE NOT EXISTS (SELECT * FROM Anotacoes WHERE name LIKE '${name}')`;

        this.conexao.query(sql, erro => {
            if (erro) {
                console.log(erro)
            } else {
            //    console.log(`Anotação ${name} inserida com sucesso`);
            }
        })
    }
    criarImpressoras() {
        const sql = `CREATE TABLE IF NOT EXISTS Impressoras
        (id int NOT NULL AUTO_INCREMENT,
            id_way VARCHAR(50) NOT NULL UNIQUE,
            tipo_conexao VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL,
            serialNumber VARCHAR(50) NOT NULL,
            lastCommunication VARCHAR(50),
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