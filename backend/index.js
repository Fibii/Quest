const http = require('http')
const app = require('./app')

const server = http.createServer(app)
const { PORT } = process.env
server.listen(PORT, () => {
  console.log(`server started on localhost:${PORT}`)
})
