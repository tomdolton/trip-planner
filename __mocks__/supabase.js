module.exports = {
  createClient: () => ({
    from: () => ({
      update: () => ({ eq: () => ({ error: null }) }),
    }),
  }),
};
