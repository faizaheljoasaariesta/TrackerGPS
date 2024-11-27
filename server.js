const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const { getCurrentData } = require('./src/features/gpsSensor/services/getDataGPS');
const { updateFirestoreGPS } = require('./src/features/gpsSensor/http/controllers/firestore');

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

setInterval(() => {
  require('dns').lookup('google.com', async (err) => {
    if (err) {
      console.error("No connection to google.com");
    } else {
      const data = getCurrentData();

      if (data) {
        try {
          await updateFirestoreGPS(data);
        } catch (error) {
          console.error('Error saat memperbarui Firestore:', error.message);
        }
      }
    }
  });
}, 2000);

app.listen(PORT, () => {
  console.info("Server running on PORT: " + PORT);
});
