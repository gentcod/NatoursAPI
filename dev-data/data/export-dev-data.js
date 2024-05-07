const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// LOCAL DB CONNECTION
mongoose.connect(DB).then(() => {
  console.log('Connected Successfully');
  execSeeding();
});

//Read JSON file and convert to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into DB
const exportData = async () => {
  try {
    await Tour.insertMany(tours);
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

const execSeeding = () => {
  if (process.argv[2] === '--import') {
    exportData();
  } else if (process.argv[2] === '--delete') {
    deleteData();
  }
};

//Returns an array of the file path of the arguments in the command line
// console.log(process.argv);
