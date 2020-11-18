"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoDB_1 = require("../common/MongoDB");
var config_1 = require("../config");
var gameModel_1 = require("./gameModel");
// Yup, it's time
var GameController = /** @class */ (function () {
    function GameController() {
    }
    // getGame
    // sends the specific game as JSON with id=:id
    GameController.prototype.getGame = function (req, res) {
        var id = MongoDB_1.Database.stringToId(req.params.id);
        GameController.db.getOneRecord(GameController.gamesTable, { _id: id })
            .then(function (results) { return res.send({ fn: "getGame", status: "success", data: results }).end(); })
            .catch(function (reason) { return res.status(500).send(reason).end(); });
    };
    // addGame
    // adds the game to the database
    GameController.prototype.addGame = function (req, res) {
        var proj = new gameModel_1.GameModel();
        console.log(req);
        proj.name = req.body.name || "Untitled";
        proj.creator = req.body.authUser._id;
        proj.owner = req.body.authUser._id;
        GameController.db.addRecord(GameController.gamesTable, proj.toObject())
            .then(function (result) { return res.send({ fn: "addGame", status: "success" }).end(); })
            .catch(function (reason) { return res.status(500).send(reason).end(); });
    };
    // updateGame
    // updates the game in the database with id :id
    GameController.prototype.updateGame = function (req, res) {
        var id = MongoDB_1.Database.stringToId(req.params.id);
        var data = req.body;
        var owner = data.authUser._id;
        var changing = {};
        if (data.name)
            changing.name = data.name;
        GameController.db.updateRecord(GameController.gamesTable, { _id: id, owner: owner }, { $set: changing })
            .then(function (results) { return results ? (res.send({ fn: "updateGame", status: "success" })) : (res.send({ fn: "updateGame", status: "failure", data: "Not found or not owned" })).end(); })
            .catch(function (err) { return res.send({ fn: "updateGame", status: "failure", data: err }).end(); });
    };
    // deleteGame
    // deletes the game in the database with id :id
    GameController.prototype.deleteGame = function (req, res) {
        var id = MongoDB_1.Database.stringToId(req.params.id);
        GameController.db.deleteRecord(GameController.gamesTable, { _id: id })
            .then(function (results) { return results ? (res.send({ fn: "deleteGame", status: "success" })) : (res.send({ fn: "deleteGame", status: "failure", data: "Not found" })).end(); })
            .catch(function (reason) { return res.status(500).send(reason).end(); });
    };
    GameController.db = new MongoDB_1.Database(config_1.Config.url, "games");
    GameController.gamesTable = "games";
    return GameController;
}());
exports.GameController = GameController;
//# sourceMappingURL=gameController.js.map