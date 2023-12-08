const mongoose = require('mongoose');
const getConnection = async () => {

    try {
        const url = 'mongodb://admin:Ccmmaa1212@ac-27mvbaw-shard-00-00.g06qbu4.mongodb.net:27017,ac-27mvbaw-shard-00-01.g06qbu4.mongodb.net:27017,ac-27mvbaw-shard-00-02.g06qbu4.mongodb.net:27017/jwt-g34?ssl=true&replicaSet=atlas-xxtnfp-shard-0&authSource=admin&retryWrites=true&w=majority'
        await mongoose.connect(url);
        console.log('Conexion exitosa');


    } catch (error) {
        console.log(error)
    }
}
    module.exports = {
        getConnection,

    }