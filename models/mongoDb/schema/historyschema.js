const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    user_id: { type: String, require: true },
    win: { type: Number },
    draw: { type: Number },
    lose: { type: Number },
    type_player: { type: String },
    date_time: { type: Date }
})

const GameHistory = Mongoose.model('GameHistory', Schema)
module.exports = GameHistory