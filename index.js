var express = require("express");
var app = express();

var dateFormat = require('dateformat');
var Pipedrive = require('pipedrive');
var Zendesk = require('zendesk-node-api');

var zendeskUrl   = process.env['zendeskUrl'];
var zendeskEmail = process.env['zendeskEmail'];
var zendeskToken = process.env['zendeskToken'];
var pipedriveKey = process.env['pipedriveKey'];

var zendesk = new Zendesk({
    url: zendeskUrl,
    email: zendeskEmail,
    token: zendeskToken
});

var pipedrive = new Pipedrive.Client(pipedriveKey, {
    strictMode: true
});


function zendeskSearch() {
    zendesk.search.list('query=type:ticket status:new status:open created>24hours').then(function(results) {
        results.forEach(function(result) {
            pipedrive.Organizations.find({
                term: result.custom_fields[0].value
            }, function(err, organization) {
                if (err) throw err;
                if (organization.length > 0) {
                    organization[0].getDeals(function(dealsErr, deals) {
                        if (dealsErr) throw dealsErr;
                        if (result.subject.indexOf('[TEST]') == -1) {
                            if (result.subject.indexOf('New custom question was added') == -1) {
                                if (result.subject.indexOf('New registration') == -1) {
                                    pipedrive.Notes.add({
                                            deal_id: deals[0].id,
                                            content: "Zendesk Ticket created at " + dateFormat(result.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT") +
                                                " ---- " + result.subject
                                        },
                                        function(addErr, addData) {
                                            if (addErr) throw addErr;
                                            console.log('Note successfully added', addData);
                                        });
                                }
                            }
                        }
                    });
                } else {
                    pipedrive.Persons.find({
                        term: result.via.source.from.address
                    }, function(err, person) {
                        if (err) throw err;
                        if (person.length > 0) {
                            person[0].getDeals(function(dealsErr, deals) {
                                if (dealsErr) throw dealsErr;
                                if (result.subject.indexOf('[TEST]') == -1) {
                                    if (result.subject.indexOf('New custom question was added') == -1) {
                                        if (result.subject.indexOf('New registration') == -1) {
                                            pipedrive.Notes.add({
                                                    deal_id: deals[0].id,
                                                    content: "Zendesk Ticket created at " + dateFormat(result.created_at, "dddd, mmmm dS, yyyy, h:MM:ss TT") +
                                                        " ---- " + result.subject
                                                },
                                                function(addErr, addData) {
                                                    if (addErr) throw addErr;
                                                    console.log('Note successfully added', addData);
                                                });
                                        }
                                    }
                                }
                            });
                        } else {
                            console.log("undefined");
                        }
                    });
                }
            });
        });
    });
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
    zendeskSearch();
});
