const debug = require('debug')('debug:authSocket');

const Staff = require('../admin/models/staff');


async function authSocket(socket, next) {
    const { storeId, username} = socket.handshake.query;
    try {
        if (!storeId || !username)
            return next(new Error('Invalid data'));

        if (!socket.auth) {
            const staff = await Staff.findOne({
                where: {
                    username: username,
                },
                include: [Store]
            });

            if (!staff) return socket.disconnect('unauthorized');

            socket.auth = parseInt(storeId) === staff.store.id;
            if (!socket.auth)
                return socket.disconnect('unauthorized');

            socket._Room = storeId.concat('.', staff.store.storeName || '');
            // socket.join(socket._Room);
            log.info(`[${socket.id}][${username}] đã vào phòng ${socket._Room}`);
        }

        if (socket.auth)
            next();
        else
            socket.disconnect('unauthorized');
    } catch (error) {
        log.error(error);
        next(new Error('Authentication error'));
    }
}

io.on('connect', socket => {
    debug(`[${socket.id}] da ket noi`);
    // connect status
    io.emit('authenticated', { status: 'connected', room: socket._Room });
});


module.exports = {
    authSocket: authSocket
};
