require("dotenv").config();
const app = require("./src/app");
const { logEmailConfigStatus } = require("./src/utils/sendEmail");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  logEmailConfigStatus();
});