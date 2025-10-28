import fs from 'fs'
import express from 'express'
import Router from 'express-promise-router'
import { Server } from 'socket.io'
import cors from 'cors'

// Environment configuration
const PORT = process.env.PORT || 4444
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:4444', 'https://deploy-preview-*--darkmoon-dev.netlify.app', 'https://darkmoon-dev.netlify.app']

// Create router
const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        connections: ioServer ? ioServer.engine.clientsCount : 0
    })
})

// Main route serves the index HTML
router.get('/', async (req, res, next) => {
    let html = fs.readFileSync('index.html', 'utf-8')
    res.send(html)
})

// Everything else that's not index 404s
router.use('*', (req, res) => {
    res.status(404).send({ message: 'Not Found' })
})


// Create express app and listen on specified port
const app = express()
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        
        // Check if origin is allowed
        const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const pattern = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$')
                return pattern.test(origin)
            }
            return allowedOrigin === origin
        })
        
        if (isAllowed) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use(express.static('dist'))
app.use(router)

const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}...`)
    console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
})

const ioServer = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // Allow requests with no origin
            if (!origin) return callback(null, true)
            
            const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
                if (allowedOrigin.includes('*')) {
                    const pattern = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$')
                    return pattern.test(origin)
                }
                return allowedOrigin === origin
            })
            
            if (isAllowed) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
})

let clients = {}

// Socket app msgs
ioServer.on('connection', (client) => {
    console.log(
        `User ${client.id} connected, Total: ${ioServer.engine.clientsCount} users connected`
    )

    //Add a new client indexed by their id
    clients[client.id] = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    }

    ioServer.sockets.emit('move', clients)

    client.on('move', ({ id, rotation, position }) => {
        clients[id].position = position
        clients[id].rotation = rotation

        ioServer.sockets.emit('move', clients)
    })

    client.on('disconnect', () => {
        console.log(
            `User ${client.id} disconnected, there are currently ${ioServer.engine.clientsCount} users connected`
        )

        //Delete ttheir client from the object
        delete clients[client.id]

        ioServer.sockets.emit('move', clients)
    })
})
