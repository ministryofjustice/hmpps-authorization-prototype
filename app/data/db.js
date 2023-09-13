let mockData = require("../assets/mock-data");
let model = require('../model/client')

let clients = mockData.mock_client_data.map(item => new model.Client(item))

module.exports = {
    clients: clients
}
