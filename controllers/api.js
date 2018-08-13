var ExerciseModel = require('../models/Exercise.js')
var UserModel = require('../models/User.js');

function formatDate() {
    var date = new Date(Date.now())
    var d = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    return d;
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function generateNew(new_username) {
    console.log("Generating new user: " + new_username);
}

exports.addExercise = (req, res, next) => {

    //   userId : {type: String, required: true}
    //   description: {type: String, required: true}
    //   duration: {type: Number, required: true}
    //   date: {type: Date, default: Date.now()}

    UserModel.findOne({
        userId: req.body.userId
    }, (err, user) => {
        if (err) next(err)
        if (!user) {
            next({
                status: 400,
                message: "Unknown userId"
            })
        }

        const exerc = new ExerciseModel();

        exerc.userId = req.body.userId
        exerc.date = (req.body.date == null) ? formatDate() : req.body.date;
        exerc.description = req.body.description;
        exerc.duration = isNaN(req.body.duration) ? 0 : req.body.duration;

        exerc.save((err, savedData) => {
            if (err) {
                console.log(err)
                next({
                    status: 400,
                    message: err
                })
            }
            res.send(savedData)
        })
    })

}

exports.getLogs = (req, res, next) => {

    const query_from = req.query.from == null ? new Date(0) : new Date(req.query.from);
    const query_to = req.query.to == null ? Date.now() : new Date(req.query.to);
    const query_user = req.query.userId;

    UserModel.findOne({
        userId: req.query.userId
    }, (err, user_) => {
        if (err) next(err)
        if (!user_) {
            next({
                status: 400,
                message: "Unknown USER"
            })
        }
        console.log(user_)

        ExerciseModel.find({
                userId: req.query.userId,
                date: {
                    $lt: query_to,
                    $gt: query_from
                }
            }, {
                __v: 0,
                _id: 0
            })
            .sort('-date')
            .limit(parseInt(req.query.limit))
            .exec((err, exer) => {
                if (err) return next(err)
                res.send(exer)
            })
    })
}

exports.getAllUsers = (req, res, next) => {
    UserModel.find({}, {
        "username": 1,
        // "userId": 1,
        "timestamp": 1,
        "_id": 0
    }, (err, data) => {
        if (err) {
            console.log(err)
            next({
                status: 400,
                message: "error finding users"
            })
        }
        // html = `<table border=1 cellspacing=4 cellpadding=5><thead>
        // <td>Username</td>
        // <td>Timestamp</td>
        // </thead><tbody>` 
        // data.forEach((k) => {
        //     html += `<tr> <td>${k.username}</td> <td>${k.timestamp}</td>`;
        // })
        // html += `</tbody></table>`
        res.send(data)
    })
}

exports.addUser = (req, res, next) => {

    // username : {type: String, required: true},
    // userId: {type: String, required: true},
    // timestamp: {type: Date, default: Date.now()}

    UserModel.findOne({
        username: req.body.username
    }, (err, data) => {
        if (isEmpty(data)) {
            var genUserID = function () {
                var id = "";
                var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 6; i++)
                    id += set.charAt(Math.floor(Math.random() * set.length))
                UserModel.find({
                    userId: id
                }, (err, data) => {
                    if (err) console.log(err)
                    else {
                        console.log(id)
                    }
                })
                return id;
            }
            var new_user = new UserModel({
                username: req.body.username,
                userId: genUserID()
            })

            console.log(new_user);
            new_user.save(err => {
                if (err) console.log(err)
                else {
                    res.json({
                        "username": new_user.username,
                        "userId": new_user.userId,
                        message: "Please remember your UserID"
                    })
                }
            })
        } else {
            console.log("User '" + req.body.username + "' already exists")
            next({
                message: "user already exists",
                status: 400
            });
        }
    })
}