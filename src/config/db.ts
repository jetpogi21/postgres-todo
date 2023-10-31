import { Dialect, Sequelize } from "sequelize";
import config from "@/config/config";

const environment = process.env.NODE_ENV;

const dbName = config[environment].database!;
const dbUser = config[environment].username!;
const dbPassword = config[environment].password!;
const dbHost = config[environment].host;
const dbDialect = config[environment].dialect as Dialect;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
});

//This is used to test the database connection
/* const authenticate = async() => {
    try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

authenticate() */

export default sequelize;
