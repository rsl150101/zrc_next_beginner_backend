import express from "express";

const app = express();

app.set("port", process.env.PORT || 3065);

const handleListenServer = () => {
  console.log(`Listening on http://localhost:${app.get("port")}`);
};

app.listen(app.get("port"), handleListenServer);
