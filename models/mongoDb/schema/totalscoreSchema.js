const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    user_id: { type: String, require: true },
    win: { type: Number },
    draw: { type: Number },
    lose: { type: Number },
    type_player: { type: String },
    date_time: { type: Date }
})

const GameTotalScore = Mongoose.model('GameTotalScore', Schema)
module.exports = GameTotalScore