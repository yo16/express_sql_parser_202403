const express = require("express");
const cors = require("cors");
const { Sql2Ary } = require("sql_parse_202403");

const app = express();
const port = process.env.PORT || 3001;
const cors_url = process.env.CORS || "http://localhost:3000";

app.use(
  cors({
    origin: cors_url,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => res.type('html').send("<html><body>/</body></html>"));
app.post("/sql", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", cors_url);
  } catch (e) {
    console.error(e);
  }

  const req_body = req.body;

  const query = req.body.query;
  console.log(query);

  //const query1 = "select t1.col1 from t1 where t1.col2=\"abc\"";
  const query2 = 
    "with t2 as (" +
    "select " +
        "id, t1.name, col1 " +
    "from t1" + 
    ") select t2.col1 from t2, t3 where t2.id=t3.id";
  const {stmts, tableConns, colConns} = Sql2Ary(query2);
  //console.log(stmts);
  
  res.type('json').send({
    statements: stmts,
    tableConns,
    colConns,
  });
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
