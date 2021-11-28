const errorHandleMd = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    /* eslint-disable no-alert, no-console */
    console.log(err);
    if (err.isBoom) {
      ctx.status = err.output.statusCode;
      ctx.body = {
        erorr: err.output.payload.error,
        message: err.output.payload.message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: "internal server errorr",
        message: "internal server errorr",
      };
    }
  }
};

export default errorHandleMd;
