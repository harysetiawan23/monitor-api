"use strict";
const { validate } = use("Validator");
const MasterLine = use("App/Models/MasterLine");

class MasterLineController {

  async showAll({response,request,auth}){
    let masterLine = await MasterLine.query().fetch()
    return response.json(masterLine)
  }

  async show({params,response,request,auth}){
    let masterLine = await MasterLine.find(params.id)
    return response.json(masterLine)
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
      manufacture: "required"
    });

    if (validator.fails()) {
      return response().json({ errors: validator.messages() }, 401);
    }

    let line = request.all();
    line.user_id = "1";

    let masterLine = await MasterLine.create(line);

    if (!masterLine.save()) {
      return response.json({ error: "database not connected" }, 400);
    }

    return response.json(masterLine, 200);
  }

  async update({request,response,auth,params}){
    let validator = await validate(request.all(), {
      name: "required",
      start: "required",
      end: "required",
      start_node_id: "required",
      end_node_id: "required",
      distance: "required",
      diameter: "required",
      thicknes: "required",
      manufacture: "required"
    });

    if (validator.fails()) {
      return response().json({ errors: validator.messages() }, 401);
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


    if(!lineMaster.save()){
        return response.json({'error':'database not connected'}, 400);
    }

    return response.json(lineMaster, 200);
  }

  async drop({params,request,response,auth}){
    let dropLineMaster = await MasterLine.find(params.id)

    let dropAction = await dropLineMaster.delete()
    if(!dropAction){
      return response.json({ error: "database not connected" }, 200);
    }else{
      return response.json({ success: "delete from database" }, 200);
    }
  }
}

module.exports = MasterLineController;
