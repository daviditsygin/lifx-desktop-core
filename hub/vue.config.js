module.exports = {
    runtimeCompiler: true,
    devServer: {
      proxy: 'http://localhost:12962'
    },
    publicPath: '/shine/'
  }