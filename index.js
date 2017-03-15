var express = require("express");
var app = express();

var dateFormat = require('dateformat');
var Pipedrive = require('pipedrive');
var Zendesk = require('zendesk-node-api');

var zendeskUrl   = process.env.zendeskUrl;
var zendeskEmail = process.env.zendeskEmail;
var zendeskToken = process.env.zendeskToken;
var pipedriveKey = process.env.pipedriveKey;

function zendeskSearch() {
  zendesk.search.list('query=type:ticket status:new status:open created>2017-01-01').then(function(results){
      results.forEach(function(result) {
          console.log("Zendesk Ticket created at " + dateFormat(result.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
          console.log(result.subject);
      });
  });
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  zendeskSearch();
});


var zendesk = new Zendesk({
  url: zendeskUrl,
  email: zendeskEmail,
  token: zendeskToken
});

// var pipedrive = new Pipedrive.Client(pipedriveKey, { strictMode: true });

//pipedrive.Notes.getAll({}, function(err, notes) {
//    if (err) throw err;
//    for (var i = 0; i < notes.length; i++) {
//        console.log(notes[i].org_id);
//    }
//});
