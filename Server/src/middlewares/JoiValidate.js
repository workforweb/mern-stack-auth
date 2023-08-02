import Joi from 'joi';
import { pick } from '../utils';

const JoiValiate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({
      errors: { label: 'key' },
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) =>
      details.message.replace(/['"]/g, '')
    );

    return res.status(400).send(errorMessage);
  }
  Object.assign(req, value);
  return next();
};

export default JoiValiate;
