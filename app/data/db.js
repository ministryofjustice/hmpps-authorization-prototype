let mockData = require("../assets/mock-data");
const {BaseClient, getBaseClientId} = require("../model/client");

class MockDbFactory {
    constructor(mockClientData) {
        this.data = mockClientData
    }

    buildClientData = () => {
        const baseClients = Object.fromEntries(this.data.map(item => {
            const baseClient = new BaseClient(item)
            baseClient.clients = [];
            return [baseClient.base_client_id, baseClient]
        }))

        this.data.forEach(item => {
            baseClients[getBaseClientId(item.client_id)].addClient(item)
        })

        let baseClientsList = Object.values(baseClients)
        baseClientsList.sort((a,b) => a.base_client_id < b.base_client_id ? -1 : 0)

        return baseClientsList
    }
}

let baseClients = new MockDbFactory(mockData.mock_client_data).buildClientData()

module.exports = {
    baseClients: baseClients
}
