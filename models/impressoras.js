
const moment = require('moment');
const conexao = require('../infra/conexao');
const request = require('request');
const fs = require('fs');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};

//5542C0E2-6C0F-43F1-B576-5056CED690B1

class Impressora {
    adiciona(impressora, res) {

        const sql = 'INSERT INTO Impressoras SET ?'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(impressora)
            }
        })

    }

    lista(res) {
        const sql = 'SELECT * FROM Impressoras'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    requestPrintWayy(skip) {
        let string = '';
        let skipString='';
        if (skip) {
            skipString = '?skip='+skip;
        }
        let urlFinal = urlBase+skipString;
        return request({ url: urlFinal, headers: headers }, (err, req, resp) => {
            console.log(urlFinal);
            if (err) {
                console.log(err);
                alert(err);
            } else {
                let biribinha = JSON.parse(resp);
                let impressoras = biribinha.data;
                //percorrendo o JSON recebido
                for (var row in impressoras) {
                    //SQL //
                    string += JSON.stringify(impressoras[row], null, 4);
                }
            }
            string += '\nBIRIBINHA';
            resp = string;
            fs.appendFile('impressoras.txt', resp, function (err) {
                if (err) return console.log(err);
            });
        });
    }


    listaDevour(res) {
        // limpa o arquivo
        fs.writeFile('impressoras.txt', '', function (err) {
            if (err) return console.log(err);
        });
        //grava os 3 requests
        this.requestPrintWayy();
        this.requestPrintWayy(100);
        this.requestPrintWayy(200);
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Impressoras WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const impressora = resultados[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(impressora)
            }
        })
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE Impressoras SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ ...valores, id })
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Impressoras WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({ id })
            }
        })
    }
}

module.exports = new Impressora