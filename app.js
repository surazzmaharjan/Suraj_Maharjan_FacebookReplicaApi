const express = require('express');
const app= express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

require('./db/mongoose');
const userRouter = require('./routers/user');

app.use(bodyParser.urlencoded({ extended:                                                                                                                                                                                                                                                                                                                                                                                                                                                                   false }));

  
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(userRouter);

// app.listen(4000, () => {
//     console.log(`App is running at localhost:4000`);
// });

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});