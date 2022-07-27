let dataUser = { username: "naruto", password: "123123", token: "adafcanfannas" };
const UserModel = require('../models/mongoDB/schema/user-schema')
const UserProfile = require('../models/mongoDB/schema/userProfile')
const GameHistory = require('../models/mongoDB/schema/historyschema');
const TotalScore = require('../models/mongoDB/schema/totalscoreSchema');


exports.Home = (req, res) => {
    res.render('index')
};

exports.Game = (req, res) => {
    res.render('games')
}

// login
exports.login = async (req, res) => {
    const { username, password } = req.body
    if ( !username || !password ) {
        res.status(400).send({ message: "Wrong username or password", statusCode: 400 })
    } else {
        try {
            // Check User Exist
            let findUser = await UserModel.findOne({ username: username })

            console.log(findUser)
            if ( !findUser || findUser.length < 0 ) {
                res.status(400).send({ message: "Wrong username or password", statusCode: 400 })
            } else {
                // Check Password
                if ( findUser.password === password ) {
                    // Get Data Profile
                    let getProfile = await UserProfile.findOne({ user_id: findUser._id })
                    res.send({
                        message: 'Successfull to login / get data user',
                        statusCode: 200,
                        result: {
                            id: findUser._id,
                            username: findUser.username,
                            email: findUser.email,
                            token: '0a39mdsakpd93aanlsid'
                        }
                    })
                } else {
                    res.status(400).send({ message: "Wrong username or password", statusCode: 400 })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }
    }
};

// register
exports.Register = async (req, res) => {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
        res.status(400).send({ message: "Wrong username or password", statusCode: 400 })
    } else {
        try {
            // Check User if exist
            let findUser = await UserModel.findOne({ username: username, email: email })
            if (findUser) {
                return res.status(400).json({
                    message: "Username or Email has registered. Please use the othere!",
                    statusCode: 400,
                })
            } else {
                // Check Each Char Data
                // Encryption Password
                // Send New Data
                let createUser = await UserModel.create({
                    username: username, password: password,
                    email: email
                })
                
                let createProfile = await UserProfile.create({
                    user_id: createUser._id, first_name: "",
                    last_name: "", full_name: "", umur: 0,
                    tgl_lahir: "", gender: "", address: "",
                })

                // Send Verifikasi
               return res.status(200).json({
                    statusCode: 200,
                    message: 'Successfull to register data!',
                    result: createProfile
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: "Username or Email has registered. Please use the othere!",
                statusCode: 400,
            })
        }
    }
};
exports.RegisterView = (req, res) => {
    res.render('register')
}

// game history
exports.GameHistory = async (req, res) => {
    const { user_id, win, draw, lose } = req.body
    let historyData = {
        user_id: user_id,
        win: win,
        draw: draw,
        lose: lose,
        type_player: "Player",
        date_time: Date.now()
    }  
    
    try {
        let findDataTotalScore = await TotalScore.findOne({ user_id: user_id })
        let createGameHistory = await GameHistory.create(historyData)
        if ( !findDataTotalScore ) {
            let createTotalScore = await TotalScore.create(historyData)
            res.send({ statusCode: 200, message: 'successfull to save game score !'})
        } else {
            findDataTotalScore.win = findDataTotalScore.win + win
            findDataTotalScore.lose = findDataTotalScore.lose + lose
            findDataTotalScore.draw = findDataTotalScore.draw + draw
            console.log(findDataTotalScore)
            let updateTotalScore = await TotalScore.findOneAndUpdate(
                { user_id: user_id }, findDataTotalScore
            )
            res.send({ statusCode: 200, message: 'successfull to save game score !'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'failed to save game score!',
            statusCode: 500,
        })
    }
}
// score
exports.getScore = async (req, res) => {
    let UserId = req.params.id

    try {
        let getScore = await TotalScore.aggregate([
            { $match: { 'user_id': UserId } },
            {
                $lookup: {
                    from: 'gamehistories',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'score_history'
                }
            }
        ])
           
        console.log(getScore)
        res.render('high-score',{
            statusCode: 200,
            message: 'Successfull to get game data score!',
            results: getScore,
            nomor: 1
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message: 'Failed to get game data score!',
        })
    }
} 

// user admin
exports.superView = async (req, res) => {
    
    try {
        let userList = await UserModel.find()
        let userProfiledet = await UserProfile.find()
        const pesan = req.flash('pesan');
        res.status(200).render('super-user',{
            statusCode: 200,
            message: 'succesfully get data',
            result: userList,
            profile: userProfiledet,
            nomor: 1,
            pesan: pesan
        })
        
    } catch (error) {
        res.status(400).json({
            statusCode:500,
            message: 'cannnot find user'
        })
    }
    
}

exports.userUpdate = async (req, res) => {
    // const id_user = req.params.id
    let { user_id, first_name, last_name, umur, tgl_lahir, gender, address } = req.body
    let data =  {
        first_name: first_name,
        last_name: last_name,
        umur: umur,
        tgl_lahir: tgl_lahir,
        gender: gender,
        address: address
    }
    try {
        let updateProfile = await UserProfile.findOneAndUpdate({ user_id: user_id }, data)
        let getProfile = await UserProfile.findOne({ user_id: user_id })
        req.flash('pesan', 'sukses update data')
        res.redirect('/super-user')
        
            
        console.log(updateProfile)

    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'gagal'
        })
    }
}

exports.deleteUser = async (req, res) => {
    const id_user = req.params.id
    try {
        let deleteUserProfile = await UserProfile.findOneAndRemove({ user_id: id_user })
        let deleteUser = await UserModel.findOneAndRemove({ _id: id_user })
        req.flash('pesan', 'berhasil hapus user')
        res.redirect('/super-user')
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'gagal'
        })
    }
}

//profile user
exports.profileUser = async (req, res) => {
    const id_user = req.params.id
    try {
        let userProfile = await UserProfile.findOne({ user_id: id_user })
        const pesan = req.flash('pesan');
        res.status(200).render('profile-user',{
            statusCode: 200,
            message: 'succesfull to get data',
            result: userProfile,
            pesan: pesan
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'gagal'
        })
    }
}

exports.updateProfile = async (req, res) => {
    const id = req.params.id
    let { first_name, last_name,  umur, tgl_lahir, gender, address } = req.body
    let data =  {
        first_name: first_name,
        last_name: last_name,
        umur: umur,
        tgl_lahir: tgl_lahir,
        gender: gender,
        address: address
    }
    try {
        let updateProfile = await UserProfile.findOneAndUpdate({ user_id: id }, data)
        let getProfile = await UserProfile.findOne({ user_id: id })
        
        req.flash('pesan', 'sukses update data')
        res.redirect('/user-profile/' + id)
        
            
        console.log(req.body)
        console.log(id)

    } catch (error) {
        console.log(error)
        res.status(500).send({
            statusCode: 500,
            message:'gagal'
        })
    }
}
