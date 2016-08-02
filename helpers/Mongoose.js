var mongoose = require("mongoose");
var config = require("config/default");

if (mongoose.connection.readyState == 0) {
	mongoose.connect(config.mongoose.uri, config.mongoose.options);
}

mongoose.Promise = global.Promise;

module.exports = mongoose;