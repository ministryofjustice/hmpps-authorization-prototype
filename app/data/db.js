const fs = require('fs/promises');
const {BaseClient, Client} = require("../model/client");

let baseClients = []

const getBaseClients = () => { return baseClients }
const setBaseClients = (data) => { baseClients = data }
const setBaseClient = (baseClient) => {
    baseClients = baseClients.map(client => client.base_client_id === baseClient.base_client_id ? baseClient : client)
}

const addBaseClient = (client) => {
    baseClients.push(client)
}

const duplicateClientInstance = (baseClient) => {
    const nextId= nextClientId(baseClient)
    baseClient.clients.push(Client.prototype.build(nextId))
}
const nextClientId = (baseClient) => {
    const lastId = baseClient.clients.slice(-1)[0].client_id
    const lastSuffix = lastId.split('-').slice(-1)[0]

    if(lastId === baseClient.base_client_id || !isInteger(lastSuffix)) {
        return `${lastId}-1`
    } else {
        const lastSuffixVal = parseInt(lastSuffix)
        return `${baseClient.base_client_id}-${lastSuffixVal + 1}`
    }
}

const loadBaseClients = () => {
    fs.readFile(`${__dirname}/../assets/data/base-clients.json`, 'utf-8')
        .then((data) => {
            // Do something with the data
            const baseClientData = JSON.parse(data)
            baseClients = baseClientData.map(obj => BaseClient.prototype.fromObject(obj))
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

const isInteger = (str) => {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
}

module.exports = {
    setBaseClient,
    getBaseClients,
    setBaseClients,
    duplicateClientInstance,
    loadBaseClients,
    saveBaseClients,
    resetBaseClients,
    addBaseClient
}
