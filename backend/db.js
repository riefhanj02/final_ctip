import mysql from "mysql2/promise";

// Create MySQL connection pool
const db = await mysql.createPool({
  host: "localhost",       
  user: "root",            
  password: "",            
  database: "SmartPlant",  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
