"use strict";

const MasterNode = use("App/Models/MasterNode");
const { validate } = use("Validator");

class MasterNodeController {

  async showAll({response,request,auth}){
    let masterNode = await MasterNode.query().fetch()
    return response.json(masterNode)
  }

  async show({params,response,request,auth}){
    let masterNode = await MasterNode.find(params.id)
    return response.json(masterNode)
  }

  async store({ request, response, auth }) {
    let validationProcess = await validate(request.all(), {
      sn: "required|unique:master_nodes,sn",
      phone_number: "required",
      lat: "required",
      lng: "required",
      isStartNode: "required",
      pressOffset: "required",
      liquidFlowKonstanta: "required",
      flow_rate_model: "required",
      pressure_tranducer_model: "required"
    });

    if (validationProcess.fails()) {
      return response.json({ message: validationProcess.messages() });
    }

    let node = request.all();
    node.user_id = "1";
    let newNode = await MasterNode.create(request.all());

    return response.json(newNode);
  }

  async update({ params, request, response, auth }) {
    let validationProcess = await validate(request.all(), {
      sn: "required",
      phone_number: "required",
      lat: "required",
      lng: "required",
      isStartNode: "required",
      pressOffset: "required",
      liquidFlowKonstanta: "required",
      flow_rate_model: "required",
      pressure_tranducer_model: "required"
    });

    if (validationProcess.fails()) {
      return response.json({ message: validationProcess.messages() });
    }

    let nodeMaster = await MasterNode.find(params.id);

    nodeMaster.sn = request.all().sn;
    nodeMaster.phone_number = request.all().phone_number;
    nodeMaster.lat = request.all().lat;
    nodeMaster.lng = request.all().lng;
    nodeMaster.isStartNode = request.all().isStartNode;
    nodeMaster.pressOffset = request.all().pressOffset;
    nodeMaster.liquidFlowKonstanta = request.all().liquidFlowKonstanta;
    nodeMaster.flow_rate_model = request.all().flow_rate_model;
    nodeMaster.pressure_tranducer_model = request.all().pressure_tranducer_model;

    let saved = await nodeMaster.save();

    if (!saved) {
      return response.json({ error: "database not connected" }, 200);
    } else {
      return response.json(nodeMaster, 200);
    }
  }

  async drop({params,request,response,auth}){
    let dropNodeMaster = await MasterNode.find(params.id)

    let dropAction = await dropNodeMaster.delete()
    if(!dropAction){
      return response.json({ error: "database not connected" }, 200);
    }else{
      return response.json({ success: "delete from database" }, 200);
    }
  }
}

module.exports = MasterNodeController;
