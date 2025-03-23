const app = require('./app');
const { testConnection } = require('./config/db');
const dotenv = require('dotenv');


const PORT = process.env.PORT;

//Test database connection before starting 
async function startServer(){
    const isConnected = await testConnection();

    if (isConnected) {
       app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
       });
    } else {
        console.error('Failed to connect to database, server not started');
        process.exit(1);
    }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });
