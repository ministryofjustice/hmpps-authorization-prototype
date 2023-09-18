const {getBaseClients} = require("../data/db");
const {baseClientPresenter} = require("../views/helpers/presenters");

const render = (request, response) =>  {
    const baseClient = getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-base-client', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditDeployment = (request, response) =>  {
    const baseClient = getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-deployment-details', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditClientDetails = (request, response) =>  {
    const baseClient = getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-client-details', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
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
    render,
    renderEditDeployment,
    renderEditClientDetails,
    renderAddClient
}