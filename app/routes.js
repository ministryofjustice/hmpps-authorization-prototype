//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const index = require("./routes/index");
const client = require("./routes/client");
const router = govukPrototypeKit.requests.setupRouter()


// Add your routes here
router.get('/', function(request, response) {
    index.render(request,response)
})

router.get('/clients/add', function(request, response) {
    client.renderAddClient(request, response)
})
router.get('/clients/:client_id', function(request, response) {
    client.render(request, response)
})

router.get('/clients/:client_id/edit-deployment-details', function(request, response) {
    client.renderEditDeployment(request, response)
})