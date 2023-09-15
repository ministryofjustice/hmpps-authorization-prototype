const db = require("../data/db");
const {baseClientPresenter} = require("../views/helpers/presenters");

const render = (request, response) =>  {
    const baseClient = db.baseClients.filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-base-client', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditDeployment = (request, response) =>  {
    const client = db.baseClients.filter((item) => item.client_id === request.params.client_id)[0]

    response.render('edit-deployment-details', { client: client , presenter: baseClientPresenter(client)}, function (err, html) {
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