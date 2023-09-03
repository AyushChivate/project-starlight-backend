import { Server } from 'socket.io'

const room = 'main-room'
const MAX_PLAYERS = 5
type Player = {
    socketId: string
}
let players: Player[] = []

const io = new Server({
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:4173'],
    },
})

io.on('connection', socket => {
    if (players.length + 1 > MAX_PLAYERS) {
        console.log(
            `Player ${socket.id} unable to join. Maximum of ${MAX_PLAYERS} players reached.`
        )
        socket.emit('is-room-full', true)
        return
    }

    socket.join(room)
    console.log(
        `Player "${socket.id}" has connected and joined room "${room}".`
    )

    players.push({ socketId: socket.id })
    console.log(players)

    if (players.length == 5) {
        console.log(`Maximum of ${MAX_PLAYERS} players reached.`)
        io.to(room).emit('disable-start', false)
    }

    socket.on('disconnect', () => {
        players = players.filter(player => player.socketId != socket.id)
        console.log(`Player "${socket.id}" has disconnected.`)
        console.log(players)
        // disable start game button
        if (players.length < 5) {
            io.to(room).emit('is-room-full', false)
            io.to(room).emit('disable-start', true)
        }
    })
})

io.listen(3000)
