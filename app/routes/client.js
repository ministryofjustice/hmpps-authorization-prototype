const {getBaseClients} = require("../data/db");
const {baseClientPresenter} = require("../views/helpers/presenters");
const {setExpiry} = require("../model/client")

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

const updateClientDetails = (request, response) => {
    const baseClient = getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]
    const data = request.body

    updateCommonDetails(baseClient, data)
    if(baseClient.authorized_grant_types.includes("client_credentials")) {
        updateClientCredentialsDetails(baseClient, data)
    }
    if(baseClient.authorized_grant_types.includes("authorization_code")) {
        updateAuthorizationCodeDetails(baseClient, data)
    }

    response.redirect(`/clients/${baseClient.base_client_id}`)
}

const updateCommonDetails = (baseClient, data) => {
    baseClient.access_token_validity = data.accessTokenValidity;
    baseClient.scope = data.approvedScopes
    setExpiry(baseClient, data.expiry.includes("expire"), parseInt(data.expiryDays))
    baseClient.config.allowed_ips = data.allowedIPS.split('\r\n')
}
const updateClientCredentialsDetails = (baseClient, data) => {
    baseClient.authorities = data.authorities.split('\r\n')
}

const updateAuthorizationCodeDetails = (baseClient, data) => {
    baseClient.web_server_redirect_uri = data['redirect uris'].split('\r\n')
    baseClient.additional_information.jwtFields = data.jwtFields
    baseClient.additional_information.skipToAzureField = data.azure.includes("redirect").toString()
    console.log("updating authorization details")
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
    renderAddClient,
    updateClientDetails
}