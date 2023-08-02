import {Joi, Segments, celebrate} from "celebrate";

class UserValidator {
  static signup = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  });
}

export default UserValidator;
