import { Server } from 'socket.io'

const room = 'main-room'
const MAX_PLAYERS = 5
type Player = {
    socketId: string
}
const players: Player[] = []

const io = new Server({
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:4173'],
    },
})

io.on('connection', socket => {
    players.push({ socketId: socket.id })
    console.log(players)
    if (players.length <= MAX_PLAYERS) {
        socket.join(room)
        console.log(
            `Player "${socket.id}" has connected and joined room "${room}".`
        )
        if (players.length == 5) {
            console.log(`${MAX_PLAYERS} players reached.`)
            io.emit('has-last-player-joined', true)
        }
    } else {
        console.log(
            `Player ${socket.id} unable to join. Maximum of ${MAX_PLAYERS} players reached.`
        )
        socket.emit('is-room-full', true)
    }

    socket.on('disconnect', () => {
        players.pop()
        console.log(`Player "${socket.id}" has disconnected.`)
        console.log(players)
    })
})

io.listen(3000)
