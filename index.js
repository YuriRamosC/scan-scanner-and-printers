const customExpress = require('./config/customExpress');
const conexao = require('./infra/conexao');
const Tabelas = require('./infra/tabelas');
var http = require('http');
const app = customExpress();
/*app.listen(3000, function() {
    console.log(`Servidor rodando na porta 3000`);
});*/

conexao.connect(erro => {
    if(erro) {
        console.log(erro)

    } else {
        console.log('conectado com sucesso')
        
       Tabelas.init(conexao)
        
        const app = customExpress()
        const httpServer = http.createServer(app)
        httpServer.listen(3000);

        /*https.createServer( () => console.log('Servidor rodando na porta 3000'), app).listen(3000);
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'))*/
    }
});
