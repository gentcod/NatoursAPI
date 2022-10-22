const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT;
// eslint-disable-next-line spaced-comment
//Initialize server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
