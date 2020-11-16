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
    requestPrintWayy(skip, impressorasAtualizadas, res) {
            let string = '';
            let skipString = '';
            let requestReturn;
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
                        if(impressoras[row].lastCommunication) {
                            impressoras[row].lastCommunication = moment(impressoras[row].lastCommunication, 'YYYY-MM-DDTHH:mm:ss.sssZ')
                            .format('YYYY-MM-DD');
                        }
                        if(impressoras[row].status =='online' && impressoras[row].scan_status!='everythingOk' && impressoras[row].scan_status != null) {
                            impressoras[row].scan_status = '';
                            console.log(impressoras[row].serialNumber+ ' status limpo');
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
                         //   scan_status: codename.scan_status.everythingOk
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