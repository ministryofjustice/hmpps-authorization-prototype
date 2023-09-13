const db = require("../data/db");
const {clientPresenter} = require("../views/helpers/presenters");

const render = (request, response) =>  {
    const client = db.clients.filter((item) => item.client_id === request.params.client_id)[0]

    response.render('client', { client: client , presenter: clientPresenter(client)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditDeployment = (request, response) =>  {
    const client = db.clients.filter((item) => item.client_id === request.params.client_id)[0]

    response.render('edit-deployment-details', { client: client , presenter: clientPresenter(client)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderAddClient = (request, response) =>  {
    response.render('add-client', {}, function (err, html) {
        // ...
        response.send(html)
    })
}

module.exports = {
    render:render,
    renderEditDeployment:renderEditDeployment,
    renderAddClient: renderAddClient
}