const express = require("express");
const Sql2Ary = require("sql_parse_202403");

const app = express();
const port = process.env.PORT || 3001;
const cors_url = process.env.CORS || "http://localhost:3000";

app.get("/", (req, res) => res.type('html').send("<html><body>/</body></html>"));
app.get("/sql", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", cors_url);
  } catch (e) {
    console.error(e);
  }

  //const query1 = "select t1.col1 from t1 where t1.col2=\"abc\"";
  const query2 = 
  "with t2 as (" +
      "select " +
          "t1.id as id, name " +
      "from t1" + 
  ") select t2.col1 from t2, t3 where t2.id=t3.id";
  const ary = Sql2Ary(query2);
  
  res.type('json').send({
    statements: ary
  });
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
