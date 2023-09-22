//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const index = require("./routes/index");
const client = require("./routes/client");
const router = govukPrototypeKit.requests.setupRouter()
const { loadBaseClients } = require("./data/db")
const { addServiceObjectToJson }  = require("./data/scripts")

loadBaseClients()

// Add your routes here
router.get('/', function(request, response) {
    index.render(request,response)
})

router.get('/clients/add', function(request, response) {
    client.renderAddClient(request, response)
})
router.get('/clients/add-with-grant', function(request, response) {
    client.renderAddClientWithGrant(request, response)
})
router.get('/clients/:client_id', function(request, response) {
    client.render(request, response)
})

router.post('/clients/:base_client_id/instances', function(request, response) {
    client.duplicateClientInstance(request, response)
})

router.get('/clients/:client_id/edit-deployment-details', function(request, response) {
    client.renderEditDeployment(request, response)
})
router.get('/clients/:client_id/edit-client-details', function(request, response) {
    client.renderEditClientDetails(request, response)
})
router.get('/clients/:client_id/edit-service-details', function(request, response) {
    client.renderEditServiceDetails(request, response)
})

router.get('/clients/:base_client_id/instances/:client_id/secrets', function(request, response) {
    client.renderSecrets(request, response)
})

router.post('/clients/:client_id/edit-client-details', function(request, response) {
    client.updateClientDetails(request, response)
})
router.post('/clients/:client_id/edit-service-details', function(request, response) {
    client.updateServiceDetails(request, response)
})

router.post('/clients/:client_id/edit-deployment-details', function(request, response) {
    client.updateDeploymentDetails(request, response)
})

router.post('/clients/add-with-grant', function(request, response) {
    client.postClient(request, response)
})

router.get('/clients/:base_client_id/instances/:client_id/delete', function(request, response) {
    client.renderDeleteClient(request, response)
})

router.post('/clients/:base_client_id/instances/:client_id/delete', function(request, response) {
    client.deleteClient(request, response)
})


router.get('/scripts/updateJSON', function(request, response) {
    addServiceObjectToJson()
    response.body = "Success"
})
