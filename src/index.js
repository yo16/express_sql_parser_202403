const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
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
app.use(
  bodyParser.urlencoded({extended:true})
);
app.use(
  bodyParser.json()
);

app.get("/", (req, res) => res.type('html').send("<html><body>/</body></html>"));
app.post("/sql", (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", cors_url);
  } catch (e) {
    console.error(e);
  }

  // bodyからqueryを取り出す
  const query = req.body.query;
  //console.log(query);

  // Sql2Aryで解析
  try {
    const {stmts, tableConns, colConns} = Sql2Ary(query);
    //console.log(stmts);

    res.type('json').send({
      statements: stmts,
      tableConns,
      colConns,
    });
  } catch (e) {
    console.error(e.message);
    throw new Error(`Error: ${e.message}`);
  }
  
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
