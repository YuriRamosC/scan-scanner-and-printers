const moment = require('moment');
const request = require('request');
const axios = require('axios');
const Impressora = require('../models/impressoras');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const log = require('./log');
const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};
const contadores =
    [
    ['92f93d14-cd80-4cc5-832c-6919817e0f56','X2TF374991'],
    ['1953dbda-8cd7-44c2-a937-0f0c393b0790', 'X3B2001133'],
    ['52a10dda-9d67-41a2-b83e-68c16c59a702', 'X3B2001773'],
    ['a13ee0db-a964-48d6-888a-00fe59fc55c5', 'X3B2002269'],
    ['b22b8a02-4a89-4beb-a503-ec9cc69a99c4', 'X3B2002242'],
    ['bba45dc4-0582-429c-b9e1-d093d33f2e39', 'X3B2002311'],
    ['cd42173b-d8bd-44fe-a991-252893fcf4bf', 'X3B2001771']];

/*
  Essa classe consome a API, por isso esse nome de Devourer.
  Ela recebe os dados enviados em JSON e grava em uma Array,
  essa Array é tratada em sua respectiva classe Model, que
  faz o insert no banco de dados.
*/
class Devourer {
    buscarCounters(res, callback) {
        // Nesse método, estarei testando/utilizando a library axios, em vez da library 'request',
        // em breve todos os métodos que  utilizam o request, serão atualizados.
        var promises = [];
        for (var row = 0; row < contadores.length; row++) {
            promises.push(axios.get(urlBase + '/' + contadores[row][0] + '/counters', { headers: headers })
                .then(function (response) {
                    //id_way é o id do objeto, que ele tira do axios, pela url do request.
                    var id_way;
                    id_way = response.config.url.replace('https://api.printwayy.com/devices/v1/printers/', '');
                    id_way = id_way.replace('/counters', '');
                    return { id_way: id_way, total: response.data[0].totalCount + response.data[1].totalCount };
                })
                .catch(function(response){
                    return{ id_way: '0', total: 0};
                }));
        }

        Promise.all(promises).then((result) => {
            var resultWithSerialNumber = [];
            result.forEach(function (row, index) {
                for (var rowTwo = 0; rowTwo < contadores.length; rowTwo++) {
                    if(row.id_way == contadores[rowTwo][0]){
                        resultWithSerialNumber.push({...row, serialNumber: contadores[rowTwo][1]});
                    }
                }
            });
            return callback(resultWithSerialNumber);
        });
    }
   // 202093629706457
    requestPrintWayy(skip, impressorasAtualizadas, res) {
        let skipString = '';
        let promises = [];
        if (skip > 0) {
            skipString = '?skip=' + skip;
        }
        let urlFinal = urlBase + skipString;
        request({ url: urlFinal, headers: headers }, (err, req, resp) => {
            if (err) {
                console.log(err);
            } else {
                let biribinha = JSON.parse(resp);
                var impressoras = biribinha.data;
                //percorrendo o JSON recebido
                for (var row in impressoras) {
                    //SQL //
                    let customerName = '';
                    let ipFinal = '';
                    if (impressoras[row].customer != null) {
                        customerName = impressoras[row].customer.name;
                    }
                    if (impressoras[row].ipAdress != 'NULL') {
                        ipFinal = impressoras[row].ipAddress;
                    }
                    if (impressoras[row].lastCommunication) {
                        impressoras[row].lastCommunication = moment(impressoras[row].lastCommunication, 'YYYY-MM-DDTHH:mm:ss.sssZ')
                            .format('YYYY-MM-DD');
                    }
                    impressorasAtualizadas.push({
                        id_way: impressoras[row].id,
                        tipo_conexao: impressoras[row].type,
                        status: impressoras[row].status,
                        serialNumber: impressoras[row].serialNumber,
                        lastCommunication: impressoras[row].lastCommunication,
                        installationPoint: impressoras[row].installationPoint,
                        observation: impressoras[row].observation,
                        ipAddress: ipFinal,
                        manufacturer: impressoras[row].manufacturer,
                        model: impressoras[row].model,
                        customer_name: customerName
                    });
                }
            }
            if (skip == 0) {
                this.requestPrintWayy(100, impressorasAtualizadas, res);
            } else if (skip == 100) {
                this.requestPrintWayy(200, impressorasAtualizadas, res);
            } else if (skip == 200) {
                Impressora.newGravarImpressorasBD(impressorasAtualizadas, res);
            }
        });
    }

    tratarDados(impressorasAtualizadas, res) {
        return new Promise((resolve, reject) => {
            log.gravarComData('Atualização iniciada ...');
            this.requestPrintWayy(0, impressorasAtualizadas, res);
            resolve();
        });

    };
}
module.exports = new Devourer;