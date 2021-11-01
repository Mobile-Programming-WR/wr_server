const responseMd = async (ctx) => {
  const { body } = ctx.state;
  ctx.state = 200;
  ctx.body = body;
};

export default responseMd;
