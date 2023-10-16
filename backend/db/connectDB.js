const mongoose = require('mongoose');

const DB = process.env.DATABASE;

//to connect using promises

// mongoose.connect(DB, {
//     useNewUrlParser: true, 
//     // useCreateIndex: true,
//     useUnifiedTopology: true,
//     // useFindAndModify: false,
// }).then(() =>{
//     console.log("Connected to DB");  
// }).catch((err)=> {
//     console.error(`Error connecting to db`);
// });

const connectToDB = async () => {
    try {
        await mongoose.connect (DB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        console.log("Connected to DB")
    } catch (error) {
        console.log(`Error connecting to db: ${error}`);
    }
};

connectToDB();