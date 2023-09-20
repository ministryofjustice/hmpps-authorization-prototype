const {getBaseClients, addBaseClient} = require("../data/db");
const {baseClientPresenter, addClientPresenter} = require("../views/helpers/presenters");
const {setExpiry, BaseClient, Client} = require("../model/client")

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
    baseClient.setExpiry(data.expiry.includes("expire"), parseInt(data.expiryDays))
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

const updateDeploymentDetails = (request, response) => {
    const baseClient = getBaseClients().filter((item) => item.base_client_id === request.params.client_id)[0]
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
    baseClient.access_token_validity = data.accessTokenValidity === "custom" ? data.customAccessTokenValidity : data.accessTokenValidity
    baseClient.scope = data.approvedScopes
    baseClient.authorized_grant_types = [data.grantCode]
    baseClient.authorities = data.authorities.split('\r\n')

    if(data.expiry.includes('expire')) {
        baseClient.setExpiry(true, data.expiryDays)
    }

    baseClient.config.allowed_ips = data.allowedIPS.split('\r\n')

    const client = new Client({
        client_id: baseClient.base_client_id,
        created: new Date().toISOString(),
        secret_updated: new Date().toISOString(),
        last_accessed: new Date().toISOString()
    })

    baseClient.addClient(client)

    addBaseClient(baseClient)

    response.redirect(`/clients/${baseClient.base_client_id}`)
}

module.exports = {
    render,
    renderEditDeployment,
    renderEditClientDetails,
    renderAddClient,
    updateClientDetails,
    updateDeploymentDetails,
    renderAddClientWithGrant,
    postClient
}