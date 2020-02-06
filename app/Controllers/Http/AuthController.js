"use strict";
const { HttpException } = use("node-exceptions");
const User = use("App/Models/User");
const AuthOperation = use("App/Operations/AuthOperation");

class AuthController {
  async login({ auth, request, response }) {
    let op = new AuthOperation();
    let { username, password } = request.all();
    op.username = username;
    op.password = password;

    let userInfo = await op.login();

    if (!userInfo) {
      let error = op.getFirstError();
      throw new HttpException(error.message, error.code);
    }
    if (userInfo) {
      var { token } = await auth.generate(userInfo);
    }

    let user = await User.find(userInfo.id);
    response.send({ data: { user, accessToken: token } });
  }
}

module.exports = AuthController;
