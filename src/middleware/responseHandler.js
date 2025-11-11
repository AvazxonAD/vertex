const responseHandler = (req, res, next) => {
  res.success = (data = null, message = "Success", statusCode = 200, meta = null) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      meta,
    });
  };

  res.error = (message = "Something went wrong", statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};

module.exports = responseHandler;
