const app = require('./app')

const port = 3000;
//Initialize server
app.listen(port, () => {
   console.log(`App running on port ${port}...`)
});