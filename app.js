'use strict';

var express = require("express");
var app = express();

var jsonParser = require("body-parser").json;
var logger = require("morgan");
var dateFormat = require('dateformat');

var Zendesk = require('zendesk-node-api');
var zendesk = new Zendesk({
  url: zendeskUrl,
  email: zendeskEmail,
  token: zendeskToken
});

var Pipedrive = require('pipedrive');
var pipedrive = new Pipedrive.Client(pipedriveKey, { strictMode: true });

app.use(logger("dev"));

//pipedrive.Notes.getAll({}, function(err, notes) {
//    if (err) throw err;
//    for (var i = 0; i < notes.length; i++) {
//        console.log(notes[i].org_id);
//    }
//});

zendesk.search.list('query=type:ticket status:new status:open created:>1hours').then(function(results){
    results.forEach(function(result) {
        console.log("Zendesk Ticket created at " + dateFormat(result.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
        console.log(result.subject);
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Express server is listening on port", port)
});
