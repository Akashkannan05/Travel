const http = require('http');
const fs = require('fs');

const staffToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlN0YWZmIiwiaWF0IjoxNzc4MTQ5MzMwLCJleHAiOjE3NzgyMzU3MzB9.yEk-94TXW8CHRaf3mc9UtvkLmHUMupAS7n2DAm0VVAs';

const filters = ['ALL', 'INPLACE', 'SHIPPING', 'INCOMING', 'RECEIVED', 'SENT'];

async function fetchFilter(filter) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1/staff/couriers?status=${filter}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${staffToken}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        fs.writeFileSync(`scratch/filter_${filter.toLowerCase()}.json`, data);
        console.log(`Saved filter_${filter.toLowerCase()}.json`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });

    req.end();
  });
}

async function run() {
  for (const filter of filters) {
    try {
      await fetchFilter(filter);
      await new Promise(r => setTimeout(r, 2000)); // 2s delay
    } catch (e) {
      console.error(`Failed to fetch ${filter}`);
    }
  }
}

setTimeout(run, 5000); // Wait 5s for server to be ready
