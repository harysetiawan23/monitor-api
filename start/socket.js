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
const NodeRecap = use("App/Models/NodeRecap");
const LeakEvent = use("App/Models/LeakEvent");
const User = use("App/Models/User");

var FCM = require("fcm-node");
var serverKey =
  "AAAAbIajuFE:APA91bEtJXhoPCWTySghFp2-39H48_quizBFHjGmIBv99eV1PcJF5FMOROG04BD5cYphbgn8EzjNBRYMey4OgdgeeZTU9mQ-0mbDWXaiD38N10QpANIexjXeWySynSmoX6ullK-S-2jv";
var fcm = new FCM(serverKey);

Ws.channel("chat", ({ socket }) => {
  console.log("user joined with %s socket id", socket.id);
});

const { io } = use("App/Socket/Socket");
io.on("connection", function(socket) {
  console.log(socket.id);
});

const checkLineLeakage = async io => {
  let lineData = await MasterLine.all();
  for (let i = 0; i < lineData.rows.length; i++) {
    let lineRecord = await NodeRecap.query()
      .where("line_id", lineData.rows[i].id)
      .orderBy("created_at", "desc")
      .first();

    // Line Master
    let lineMaster = await MasterLine.find(lineData.rows[i].id);

    // Line Pressure
    let lineFlowLeak = parseFloat(
      (lineRecord.flow_leak_ratio * 100).toFixed(1)
    );
    let linePressureLeak = parseFloat(
      (lineRecord.pressure_leak_ratio * 100).toFixed(1)
    );
    let lineLeakageTreshold = parseFloat(
      (lineMaster.leakage_treshold * 100).toFixed(1)
    );

    // Check if leakage is more thean treshold
    if (lineFlowLeak > lineLeakageTreshold) {
      let leakageData = {
        line_id: lineData.rows[i].id,
        informed: 0,
        solved: 0,
        user_id: lineMaster.user_id
      };

      let latestLeakageInfo = await LeakEvent.query().where("line_id", lineData.rows[i].id).orderBy("created_at", "desc").first();

      if (latestLeakageInfo == null && lineFlowLeak > lineLeakageTreshold) {
        await LeakEvent.create(leakageData);
      } else {
        if (parseInt(latestLeakageInfo.solved) != 1) {
        } else {
          await LeakEvent.create(leakageData);
        }
      }
    } else {
    }
  }
};

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

const sendLekagaeNotification = async io => {
  let lekagaeEvent = await LeakEvent.query()
    .where("informed", "=", "0")
    .fetch();
  for (let i = 0; i < lekagaeEvent.rows.length; i++) {
    let user = await User.find(lekagaeEvent.rows[i].user_id);
    let leakageEventItem = lekagaeEvent.rows[i];
    let lineMaster = await MasterLine.find(leakageEventItem.line_id);

    let lineLekaage = await LeakEvent.find(leakageEventItem.id);
    lineLekaage.informed = 1;
    console.log(lineLekaage);
    await lineLekaage.save();


    if (leakageEventItem.solved == 0) {
      let message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: user.fcm,
        collapse_key: "Test Message",

        notification: {
          title: "Kebocoran",
          body: "Terjadi kebocoran pada " + lineMaster.name + " "
        },

        data: {
          //you can send only notification or only data(or include both)
          my_key: "my value",
          my_another_key: "my another value"
        }
      };

      await fcm.send(message, function(err, response) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);

        }
      });


    }
  }
};

setInterval(checkLineLeakage, 1000, io);
setInterval(getLineRecords, 1000, io);
setInterval(getLineStat, 1000, io);
setInterval(sendLekagaeNotification, 5000, io);
