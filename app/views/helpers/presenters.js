
let indexTableHead = () => {
    return [
        {
            text: "Client",
            classes: "app-custom-class"
        },
        {
            text: "Team",
            classes: "app-custom-class"
        },
        {
            text: "Roles",
            classes: "app-custom-class"
        },
        {
            text: "Has client credentials",
            classes: "app-custom-class"
        },
        {
            text: "Has auth code",
            classes: "app-custom-class"
        }
    ]
}
let indexTableRows = (data) => {
    return data.map(item => {
        return [
            {
                html: `<a href="/clients/${item.client_id}" class="govuk-link">${item.client_id}</a>`
            },
            {
                text: item.deployment_details.team
            },
            {
                text: item.authorities.length > 0 ? item.authorities.length : ""
            },
            {
                text: item.authorized_grant_types.includes("client_credentials") ? "Yes" : ""
            },
            {
                text: item.authorized_grant_types.includes("authorization_code") ? "Yes" : ""
            }
        ]
    })
}

let indexPresenter = (data) => {
    return {
        tableHeader: indexTableHead(),
        tableRows: indexTableRows(data)
    }
}

let clientPresenter = (client) => {
    return {
        authorities: client.authorities.join("\n"),
        allowed_ips: client.config.allowed_ips.join("\n"),
        web_server_redirect_uri: client.web_server_redirect_uri.join("\n"),
        has_client_credentials: client.authorized_grant_types.includes("client_credentials"),
        has_authorization_code: client.authorized_grant_types.includes("authorization_code")
    }
}

module.exports = {
    indexPresenter,
    clientPresenter,
}

