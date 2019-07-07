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
  Route.get("node", "MasterNodeController.showAll").middleware(['auth']);
  Route.get("node/:id", "MasterNodeController.show").middleware(['auth']);
  Route.post("node", "MasterNodeController.store").middleware(['auth']);
  Route.post("node/:id", "MasterNodeController.update").middleware(['auth']);
  Route.post("node/drop/:id", "MasterNodeController.drop").middleware(['auth']);

  Route.get("line", "MasterLineController.showAll").middleware(['auth']);
  Route.get("line/:id", "MasterLineController.show").middleware(['auth']);
  Route.post("line", "MasterLineController.store").middleware(['auth']);
  Route.post("line/:id", "MasterLineController.update").middleware(['auth']);
  Route.post("line/drop/:id", "MasterLineController.drop").middleware(['auth']);

  Route.get("record/store/:id/:flow/:pressure", "NodeDatumController.eventData").middleware(['auth']);

  Route.post("user/store","UserAuthController.store")
  Route.post("user/login","UserAuthController.login")
}).prefix("/api");


Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
