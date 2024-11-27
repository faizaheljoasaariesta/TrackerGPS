const axios = require('axios');
const url = 'http://192.168.1.1/js/status-data-gps.jsx?_http_id=TIDca337e16b80eb340';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0',
    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, /; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': 'Basic YWRtaW46YWRtaW4=',
    'Referer': 'http://192.168.1.1/',
    'Cookie': 'tomato_status_overview_refresh=3; tomato_status_devices_refresh=0; tomato_wlan_tab=wl0; tomato_sim_tab=sim0',
    'Connection': 'keep-alive'
};

let currentData = null;

const fetchData = async () => {
    try {
        const response = await axios.get(url, { headers });

        const MIN = (a, b) => (a < b ? a : b);
        const MAX = (a, b) => (a > b ? a : b);

        const data = new Function(`
            "use strict";
            let nvram = {};
            let stats = {};
            const MIN = ${MIN.toString()};
            const MAX = ${MAX.toString()};
            ${response.data}
            return { nvram, stats };
        `)();

        currentData = {
            gps_valid: data.nvram.gps_valid,
            gps_bds: data.nvram.gps_bds,
            gps_use: parseInt(data.nvram.gps_use),
            gps_date: parseInt(data.nvram.gps_date),
            gps_time: parseInt(data.nvram.gps_time),
            gps_latitude: parseFloat(data.nvram.gps_latitude),
            gps_NS: data.nvram.gps_NS,
            gps_longitude: parseFloat(data.nvram.gps_longitude),
            gps_EW: data.nvram.gps_EW,
            google_map: data.nvram.google_map,
        };

    } catch (err) {
        console.error('Error saat parsing data:', err.message);
    }
};

setInterval(fetchData, 1000);

const getCurrentData = () => currentData;

module.exports = { getCurrentData };
