
let indexTableHead = () => {
    return [
        {
            text: "Client",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "ascending"
            }
        },
        {
            text: "Count",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Service",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Team name",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Grant types",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Roles",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Secret updated",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Last accessed",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
        {
            text: "Expired",
            classes: "app-custom-class",
            attributes: {
                "aria-sort": "none"
            }
        },
    ]
}
let indexTableRows = (data) => {
    return data.map(item => [
            {
                html: `<a href="/clients/${item.base_client_id}" class="govuk-link">${item.base_client_id}</a>`
            },
            {
                html: item.clients.length > 1 ? `<span class="moj-badge">${item.clients.length}</span>` : ""
            },
            {
                text: item.deployment_details.client_type ? capitalCase(item.deployment_details.client_type): ""
            },
            {
                text: item.deployment_details.team
            },
            {
                html: item.authorized_grant_types.join('</br>')
            },
            {
                html: item.authorities.join('</br>')
            },
            {
                text: "2023/09/01 12:00:00"
            },
            {
                text: "2023/09/01 12:00:00"
            },
            {
                text: item.config.do_expire && item.config.days_to_expire === 0 ? "Expired" : ""
            }
        ])
}

let indexPresenter = (data) => {
    return {
        tableHeader: indexTableHead(),
        tableRows: indexTableRows(data)
    }
}

let capitalCase = (str) => {
    if(str == null || str.length <= 1) { return str }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
let baseClientPresenter = (baseClient) => {

    return {
        authorities: baseClient.authorities.join("</br>"),
        authoritiesAsText: baseClient.authorities.join("\n"),
        allowed_ips: baseClient.config.allowed_ips.join("\n"),
        web_server_redirect_uri: baseClient.web_server_redirect_uri.join("\n"),
        has_client_credentials: baseClient.authorized_grant_types.includes("client_credentials"),
        has_authorization_code: baseClient.authorized_grant_types.includes("authorization_code"),
        all_clients_table: baseClient.clients.map(item => [
            {
                text: item.client_id
            },{
                html: item.created.split(' ').join('</br>')
            },{
                html: item.last_accessed.split(' ').join('</br>')
            },{
                html: `<a class="govuk-link" href="/clients/${baseClient.base_client_id}/instances/${item.client_id}/delete">delete</a>`
            }
        ]),
        expiry: baseClient.config.client_end_date ? `Yes - days remaining ${baseClient.config.days_to_expire}`: "No" ,
        skipToAzureField: baseClient.additional_information.skipToAzureField === 'true' ? "Auto redirect": "",
        skipToAzureFieldBool: baseClient.additional_information.skipToAzureField === 'true',
        hosting: capitalCase(baseClient.deployment_details.hosting),
        clientType: baseClient.deployment_details.client_type ? capitalCase(baseClient.deployment_details.client_type) : "",
        serviceEnabledCode: baseClient.serviceDetails.enabled ? "enabled" : "disabled",
        serviceEnabledLabel:baseClient.serviceDetails.serviceName.length === 0 ? '' : baseClient.serviceDetails.enabled ? "Enabled" : "Disabled",
        serviceAuthorisedRoles: baseClient.serviceDetails.serviceAuthorisedRoles.join('\n')
    }
}

let addClientPresenter = (grantCode) => {
    const codeMap = {
        "client-credentials": "Client credentials",
        "authorization-code": "Authorization code"
    }
    return {
        grant: codeMap[grantCode],
        isClientCredentials: grantCode === "client-credentials",
        isAuthorizationCode: grantCode === "authorization-code",
        grantCode: grantCode.replace('-', '_')
    }
}

let deleteClientPresenter = (baseClient, client) => {
    return {
        baseClientId: baseClient.base_client_id,
        clientId: client.client_id,
        showWarning: baseClient.clients.length === 1,
        warningText: `Warning: ${client.client_id} is the only instance of ${baseClient.base_client_id}. Deleting it will delete the base client`,
        baseClientURL: `/clients/${baseClient.base_client_id}`
    }
}

let secretsPresenter = (baseClient, client, isNewBaseClient) => {
    return {
        banner: isNewBaseClient ? "Client has been created" : "Client has been duplicated",
        baseClientURL: `/clients/${baseClient.base_client_id}`,
        secretsTable: [
            [{ text: "new clientId"}, {text: client.client_id}],
            [{ text: "new clientSecret" }, { text: "%0O98l3yRS83tBpXQYV-jj<14R&Cdwi*ecqseUu1mzUkyoZdlPuwHiIc+F$E"}],
            [{ text: "base64 clientId" }, { text: "YW5vdGhlci1kZWxldGUtdGVzdC1jbGllbnQtMg=="}],
            [{ text: "base64 clientSecret"}, { text: "JTBPOThsM3lSUzgzdEJwWFFZVi1qajwxNFImQ2R3aSplY3FzZVV1MW16VWt5b1pkbFB1d0hpSWMrRiRF"}],
        ]
    }
}

module.exports = {
    indexPresenter,
    baseClientPresenter,
    addClientPresenter,
    deleteClientPresenter,
    secretsPresenter
}

