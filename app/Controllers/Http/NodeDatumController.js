"use strict";

const Database = use("Database");

class NodeDatumController {

  async eventData({ params,request, response }) {
   let data =  await Database.raw("call nodeData('"+params.id+"','"+ params.flow+"','"+ params.pressure+"','0')");

    return response.json({succes:1}, 200);
  }
}

module.exports = NodeDatumController;
