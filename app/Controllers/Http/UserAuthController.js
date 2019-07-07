'use strict'

const User = use('App/Models/User')
const { validate } = use("Validator");

class UserAuthController {
  async store({request,response,auth}){
    let validator = await validate(request.all(), {
      'name' : 'required',
      'email' : 'required|email',
      'password' : 'required',
      'c_password' : 'required|same:password',
    });

  if (validator.fails()) {
      return response.json({'errors' : validator.messages()}, 401);
  }



  let input = request.all();

  delete input.c_password;
  let user = await User.create(input);


  let success = {
    token: auth.generate(user).token,
    data:user
  }


  return response.json(success);
  }
}

module.exports = UserAuthController
