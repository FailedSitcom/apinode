'use strict';

var express = require("express");
var app = express();

var dateFormat = require('dateformat');
var Pipedrive = require('pipedrive');
var Zendesk = require('zendesk-node-api');

var zendeskUrl   = process.env.zendeskUrl;
var zendeskEmail = process.env.zendeskEmail;
var zendeskToken = process.env.zendeskToken;
var pipedriveKey = process.env.pipedriveKey;

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

function zendeskSearch() {
  zendesk.search.list('query=type:ticket status:new status:open created>2017-01-01').then(function(results){
      results.forEach(function(result) {
          console.log("Zendesk Ticket created at " + dateFormat(result.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
          console.log(result.subject);
      });
  });
}

zendeskSearch();

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express server is listening on port", port)
});
