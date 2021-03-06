module.exports = function(io) {
    var crypto = require('crypto'),
		sockets = io.sockets,
		onlines = {}
	;
	sockets.on('connection', function(client) {
		var session = client.handshake.session,
			usuario = session.usuario
		;
		onlines[usuario.email] = usuario.email;
		for(var email in onlines) {
			client.emit('notify-onlines', email);
			client.broadcast.emit('notify-onlines', email);
		}
        client.on('join', function(sala) {
            if(!sala) {
                var timestamp = new Date().toString()
                , md5 = crypto.createHash('md5');
                sala = md5.update(timestamp).digest('hex');
            }
            session.sala = sala;
            client.join(sala);
        });
        client.on('disconnect', function() {
            client.leave(session.sala);
        });
		client.on('send-server', function(msg) {
            var sala = session.sala
            , data = {email: usuario.email, sala: sala};
			msg = "<b>"+ usuario.nome +":<b> "+ msg +"<br>";
			client.broadcast.emit('new-message', data);
            sockets.in(sala).emit('send-client', msg);
            console.log(sala)
		});
		client.on('disconnect', function() {
			var sala = session.sala,
				msg = "<b>"+usuario.nome+":<b> saiu.<br>";
			delete onlines[usuario.email];
			client.leave(sala)
		});
	});
};