"use strict";
const HttpResponse = use("App/Controllers/Http/HttpResponse");
const Operation = use("App/Operations/Operation");
const User = use("App/Models/User");
const Hash = use("Hash");

class AuthOperation extends Operation {
  constructor() {
    super();

    this.username = null;
    this.password = null;
  }

  static get scenarios() {
    return {
      LOGIN: "login"
    };
  }

  get rules() {
    const rules = {};

    const { LOGIN } = AuthOperation.scenarios;

    const customRules = {
      [LOGIN]: {
        username: "required",
        password: "required"
      }
    };

    return this.setRules(rules, customRules);
  }

  async login() {
    this.scenario = AuthOperation.scenarios.LOGIN;

    let valid = await this.validate();

    if (!valid) {
      return false;
    }

    try {
      let user = await User.findBy("username", this.username);

      if (user) {
        let pass = await Hash.verify(this.password, user.password);

        if (!pass) {
          this.addError(
            HttpResponse.STATUS_UNATHORIZED,
            "Invalid username or password"
          );
          return false;
        }

        if (pass) {
          return user;
        }
      }

      if (!user) {
        this.addError(
          HttpResponse.STATUS_NOT_FOUND,
          "Invalid username or password"
        );
        return false;
      }
    } catch (error) {
      this.addError(HttpResponse.STATUS_UNATHORIZED, "Something wen wrong!");
      return false;
    }
  }
}

module.exports = AuthOperation;
