const fs = require('fs');
const logPath = './systemlog.txt';
const moment = require('moment');
class Log {
    
    gravar(message) {
        fs.writeFile(logPath, '\n'+message, function(erro) {
            if(erro) {
                console.log('Erro ao gravar o Log');
            }
            else {
                console.log(message);
            }
        });
    }

    gravarComData(message) {
        var date = moment().format('YYYY-MM-DD HH:MM:SS');
        fs.appendFile(logPath, '\n'+date+' - '+message, function(erro) {
            if(erro) {
                console.log('Erro ao gravar o Log');
            }
            else {
                console.log(date+' - '+message);
            }
        })
    }
}
module.exports = new Log;