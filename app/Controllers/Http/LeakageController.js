'use strict'
const LeakageEvent = use('App/Models/LeakEvent')
const LineMaster = use('App/Models/MasterLine')

class LeakageController {
  async getLekage({params,request,response,auth}){
    let leakList = await LeakageEvent.query().where('line_id',params.id ).orderBy('created_at','desc').fetch()
    let lineMaster = await LineMaster.find(params.id)

    let leakageList = []
    for(let i=0;i<leakList.rows.length;i++){
      let data ={
        leakId:leakList.rows[i].id,
        created_at:leakList.rows[i].created_at,
        solved:leakList.rows[i].solved,
        lineData:lineMaster
      }

      leakageList.push(data)

    }
    return response.json(leakageList)
  }

  async setLeakageIntoSolved({params,request,response,auth}){
    let leakList = await LeakageEvent.find(params.id)
    leakList.solved = 1
    await leakList.save()

    return response.json({message:"success"})
  }
}

module.exports = LeakageController
