const express  = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");



require("./jobs/reminderJob");
app.use(express.json());
app.use(cors());
require("dotenv").config();
connectDB();


//Routes
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/task",taskRoutes);


app.get('/',(req,res)=>{
    res.send('task Reminder App Backend Running ');
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});