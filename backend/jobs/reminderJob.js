const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

const sendReminder = async () => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tasks = await Task.find({dueDate: {$lte: today}, status: "pending"}).populate("userId");
    
    for(let task of tasks) {
        const user = task.userId;

        if(user && user.email) {
            await sendEmail(user.email,
                `Reminder: ${task.title} is due today!`,
                `Hey ${user.name}, \n \n Your task "${task.title}" is due today. Please complete it on time! \n\n Thanks!`
             );
        }
    }
  } catch (error) {
    console.error("Erro in reminder job:",error);
  }
};

//Run the reminder job every day at 9:00 AM

cron.schedule("0 9 * * *", ()=>{
    console.log("Running Task Reminding job...");
    sendReminder();
});

