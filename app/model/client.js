class BaseClient {
    constructor(clientData) {
        this.deployment_details = {}
        this.config = {}

        this.base_client_id = getBaseClientId(clientData.client_id)
        this.clients = [
            new Client(clientData)
        ]

        this.deployment_details.client_type = clientData.client_type || null;
        this.deployment_details.team = clientData.team || null;
        this.deployment_details.team_contact = clientData.team_contact || null;
        this.deployment_details.team_slack = clientData.team_slack || null;
        this.deployment_details.hosting = clientData.hosting || null;
        this.deployment_details.namespace = clientData.namespace || null;
        this.deployment_details.deployment = clientData.deployment || null;
        this.deployment_details.secret_name = clientData.secret_name || null;
        this.deployment_details.client_id_key = clientData.client_id_key || null;
        this.deployment_details.secret_key = clientData.secret_key || null;
        this.deployment_details.deployment_info = clientData.deployment_info || null;


        this.web_server_redirect_uri = clientData.web_server_redirect_uri ?  clientData.web_server_redirect_uri.split(",") : [];
        this.access_token_validity = clientData.access_token_validity || 0;
        this.refresh_token_validity = clientData.refresh_token_validity || null;
        this.resource_ids = clientData.resource_ids || [];
        this.scope = clientData.scope || "";


        this.authorities = clientData.authorities ? clientData.authorities.split(",") : [];
        this.authorized_grant_types = clientData.authorized_grant_types ? clientData.authorized_grant_types.split(",") : [];
        this.config.allowed_ips = clientData.allowed_ips ? clientData.allowed_ips.split(",") : [];

        const additionalObj = clientData.additional_information ? JSON.parse(clientData.additional_information) : {};
        this.additional_information = {}
        this.additional_information.jwtFields = additionalObj.jwtFields || "";
        this.additional_information.jiraNo = additionalObj.jiraNo || "";
        this.additional_information.skipToAzureField = additionalObj.skipToAzureField || 'false';
        this.additional_information.databaseUsernameField = additionalObj.databaseUsernameField || '';


        this.autoapprove = clientData.autoapprove || "";
        this.client_secret = clientData.client_secret || "";


        this.config.client_end_date = clientData.client_end_date || null;
        this.config.days_to_expire = this.getExpiryDays(this.config.client_end_date)
        this.config.do_expire = this.config.days_to_expire !== null

        this.secret_updated = this.clients[0].secret_updated
        this.last_accessed = this.clients[0].last_accessed
    }

    getExpiryDays = (end_date_str) => {
        if(!end_date_str) {
            return 0
        }

        //Number of days client is currently valid for

        let end_date = new Date(Date.parse(end_date_str))

        let days = Math.ceil((end_date.getTime() - (new Date().getTime()))/(1000 * 3600 * 24))
        console.log("days remaining:", days)
        return days
    }
}

const getExpiryDays = (end_date_str) => {
    if(!end_date_str) {
        return 0
    }

    //Number of days client is currently valid for

    let end_date = new Date(Date.parse(end_date_str))

    let days = Math.ceil((end_date.getTime() - (new Date().getTime()))/(1000 * 3600 * 24))
    console.log("days remaining:", days)
    return days
}

const setExpiry = (baseClient, doExpire, daysToExpire) => {
    if(doExpire !== baseClient.config.do_expire || daysToExpire !== baseClient.config.days_to_expire) {
        if(doExpire) {
            let now = new Date().getTime();
            let expireIn = daysToExpire ? daysToExpire * 1000 * 60 * 60 * 24 : 0
            let expiryDate = new Date();
            expiryDate.setTime(now + expireIn)

            baseClient.config.client_end_date = expiryDate.toISOString().split('T')[0]
        } else {
            baseClient.config.client_end_date = null;
        }
    }

    baseClient.config.days_to_expire = getExpiryDays(baseClient.config.client_end_date)
    baseClient.config.do_expire = doExpire
}

const addClient = (baseClient, clientData) => {
    baseClient.clients.push(new Client(clientData))
    const secretDates = baseClient.clients.map(item => item.secret_updated)
    const lastAccessedDates = baseClient.clients.map(item => item.last_accessed)
    secretDates.sort()
    lastAccessedDates.sort()

    baseClient.secret_updated = secretDates.pop().split(".")[0]
    baseClient.last_accessed = lastAccessedDates.pop().split(".")[0]
}

class Client {
    constructor(clientData) {
        this.client_id = clientData.client_id || "";
        this.created = clientData.created.split(".")[0] || "";
        this.secret_updated = clientData.secret_updated.split(".")[0] || "";
        this.last_accessed = clientData.last_accessed.split(".")[0] || "";
    }
}

getBaseClientId = (client_id) => {
    let sections = client_id.split("-")
    if(sections.length > 1 && isInteger(sections[sections.length -1])) {
        sections.pop()
    }
    return sections.join("-")
}

isInteger = (str) => {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseInt(str)) // ...and ensure strings of whitespace fail
}

module.exports = {
    Client: Client,
    BaseClient: BaseClient,
    getBaseClientId: getBaseClientId,
    setExpiry: setExpiry
}