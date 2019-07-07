const Server = use('Server')
const io = use('socket.io')(Server.getInstance())


module.exports = {io}
