// this file will handle start server
import app from './app'

const port: number = 3000

// starting the server on specific port
app.listen(port, () => {
    console.log(`The server listen on ${port}`)
})