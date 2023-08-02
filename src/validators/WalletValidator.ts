import {Joi, Segments, celebrate} from "celebrate";

class WalletValidator {
  static fund = celebrate({
    [Segments.BODY]: Joi.object().keys({
      amount: Joi.number().min(1).required(),
      user: Joi.object(),
    }),
  });
}

export default WalletValidator;
