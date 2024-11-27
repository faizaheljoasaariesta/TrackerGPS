const { doc, updateDoc } = require('firebase/firestore');
const db = require('../../../../config/firebaseConfig');
const env = require('dotenv');

env.config();

const trainPlateNumber = "M108004";

const updateFirestoreGPS = async (data) => {
  try {
    if (!trainPlateNumber) {
      throw new Error("trainPlateNumber tidak boleh kosong");
    }

    const ref = doc(db, 'trainTrackings', trainPlateNumber);

    const newData = {
      trainPlateNumber: trainPlateNumber,
      gps: {
        valid: data.gps_valid,
        bds: data.gps_bds,
        use: data.gps_use,
        date: data.gps_date,
        time: data.gps_time,
        latitude: data.gps_latitude,
        NS: data.gps_NS,
        longitude: data.gps_longitude,
        EW: data.gps_EW,
        google_map: data.google_map
      }
    };

    Object.keys(newData).forEach(key => {
      if (newData[key] === undefined) {
        throw new Error(`Properti ${key} tidak boleh undefined`);
      }
    });

    await updateDoc(ref, newData);
  } catch (err) {
    console.error('Error memperbarui Firestore:', err.message);
  }
};

module.exports = { updateFirestoreGPS };
