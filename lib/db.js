import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_app",
});


try {
  await db.getConnection();
  console.log("Connected to the database");
} catch (error) {
  console.error("Error connecting to the database:", error);
}