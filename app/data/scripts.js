const fs = require('fs/promises');
let { getBaseClients } = require("./db")

const addServiceObjectToJson = () => {
    const clients = getBaseClients()
    const clientsWithServiceObject = clients.map((item) => {
        item.serviceDetails = {
            serviceName: "",
            serviceDescription: "",
            serviceAuthorisedRoles: [],
            serviceURL: "",
            contactUsURL: "",
            enabled: false
        }
        return item
    })

    saveAs(clientsWithServiceObject, '../assets/data/service.json')
}
const saveAs = (obj, fileName) => {
    fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(obj, null, 2)).then(r => console.log('client data saved'))
}

module.exports = {
    addServiceObjectToJson
}
