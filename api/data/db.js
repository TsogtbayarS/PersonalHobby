const mongoose = require('mongoose');
const callbackify = require('util').callbackify;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

mongoose.connection.on("connected", function () {
    console.log(process.env.MONGOOSE_CONNECTED + process.env.DB_NAME, process.env.DB_URL);
});
mongoose.connection.on("disconnected", function () {
    console.log(process.env.MONGOOSE_DISCONNECTED);
});
mongoose.connection.on("error", function (err) {
    console.log(process.env.MONGOOSE_CONNECTION_ERROR + err);
});

const mongooseConnectionCloseWithCallback = callbackify(mongoose.disconnect);

process.on("SIGINT", function () {
    mongooseConnectionCloseWithCallback(function () {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});
process.on("SIGTERM", function () {
    mongooseConnectionCloseWithCallback(function () {
        console.log(process.env.SIGTERM_MESSAGE);
        process.exit(0);
    });
});

process.once("SIGUSR2", function () {
    mongooseConnectionCloseWithCallback(function () {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.kill(process.pid, "SIGUSR2");
    });
});

