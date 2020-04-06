const ip = require("ip");

module.exports = {
  "hostname": ip.address(),
  "port": "3001",
  "socket": "3002"
};
