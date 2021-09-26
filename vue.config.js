const CompressionPlugin = require('compression-webpack-plugin')


module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') { //判断是生产环境
      return{
        plugins: [
          new CompressionPlugin({
            algorithm: 'gzip',//开启gzip
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
          })
        ]
      }
    }
  }
}
