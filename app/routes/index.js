const presenters = require("../views/helpers/presenters");
const { getBaseClients } = require("../data/db");

const render = (request, response) =>  {
    response.render('index', { presenter: presenters.indexPresenter(getBaseClients()) }, function (err, html) {
        // ...
        response.send(html)
    })
}

module.exports = {
    render
}