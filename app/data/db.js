const fs = require('fs/promises');
const {BaseClient} = require("../model/client");

let baseClients = []

const getBaseClients = () => { return baseClients }
const setBaseClients = (data) => { baseClients = data }
const setBaseClient = (baseClient) => {
    baseClients = baseClients.map(client => client.base_client_id === baseClient.base_client_id ? baseClient : client)
}

const loadBaseClients = () => {
    fs.readFile(`${__dirname}/../assets/data/base-clients.json`, 'utf-8')
        .then((data) => {
            // Do something with the data
            const baseClientData = JSON.parse(data)
            baseClients = baseClientData.map(obj => Object.create(BaseClient.prototype, Object.getOwnPropertyDescriptors(obj)))
        })
        .catch((error) => {
            // Do something if error
            console.log(error)
            return []
        });
}

const saveBaseClients = () => {
    fs.writeFile(`${__dirname}/../assets/data/base-clients.json`, JSON.stringify(baseClients, null, 2)).then(r => console.log('client data saved'))
}

const resetBaseClients = () => {
    fs.rm(`${__dirname}/../assets/data/base-clients.json`)
        .then((data) => {
            fs.cp(`${__dirname}/../assets/data/original.json`, `${__dirname}/../assets/data/base-clients.json`).then((data) => {
                console.log('client data reset');
            })
    })
}

module.exports = {
    setBaseClient,
    getBaseClients,
    setBaseClients,
    loadBaseClients,
    saveBaseClients,
    resetBaseClients
}
