module.exports = function(app) {
  app.get('/', function(req, res){ 
    res.render('index');
  });

  app.get('/status', function(req, res){ 
    res.send(200);
  });
}
