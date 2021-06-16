var dotenv = require('dotenv');
dotenv.config({ path: ".env" });

console.log(process.env);
const envData = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    ddos_burst: process.env.DDOS_BURST,
    ddos_limit: process.env.DDOS_LIMIT,
}



// const envData = {
//     port: 3000,
//     node_env: "test",
//     ddos_burst: 10,
//     ddos_limit: 15,
// }

module.exports = envData;