import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "eshop-ssr",
  password: "",
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected bd!");
});

connection.queryP = (...args) => {
  return new Promise((res, rej) => {
    connection.query(...args, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

export default connection;
