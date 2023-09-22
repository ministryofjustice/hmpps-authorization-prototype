const db = require("../data/db");
const {baseClientPresenter, addClientPresenter, deleteClientPresenter, secretsPresenter} = require("../views/helpers/presenters");
const {BaseClient, Client} = require("../model/client")

const render = (request, response) =>  {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    if(baseClient) {
        response.render('view-base-client', {
            baseClient: baseClient,
            presenter: baseClientPresenter(baseClient)
        }, function (err, html) {
            // ...
            response.send(html)
        })
    } else {
        response.redirect("/")
    }
}

const renderEditDeployment = (request, response) =>  {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-deployment-details', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditClientDetails = (request, response) =>  {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-client-details', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderEditServiceDetails = (request, response) =>  {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]

    response.render('edit-service-details', { baseClient: baseClient , presenter: baseClientPresenter(baseClient)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderSecrets = (request, response) => {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.base_client_id)[0]
    const client = baseClient.clients.filter((item) => item.client_id === request.params.client_id)[0]
    const isNewBaseClient = request.query.new === 'true'

    response.render('secrets', { presenter: secretsPresenter(baseClient, client, isNewBaseClient )}, function (err, html) {
        // ...
        response.send(html)
    })
}

const updateClientDetails = (request, response) => {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]
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
    baseClient.deployment_details.client_type = data.clientType;
    baseClient.access_token_validity = data.accessTokenValidity;
    baseClient.scope = data.approvedScopes;
    baseClient.setExpiry(data.expiry.includes("expire"), parseInt(data.expiryDays));
    baseClient.config.allowed_ips = data.allowedIPS.split('\r\n');
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
const updateServiceDetails = (baseClient, data) => {
    baseClient.serviceDetails.serviceName = data['serviceName']
    baseClient.serviceDetails.serviceDescription = data['serviceDescription']
    baseClient.serviceDetails.serviceAuthorisedRoles = data['serviceAuthorisedRoles'].split('\r\n')
    baseClient.serviceDetails.serviceURL = data['serviceURL']
    baseClient.serviceDetails.contactUsURL = data['contactUsURL']
    baseClient.serviceDetails.contactUsURL = data['serviceStatus'] === 'enabled'
    console.log("updating service details")
}

const updateDeploymentDetails = (request, response) => {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]
    const data = request.body

    baseClient.deployment_details.team = data.team
    baseClient.deployment_details.team_contact = data.teamContact
    baseClient.deployment_details.team_slack = data.teamSlack
    baseClient.additional_information.jiraNo = data.jiraNo

    baseClient.deployment_details.hosting = data.hosting
    baseClient.deployment_details.namespace = data.namespace
    baseClient.deployment_details.deployment = data.deployment
    baseClient.deployment_details.secret_name = data.secretName
    baseClient.deployment_details.client_id_key = data.clientIdKey
    baseClient.deployment_details.secret_key = data.secretKey
    baseClient.deployment_details.deployment_info = data.deploymentInfo

    response.redirect(`/clients/${baseClient.base_client_id}`)
}

const renderAddClient = (request, response) =>  {
    response.render('add-client', {}, function (err, html) {
        // ...
        response.send(html)
    })
}

const renderAddClientWithGrant = (request, response) =>  {
    const grantCode = request.query.grant
    response.render('add-client-with-grant', {presenter: addClientPresenter(grantCode)}, function (err, html) {
        // ...
        response.send(html)
    })
}

const postClient = (request, response) =>  {
    const data = request.body

    const baseClient = new BaseClient()
    baseClient.base_client_id = data.baseClientID
    baseClient.deployment_details.client_type = data.clientType;
    baseClient.access_token_validity = data.accessTokenValidity === "custom" ? data.customAccessTokenValidity : data.accessTokenValidity
    baseClient.scope = data.approvedScopes
    baseClient.authorized_grant_types = [data.grantCode]
    baseClient.authorities = data.authorities.split('\r\n')

    if(data.expiry.includes('expire')) {
        baseClient.setExpiry(true, data.expiryDays)
    }

    baseClient.config.allowed_ips = data.allowedIPS.split('\r\n')

    const newClient = Client.prototype.build(baseClient.base_client_id)
    baseClient.addClient(newClient)

    db.addBaseClient(baseClient)

    response.redirect(`/clients/${baseClient.base_client_id}/instances/${newClient.client_id}/secrets?new=true`)
}

const duplicateClientInstance = (request, response) => {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.base_client_id)[0]

    const newClient = db.duplicateClientInstance(baseClient)

    response.redirect(`/clients/${baseClient.base_client_id}/instances/${newClient.client_id}/secrets`)
}

const renderDeleteClient = (request, response) =>  {
    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.base_client_id)[0]
    const client = baseClient.clients.filter((item) => item.client_id === request.params.client_id)[0]

    response.render('delete-client-instance', { presenter: deleteClientPresenter(baseClient, client)}, function (err, html) {
        // ...
        response.send(html)
    })
}
const deleteClient = (request, response) => {

    const baseClient = db.getBaseClients().filter((item) => item.base_client_id === request.params.base_client_id)[0]
    if(baseClient.clients.length > 1) {
        baseClient.clients = baseClient.clients.filter(item => item.client_id !== request.params.client_id)
        db.setBaseClient(baseClient)
        response.redirect(`/clients/${baseClient.base_client_id}`)
    } else {
        const newBaseClients = db.getBaseClients().filter((item) => item.base_client_id !== request.params.base_client_id)
        db.setBaseClients(newBaseClients)
        response.redirect('/')
    }

}

module.exports = {
    render,
    renderEditDeployment,
    renderEditClientDetails,
    renderEditServiceDetails,
    renderAddClient,
    renderDeleteClient,
    renderSecrets,
    updateClientDetails,
    updateDeploymentDetails,
    renderAddClientWithGrant,
    updateServiceDetails,
    duplicateClientInstance,
    postClient,
    deleteClient
}