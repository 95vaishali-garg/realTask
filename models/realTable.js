var mongoose = require('mongoose');

var customerSocketSchema = mongoose.Schema({
    socketId:       {type: String},
    customerId :    {type: String},
    userCount:{type:Number},
    connectedAt:    {type: Date},
    disconectAt:{type:Date}
   
})

const SCsch = module.exports =  mongoose.model('realData' , customerSocketSchema);

module.exports.addTable = function(data, callback){
    var query= {customerId: data.customerId};
    var datad = {
        socketId:       data.socketId,
        customerId :    data.customerId,
        count:data.count,
        connectedAt:    new Date(),
    }

    SCsch.findOneAndUpdate(query,datad,{upsert:true, new: true },callback);
}
