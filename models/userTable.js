var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: { type: String, required: true },
    
    email: { type: String },
    password: { type: String },
    token: { type: String },
   
   status:{ type: String, enum: ["active", "inactive"], default: 'inactive'},
    createdAt: { type: Date },
    UpdatedAt: { type: Date },
   
    socketId: { type: String },
    socketConnectedAt: { type: Date },
    socketStatus: { type: String, enum: ["yes", "no"], default: "yes" },
    
},
    {
        versionKey: false // You should be aware of the outcome after set to false
    });

//userSchema.index({ userLocation:"2dsphere" })

const User = module.exports = mongoose.model('User', userSchema);

//get all users
module.exports.getUsers = function (callback, limit) {
    User.find(callback).limit(limit);
}




module.exports.getUsersWithFilter = function (obj, sortByField, sortOrder, paged, pageSize, callback) {
    User.aggregate([{ $match: obj },
    
    { $sort: { [sortByField]: parseInt(sortOrder) } },
    { $skip: (paged - 1) * pageSize },
    { $limit: parseInt(pageSize) },
    ], callback);
}


//add user 
module.exports.addUser = function (data, callback) {
    console.log("register Data====>".data);
    var query = {};
    if (data.email) {
        query.email = data.email
    }

   

   
    User.findOneAndUpdate(query, data, { upsert: true, new: true }).lean().exec(callback)
}

module.exports.addCustomerSocket = (data, callback) => {
    var query = { _id: data.customerId };
    var datad = {
        socketId: data.socketId,
        socketConnectedAt: new Date(),
        socketStatus: "yes"
    }

    

    User.findOneAndUpdate(query, datad, { upsert: true, fields: {  socketId: 1, socketStatus: 1, customerStatus: 1 }, new: true }, callback);
}

module.exports.removeSocketCustomer = (data, callback) => {

    console.log("==check customer socket status======",data);
    var query = { socketId: data };
    var datad = {
        socketStatus: "no",
    }
    User.findOneAndUpdate(query, datad, { new: true }, callback);
}

module.exports.updateSocketStatus = (data, callback) => {
    var query = { _id: data.customerId };
    var datad = {
        socketStatus: data.status
    }

    User.findOneAndUpdate(query, datad, { new: true }, callback);
}

module.exports.findCSocket = (  userId, callback) => {
    var query = {_id: userId };
    User.findOne(query, 'customerStatus userId socketId socketStatus', callback);
}


//edit user profile
module.exports.getUserById = (id, callback) => {
    User.findById(id,"-clientSecret", callback);
}

module.exports.getUserByIdAsync = (id, callback) => {
    return User.findById(id, callback);
}

module.exports.getSocketDetails = (id, callback) => {
    return User.findById(id, callback).select('_id socketStatus customerStatus socketId');
}

//get user by email
module.exports.getUserByEmail = (data, callback) => {
    var query = { email: data.email };
    return User.findOne(query, callback);
}

// Updating user
module.exports.updateUser = (id, data, options, callback) => {
    var query = { _id: id };
    var update = {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
    }
    update.updatedAt = new Date(); // change it later
    return User.findOneAndUpdate(query, update, { fields: { password: 0 } }, callback);
}

// Updating user
module.exports.updateToken = (data, callback) => {
    var query = { email:data.email};
    var update = {
        token: data.token
       
    }
    update.updatedAt = new Date(); // change it later
    return User.findOneAndUpdate(query, update, { fields: { password: 0 } }, callback);
}



module.exports.logoutCustomer = (userId, callback) => {
    var query = { _id: userId };
    var update = {
        $unset: {
            token: "",
        },
        updatedAt: new Date()
    }
    return User.findOneAndUpdate(query, update, { "fields": { password: 0, }, "new": true }, callback);
}

module.exports.updateUsers = (data, callback) => {
    var query = { _id: data.userId };
    var update = {
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        countryCode: data.countryCode,
        updatedAt: new Date()
    }
    if (data.password) {
        update.password = data.password
    }

    return User.findOneAndUpdate(query, data, { "fields": { password: 0, trips: 0 }, "new": true }, callback);
}

module.exports.custAuth = (data) => {
    return User.findOne({ _id: data.customerid, token: data.token });
}
