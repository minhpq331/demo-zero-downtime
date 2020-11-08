const express = require('express')
const os = require('os')
const app = express()

const port = parseInt(process.env.PORT, 10) || 0

const version = '2.0'

if (!port) {
	console.log('Missing env PORT!')
	process.exit(1)
}

app.get('/', (req, res) => {
  res.send(`Hello, I'm running on ${os.hostname()} with version ${version}!`)
})

setTimeout(() => { 
  app.listen(port, () => {
    console.log(`Example app listening at port ${port}`)
  })
}, 5000);
