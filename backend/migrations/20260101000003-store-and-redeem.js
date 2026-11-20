'use strict';

const fs = require('fs');
const path = require('path');

const run = (db, direction) =>
  db.runSql(
    fs.readFileSync(path.join(__dirname, 'sqls', `20260101000003-store-and-redeem-${direction}.sql`), 'utf8'),
  );

exports.up = (db) => run(db, 'up');
exports.down = (db) => run(db, 'down');
exports._meta = { version: 1 };
