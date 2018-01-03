const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const app = express();
const db = require('./db/index.js')
const apiHelp = require('./APIhelper.js');
const bodyParser = require('body-parser');
const compiler = webpack(webpackConfig);
 
app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json());

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
})); 

app.get('/helper', (req, res) => {
  apiHelp.couponHelper(60007, (data) => {
    for(var i = 0; i < data.deals.length; i++) {
      var eachDeal = data.deals[i]
      db.Coupons.findOrCreate({where:{imgUrl: eachDeal.deal.image_url, title: eachDeal.deal.title, price: eachDeal.deal.price,
        discount: eachDeal.deal.discount_percentage, merchant: eachDeal.deal.merchant.name, finePrint: null,
        description: null, url: eachDeal.deal.url}})
    }
    res.status(200).send('done!')
  })
})

  app.set('port', process.env.PORT || 3000)
 
  const server = app.listen(app.get('port'))
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);


