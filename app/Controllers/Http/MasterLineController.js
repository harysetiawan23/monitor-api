"use strict";
const { validate } = use("Validator");
const MasterLine = use("App/Models/MasterLine");
const Database = use("Database");

class MasterLineController {
  async showAll({ response, request, auth }) {
    let masterLine = await Database.raw(
      "select lm.*," +
        "(select nm.sn from master_nodes nm where nm.id = lm.start_node_id)           as startNodeSN," +
        "(select nm.sn from master_nodes nm where nm.id = lm.end_node_id)             as EndNodeSN," +
        "(select nm.phone_number from master_nodes nm where nm.id = lm.start_node_id) as startNodePhone," +
        "(select nm.phone_number from master_nodes nm where nm.id = lm.end_node_id)   as endNodePhone," +
        "(select nm.lat from master_nodes nm where nm.id = lm.start_node_id)          as startNodeLat," +
        "(select nm.lng from master_nodes nm where nm.id = lm.start_node_id)          as startNodeLng," +
        "(select nm.lat from master_nodes nm where nm.id = lm.end_node_id)            as endNodeLat," +
        "(select nm.lng from master_nodes nm where nm.id = lm.end_node_id)            as endNodeLng" +
        " from master_lines lm" +
        " where lm.user_id = " +
        auth.user.id
    );
    return response.json(masterLine[0]);
  }

  async show({ params, response, request, auth }) {
    let masterLine = await Database.raw(
      "select lm.*," +
        "(select nm.sn from master_nodes nm where nm.id = lm.start_node_id)           as startNodeSN," +
        "(select nm.sn from master_nodes nm where nm.id = lm.end_node_id)             as EndNodeSN," +
        "(select nm.phone_number from master_nodes nm where nm.id = lm.start_node_id) as startNodePhone," +
        "(select nm.phone_number from master_nodes nm where nm.id = lm.end_node_id)   as endNodePhone," +
        "(select nm.lat from master_nodes nm where nm.id = lm.start_node_id)          as startNodeLat," +
        "(select nm.lng from master_nodes nm where nm.id = lm.start_node_id)          as startNodeLng," +
        "(select nm.lat from master_nodes nm where nm.id = lm.end_node_id)            as endNodeLat," +
        "(select nm.lng from master_nodes nm where nm.id = lm.end_node_id)            as endNodeLng" +
        " from master_lines lm" +
        " where lm.user_id = " +
        auth.user.id +
        " and lm.id = " +
        params.id
    );
    return response.json(masterLine[0][0]);
  }

  async store({ request, response, auth }) {
    let validator = await validate(request.all(), {
      name: "required",
      start: "required",
      end: "required",
      start_node_id: "required",
      end_node_id: "required",
      distance: "required",
      diameter: "required",
      thicknes: "required",
      manufacture: "required",
      flow_leakage_treshold: "required",
      pressure_check_duration:'required',
      pressure_leakage:'required'
    });

    if (validator.fails()) {
      return response.json({ errors: validator.messages() }, 401);
    }

    let line = request.all();
    line.user_id = auth.user.id;

    let masterLine = await MasterLine.create(line);

    if (!masterLine.save()) {
      return response.json({ error: "database not connected" }, 400);
    }

    return response.json(masterLine, 200);
  }

  async update({ request, response, auth, params }) {
    let validator = await validate(request.all(), {
      name: "required",
      start: "required",
      end: "required",
      start_node_id: "required",
      end_node_id: "required",
      distance: "required",
      diameter: "required",
      thicknes: "required",
      manufacture: "required",
      flow_leakage_treshold: "required",
      pressure_check_duration:'required',
      pressure_leakage:'required'
    });

    if (validator.fails()) {
      return response.json({ errors: validator.messages() }, 401);
    }

    let lineMaster = await MasterLine.find(params.id);

    lineMaster.name = request.all().name;
    lineMaster.start = request.all().start;
    lineMaster.end = request.all().end;
    lineMaster.start_node_id = request.all().start_node_id;

    lineMaster.distance = request.all().distance;
    lineMaster.diameter = request.all().diameter;
    lineMaster.thicknes = request.all().thicknes;
    lineMaster.manufacture = request.all().manufacture;

    lineMaster.end_node_id = request.all().end_node_id;
    lineMaster.flow_leakage_treshold = request.all().flow_leakage_treshold;
    lineMaster.pressure_check_duration = request.all().pressure_check_duration;
    lineMaster.pressure_leakage = request.all().pressure_leakage

    if (!lineMaster.save()) {
      return response.json({ error: "database not connected" }, 400);
    }

    return response.json(lineMaster, 200);
  }

  async drop({ params, request, response, auth }) {
    let dropLineMaster = await MasterLine.find(params.id);

    let dropAction = await dropLineMaster.delete();
    if (!dropAction) {
      return response.json({ error: "database not connected" }, 200);
    } else {
      return response.json({ success: "delete from database" }, 200);
    }
  }
}

module.exports = MasterLineController;
