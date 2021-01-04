const fs = require('fs');
const logPath = './systemlog.txt';
const moment = require('moment');

const arrayUpdate = [];
//Esse array guarda os "gravarComData" de uma Atualização e no final vai ser enviado para a aplicação Cliente
class Log {
    gravar(message) {
        fs.appendFile(logPath, '\n'+message, function(erro) {
            if(erro) {
                console.log('Erro ao gravar o Log');
            }
            else {
                console.log(message);
            }
        });
    }

    gravarComData(message) {
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        fs.appendFile(logPath, '\n'+date+' - '+message, function(erro) {
            if(erro) {
                console.log('Erro ao gravar o Log');
            }
            else {
                console.log(date+' - '+message);
            }
        })
    }

    lerLog(callback){
        callback(fs.readFileSync(logPath).toString().split("\\n"));
    }
}
module.exports = new Log;