const presenters = require("../views/helpers/presenters");
const db = require("../data/db");

const render = (request, response) =>  {

    response.render('index', { presenter: presenters.indexPresenter(db.clients) }, function (err, html) {
        // ...
        response.send(html)
    })
}

module.exports = {
    render:render
}