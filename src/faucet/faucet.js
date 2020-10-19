const KardiaTool = require('kardia-tool');
const kardiaUtils = require('kardia-tool/lib/common/lib/utils');
const express = require('express');
const cors = require('cors');
const sqlite = require('sqlite3').verbose();

const whitelist = [
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed'))
    }
  }
};

const millisecondToHMS = (time) => {
  const timeInSeconds = parseInt(time / 1000);
  const hours = parseInt(timeInSeconds / 3600);
  const minutes = parseInt((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds - hours * 3600 - minutes * 60;

  const hourString = hours ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
  const minuteString = minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
  const secondString = seconds ? `${seconds} second${seconds > 1 ? 's' : ''}` : '';

  return `${hourString} ${minuteString} ${secondString}`
};

const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const kardiaTool = KardiaTool.default('http://10.10.0.251:8545');
const kardiaApi = kardiaTool.api;
const kardiaCommon = kardiaTool.common;

const publicKey = '0x886906c1BF89bD5a5265bc3fccC9C4E053F52050';
const privateKey = '0xc4395b185c2faf69a9e0703b809459d2a72afb7b3e69e48403e8fc3b73b9c8a4';

// Give the fucking free KAI to users
app.get('/giveFaucet', cors(corsOptions), function (req, res, next) {
  function closeDb() {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }

  const address = req.query.address;
  // Check if address is valid
  if (!kardiaUtils.isAddress(address)) {
    return res.send('Error: Invalid address.');
  }

  // Function to excute faucet request
  function executeFaucet(address) {
    kardiaApi.accountNonce(publicKey).then((nonce) => {
      const tx = kardiaCommon.txGenerator(
        address,
        100000000000000000000, // 100 KAI
        nonce,
        1 /* gasPrice */,
        1000 /* gasLimit */);
      const signedTx = kardiaCommon.sign(tx, privateKey);

      return kardiaApi.sendSignedTransaction(signedTx.rawTransaction).then((txHash) => {
        console.log("Transaction hash: ", txHash);
        res.send({ 
          txHash: txHash
        });
        return true;
      }, (error) => {
        res.send({
          error: error.message
        });
        return error;
      });
    }, (error) => {
      closeDb();
      res.send({
        error: error.message
      });
      return error;
    });
  }

  // Create sqlite instance
  const db = new sqlite.Database('./faucet.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    db.run('CREATE TABLE IF NOT EXISTS users(address TEXT, last_faucet INTEGER)');
    console.log('Connected to the database.');
  });

  // SQLite querries
  const query_select = 'SELECT last_faucet FROM `users` WHERE address = ?';
  const query_insert = 'INSERT INTO users(address, last_faucet) VALUES(?, ?)';
  const query_update = 'UPDATE users SET last_faucet = ? WHERE address = ?';

  const timeNow = Date.now();
  const one_day = 86400000; // one day to milliseconds

  // Select row by address
  function queryAll() {
    return new Promise((resolve, reject) => {
      db.all(query_select, [address], (err, rows) => {
        if (err) {
          console.log('Select error');
          console.error(err.message);
          return reject(err);
        }
        return resolve(rows)
      })
    });
  }

  queryAll().then(rows => {
    if (rows.length === 0) {
      console.log("Address: ", address);
      db.run(query_insert, [address, timeNow], (err) => {
        if (err) {
          console.log('Insert error');
          console.error(err.message);
        }
        console.log('Data has been inserted!');
        return executeFaucet(address);
      });
    }

    // Check if last_faucet is more than one day
    if ((rows.length > 0) && (timeNow - rows[0].last_faucet >= one_day)) {

      db.run(query_update, [timeNow, address], (err) => {
        return executeFaucet(address);
      });
    }

    // Or calculate the next faucet
    if ((rows.length > 0) && (timeNow - rows[0].last_faucet < one_day)) {
      res.send({
        warning: `Next faucet will be avaiable to your address in: ${millisecondToHMS(rows[0].last_faucet + one_day - timeNow)}. Please comeback later!`
      });
    }
    closeDb();
  });

});

const server = app.listen(8181, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Faucet server is running at http://${host}:${port}`)
});