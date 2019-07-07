"use strict";

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use("Ws");
const MasterLine = use("App/Models/MasterLine");
const Database = use("Database");

Ws.channel("chat", ({ socket }) => {
  console.log("user joined with %s socket id", socket.id);
});

const { io } = use("App/Socket/Socket");
io.on("connection", function(socket) {
  console.log(socket.id);
});

const getLineRecords = async io => {
  let masterLine = await MasterLine.all();

  for (let i = 0; i < masterLine.rows.length; i++) {
    let lineId = masterLine.rows[i].id;
    let chartData = await Database.raw(
      'call lineHourlyRecordMax("' + lineId + '")'
    );

    io.emit("line-record/" + lineId, chartData[0][0]);
  }
};

const getLineStat = async io => {
  let lineStat = await Database.raw("call lineStat()");
  let lineStatData = lineStat[0][0];

  for (let i = 0; i < lineStatData.length; i++) {
    io.emit("line-stat/" + lineStatData[i].id, lineStatData[i]);
  }
};

setInterval(getLineRecords, 1000, io);
setInterval(getLineStat, 1000, io);
