const fs = require('fs');
const moment = require('moment');
const request = require('request');
const Impressora = require('../models/impressoras');
const hostname = 'https://api.printwayy.com';
const printers_path = '/devices/v1/printers';
const urlBase = `${hostname}${printers_path}`;
const codename = require('./codename');

const headers = {
    'printwayy-key': '5542C0E2-6C0F-43F1-B576-5056CED690B1'
};
/*
    Essa classe consome a API, por isso esse nome de Devourer.
    Ela recebe os dados enviados em JSON e grava em uma Array,
    essa Array é tratada em sua respectiva classe Model, que
    faz o insert no banco de dados.
*/
class Devourer {
    buscarCounters(res, contadoresResult) {
        var contadores = ['17a99399-3158-4516-ae02-65835302ea6c', '1953dbda-8cd7-44c2-a937-0f0c393b0790',
            '52a10dda-9d67-41a2-b83e-68c16c59a702', '603cd395-52f5-4819-a412-8248390d079f', 'a13ee0db-a964-48d6-888a-00fe59fc55c5',
            'b22b8a02-4a89-4beb-a503-ec9cc69a99c4', 'bba45dc4-0582-429c-b9e1-d093d33f2e39', 'cc654080-0664-4bcd-8211-94d1d325c774',
            'cd42173b-d8bd-44fe-a991-252893fcf4bf'];
        var contadoresResult = [];
        for (var row in contadores) {
            request({ url: urlBase + contadores[row] + '/counters', headers: headers }, (err, req, resp) => {
                contadoresResult.push({
                    totalPB: resp[0].totalCount, totalCor: resp[1].totalCount, total:resp[0].totalCount+resp[1].totalCount
                })
            });
        }
        console.dir(contadoresResult);
        return contadoresResult;
    }

    requestPrintWayy(skip, impressorasAtualizadas, res) {
        let skipString = '';
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
                Impressora.gravarImpressorasBD(impressorasAtualizadas, res);
            }
        });
    }

    tratarDados(impressorasAtualizadas, res) {
        return new Promise((resolve, reject) => {
            console.log('Atualização iniciada...');
            this.requestPrintWayy(0, impressorasAtualizadas, res);
            resolve();
        });

    };
}
module.exports = new Devourer;