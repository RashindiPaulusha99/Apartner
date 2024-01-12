const apiProtocall = "http";
// apiProtocall : 'http',
 const apiUrl = "54.91.120.201";
// const apiUrl = "192.168.1.4";
//  const apiUrl = "192.168.1.4";
const apiPort = "5000";
 
const constantparameters = {
 apiUrlWithPort: `${apiProtocall}://${apiUrl}:${apiPort}`,
 apiUrl: `${apiProtocall}://${apiUrl}\\`,
};
 
module.exports = constantparameters;