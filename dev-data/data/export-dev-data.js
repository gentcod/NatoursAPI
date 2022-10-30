const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successul'));

//Read JSON file and convert to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into DB
const exportData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully created');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--export') {
  exportData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//Returns an array of the file path of the arguments in the command line
// console.log(process.argv);
