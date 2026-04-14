const validate = (schema) => (req, res, next) => {
  const data = { ...req.body, ...req.params };
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};

export default validate;
