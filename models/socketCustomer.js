var mongoose = require('mongoose');

var customerSocketSchema = mongoose.Schema({
    socketId:       {type: String},
    customerId :    {type: String},
    connectedAt:    {type: Date},
    disconectAt:{type:Date}
   
})

const SCsch = module.exports =  mongoose.model('SocketCustomer' , customerSocketSchema);

module.exports.findCSocket = (data,callback) => {
    return SCsch.findOne({customerId:data},callback);
}

module.exports.findCSocketCallback = (data,callback) => {
    SCsch.findOne({customerId:data},callback);
}

module.exports.addCustomerSocket = function(data, callback){
    var query= {customerId: data.customerId};
    var datad = {
        socketId:       data.socketId,
        customerId :    data.customerId,
        connectedAt:    new Date(),
    }

    if (data.firebase_token) {
        datad.firebase_token=data.firebase_token;
    }

    SCsch.findOneAndUpdate(query,datad,{upsert:true, new: true },callback);
}

module.exports.removeCustomer = function(data, callback){
    var query = {socketId: data};
    var datad = {
        disconectAt:new Date()
    }
    SCsch.findOneAndUpdate(query,datad,{upsert:false, new: true },callback);
    //SCsch.remove(query, callback)
   
} 