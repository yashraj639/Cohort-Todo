const app = require("./app");

const dbConnect = require("./db");

dbConnect();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
