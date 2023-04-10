const User = require('../models/userTable');


module.exports = function (socket) {

    socket.on('usersocket', (data,acknowledgement) => {
        try {
            // console.log('acknowledgement',typeof acknowledgement)
            var data = JSON.stringify(data);
            var data = JSON.parse(data);
            var io = app.get('socketio');
            // console.log('data user socket',data)
            data.socketId = socket.id;
           
            socket.type = "User";

            if (data.userId != undefined && data.userId != '' && data.userId != null) {
                User.adduserSocket(data, (err, verifydata) => {
                    if (err) {
                        console.log("user socket error",err);
                        var userRequestSocketData = {
                            success: false,
                            userId: verifydata._id,
                            Count:1,
                            userStatus: null
                        }

                        acknowledgement(userRequestSocketData);

                    } else {
                            var userRequestSocketData = {
                                success: true,
                                userId:verifydata._id,
                               
                                userStatus:verifydata.userStatus
                            }

                            return acknowledgement(userRequestSocketData);
                        // }

                    }
                });
            }
        }catch (err) {
            console.log('error',err)
        }
    });

};

