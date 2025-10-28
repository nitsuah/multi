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

// Main route for production - simple status page
router.get('/', async (req, res, next) => {
    res.json({ 
        service: 'Multi WebSocket Server',
        status: 'running',
        connections: ioServer ? ioServer.engine.clientsCount : 0,
        timestamp: new Date().toISOString()
    })
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
let gameState = {
    isActive: false,
    mode: 'none',
    itPlayerId: null,
    startTime: null
}

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

    // Handle chat messages
    client.on('chat-message', (message) => {
        console.log(`Chat message from ${client.id}: ${message.message}`)
        
        // Basic profanity filter (simple word replacement)
        const profanityFilter = (text) => {
            const badWords = ['fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard']
            let filtered = text
            badWords.forEach(word => {
                const regex = new RegExp(word, 'gi')
                filtered = filtered.replace(regex, '*'.repeat(word.length))
            })
            return filtered
        }
        
        // Filter the message
        const filteredMessage = {
            ...message,
            message: profanityFilter(message.message),
            timestamp: Date.now() // Server timestamp for consistency
        }
        
        // Broadcast to all clients
        ioServer.sockets.emit('chat-message', filteredMessage)
    })

    // Handle game start
    client.on('game-start', (gameData) => {
        console.log(`Game start requested by ${client.id}:`, gameData)
        
        const playerCount = Object.keys(clients).length
        if (playerCount >= 2) {
            gameState.isActive = true
            gameState.mode = gameData.mode
            gameState.startTime = Date.now()
            
            // Pick random 'it' player
            const playerIds = Object.keys(clients)
            gameState.itPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)]
            
            console.log(`Game started! ${gameState.itPlayerId} is IT!`)
            
            // Broadcast game start to all clients
            ioServer.sockets.emit('game-start', {
                ...gameData,
                itPlayerId: gameState.itPlayerId,
                startTime: gameState.startTime
            })
        } else {
            client.emit('game-error', { message: 'Need at least 2 players to start' })
        }
    })

    // Handle player tagging
    client.on('player-tagged', (data) => {
        console.log(`Tag attempt: ${data.taggerId} -> ${data.taggedId}`)
        
        if (gameState.isActive && gameState.mode === 'tag' && data.taggerId === gameState.itPlayerId) {
            // Verify both players exist
            if (clients[data.taggerId] && clients[data.taggedId]) {
                gameState.itPlayerId = data.taggedId
                console.log(`Tag successful! ${data.taggedId} is now IT!`)
                
                // Broadcast to all clients
                ioServer.sockets.emit('player-tagged', data)
            }
        }
    })

    // Handle game end
    client.on('game-end', () => {
        console.log(`Game end requested by ${client.id}`)
        
        gameState.isActive = false
        gameState.mode = 'none'
        gameState.itPlayerId = null
        gameState.startTime = null
        
        ioServer.sockets.emit('game-end')
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
