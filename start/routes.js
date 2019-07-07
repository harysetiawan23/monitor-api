'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get("node", "MasterNodeController.showAll");
  Route.get("node/:id", "MasterNodeController.show");
  Route.post("node", "MasterNodeController.store");
  Route.post("node/:id", "MasterNodeController.update");
  Route.post("node/drop/:id", "MasterNodeController.drop");

  Route.get("line", "MasterLineController.showAll");
  Route.get("line/:id", "MasterLineController.show");
  Route.post("line", "MasterLineController.store");
  Route.post("line/:id", "MasterLineController.update");
  Route.post("line/drop/:id", "MasterLineController.drop");

  Route.get("record/store/:id/:flow/:pressure", "NodeDatumController.eventData");
}).prefix("/api");


Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
