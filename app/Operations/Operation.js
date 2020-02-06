const Validator = use("Validator");

/**
 * Operation base class
 *
 * @author glevinzon1995 <glevinzon1995@gmail.com>
 */
class Operation {
  constructor(params) {
    this.validator = Validator;
    this.errors = [];
  }

  /**
   * Get the validation rules
   *
   * @returns Object
   */
  get rules() {
    return {};
  }

  /**
   * Set validation rules
   *
   * @param Object defaultRules
   * defaultRules = {
   *  key: rule
   * }
   *
   * @param Object customRules
   * customRules = {
   *  [scenario]: {
   *    key: rule,
   *  },
   *  [anotherScenario]: {
   *    key: rule,
   *  }
   * }
   *
   * @returns Object
   */
  setRules(defaultRules, customRules) {
    // Get rules by scenario
    let handledRules = customRules[this.scenario];

    if (handledRules) {
      // Merge default rules to selected rules for scenario
      handledRules = Object.assign({}, defaultRules, handledRules);
    }

    // Return default rules if handled rules do not exist
    return handledRules ? handledRules : defaultRules;
  }

  /**
   * Get the error messages for each rules
   *
   * @returns Object
   */
  get messages() {
    return {
      required: "{{field}} is required.",
      required_when: "{{field}} is required.",
      regex: "Invalid {{field}} format."
    };
  }

  /**
   * Adds an error code and message to the array of errors
   *
   * @param int errorCode
   * @param String errorMessage
   */
  addError(code, message) {
    this.errors.push({ code, message });
  }

  /**
   * Validate the properties
   *
   * @returns bool
   */
  async validate(obj = null, rules = null) {
    let model = obj ? obj : this;
    let validatorRules = rules ? rules : this.rules;

    let validation = await this.validator.validate(
      model,
      validatorRules,
      this.messages
    );
    if (validation.fails()) {
      this.errors = validation.messages().map(error => {
        return {
          code: 400,
          message: error.message
        };
      });

      return false;
    }

    return true;
  }

  /**
   * Get the error messages
   *
   * @returns Array
   */
  getFirstError() {
    return this.errors[0];
  }
}

module.exports = Operation;
