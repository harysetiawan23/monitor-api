"use strict";

const User = use("App/Models/User");
const { validate } = use("Validator");

class UserAuthController {
  async store({ request, response, auth }) {
    let validator = await validate(request.all(), {
      name: "required|unique:users,name",
      email: "required|email|unique:users,email",
      password: "required",
      c_password: "required|same:password"
    });

    if (validator.fails()) {
      return response.json({ errors: validator.messages() }, 401);
    }

    let input = request.all();

    delete input.c_password;
    let user = await User.create(input);

    //Generate a Token for User
    let userToken = await auth.generate(user);

    //Message for result
    Object.assign(user, userToken);

    return response.json(user);
  }

  async login({ request, response, auth }) {
    //Validation Role
    let loginRule = {
      email: "required",
      password: "required",
      fcm:"required"
    };

    //Validation Process
    let validationProccess = await validate(request.all(), loginRule);

    //Validation Exceptions
    if (validationProccess.fails()) {
      return response.json(validationProccess.messages(), 200);
    }

    //Get email and password
    let { email, password ,fcm} = request.all();

    let {type,token,refreshToken,field,message} = await auth.withRefreshToken().attempt(email, password);

    if (!token) {
      const messages = {
        code: 500,
        status: "failed",
        action: "login",
        message: message
      };
      return response.json(messages, 200);
    }

    let user = await User.findBy("email", email);
    user.fcm = fcm
    await user.save()



    Object.assign(user, { token: token, refreshToken: refreshToken });


    return response.json(user, 200);
  }
}

module.exports = UserAuthController;
