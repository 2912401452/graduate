const express = require('express')
const app = express()
app.use(express.static('./public'))

app.get('/',(req, res)=>{
    res.end('success')
})

app.listen(3001,()=>{console.log('port 3001')})