class Client {
    constructor(clientData) {
        this.deployment_details = {}
        this.config = {}

        this.client_id = clientData.client_id || "";
        this.created = clientData.created || "";
        this.secret_updated = clientData.secret_updated || "";
        this.last_accessed = clientData.last_accessed || "";


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
        this.config.do_expire = this.config.days_to_expire > 0
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

    setExpiryDays = (daysToExpire) => {
        return 0
    }
}

module.exports = {
    Client: Client
}