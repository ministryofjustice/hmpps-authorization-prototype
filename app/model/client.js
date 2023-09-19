class BaseClient {
    constructor() {
        this.deployment_details = {}
        this.deployment_details.client_type = null;
        this.deployment_details.team = null;
        this.deployment_details.team_contact = null;
        this.deployment_details.team_slack = null;
        this.deployment_details.hosting = null;
        this.deployment_details.namespace = null;
        this.deployment_details.deployment = null;
        this.deployment_details.secret_name = null;
        this.deployment_details.client_id_key = null;
        this.deployment_details.secret_key = null;
        this.deployment_details.deployment_info = null;

        this.base_client_id = ""
        this.clients = []

        this.web_server_redirect_uri = [];
        this.access_token_validity = 0;
        this.refresh_token_validity = null;
        this.resource_ids = [];
        this.scope = "";

        this.authorities = [];
        this.authorized_grant_types = [];

        this.additional_information = {}
        this.additional_information.jwtFields = "";
        this.additional_information.jiraNo = "";
        this.additional_information.skipToAzureField = 'false';
        this.additional_information.databaseUsernameField = '';

        this.autoapprove = "";
        this.client_secret = "";

        this.config = {}
        this.config.allowed_ips = [];
        this.config.client_end_date = null;
        this.config.days_to_expire = 0
        this.config.do_expire = false

        this.secret_updated = null
        this.last_accessed = null

        this.calculateDates = this.calculateDates.bind(this)
    }

    addClient = (clientData) => {
        this.clients.push(new Client(clientData))
        this.calculateDates()
    }

    calculateDates = () => {
        const secretDates = this.clients.map(item => item.secret_updated)
        const lastAccessedDates = this.clients.map(item => item.last_accessed)
        secretDates.sort()
        lastAccessedDates.sort()

        this.secret_updated = secretDates.pop().split(".")[0]
        this.last_accessed = lastAccessedDates.pop().split(".")[0]
    }
}

BaseClient.prototype.fromObject = (obj) => {
    const bc = new BaseClient()

    bc.base_client_id = getBaseClientId(obj.base_client_id)
    bc.clients = obj.clients.map(item => new Client(item))

    bc.deployment_details = obj.deployment_details

    bc.web_server_redirect_uri = obj.web_server_redirect_uri
    bc.access_token_validity = obj.access_token_validity
    bc.refresh_token_validity = obj.refresh_token_validity
    bc.resource_ids = obj.resource_ids
    bc.scope = obj.scope

    bc.authorities = obj.authorities
    bc.authorized_grant_types = obj.authorized_grant_types
    bc.config.allowed_ips = obj.allowed_ips

    bc.additional_information = obj.additional_information

    bc.autoapprove = obj.autoapprove
    bc.client_secret = obj.client_secret

    bc.config = obj.config

    bc.calculateDates()

    return bc
}

const getExpiryDays = (end_date_str) => {
    if(!end_date_str) {
        return 0
    }
    let end_date = new Date(Date.parse(end_date_str))

    return Math.ceil((end_date.getTime() - (new Date().getTime()))/(1000 * 3600 * 24))
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