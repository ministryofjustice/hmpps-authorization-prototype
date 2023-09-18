
let indexTableHead = () => {
    return [
        {
            text: "Client",
            classes: "app-custom-class"
        },
        {
            text: "Service",
            classes: "app-custom-class"
        },
        {
            text: "Team name",
            classes: "app-custom-class"
        },
        {
            text: "Grant types",
            classes: "app-custom-class"
        },
        {
            text: "Roles",
            classes: "app-custom-class"
        },
        {
            text: "Secret updated",
            classes: "app-custom-class"
        },
        {
            text: "Last accessed",
            classes: "app-custom-class"
        },
        {
            text: "Expired",
            classes: "app-custom-class"
        },
    ]
}
let indexTableRows = (data) => {
    return data.map(item => [
            {
                html: `<a href="/clients/${item.base_client_id}" class="govuk-link">${item.base_client_id}</a>`
            },
            {
                text: item.deployment_details.client_type
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

let baseClientPresenter = (baseClient) => {
    return {
        authorities: baseClient.authorities.join("</br>"),
        allowed_ips: baseClient.config.allowed_ips.join("\n"),
        web_server_redirect_uri: baseClient.web_server_redirect_uri.join("\n"),
        has_client_credentials: baseClient.authorized_grant_types.includes("client_credentials"),
        has_authorization_code: baseClient.authorized_grant_types.includes("authorization_code"),
        all_clients_table: baseClient.clients.map(item => [
            {
                text: item.client_id
            },{
                text: item.created
            },{
                text: item.secret_updated
            },{
                text: item.last_accessed
            }
        ]),
        expiry: baseClient.config.client_end_date ? `Yes - days remaining ${this.config.days_to_expire}`: "No" ,
        skipToAzureField: baseClient.additional_information.skipToAzureField ? "Auto redirect": ""
    }
}

module.exports = {
    indexPresenter,
    baseClientPresenter,
}

