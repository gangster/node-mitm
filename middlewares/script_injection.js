var util = require('util'),
    colors = require('colors'),
    fs = require("fs");

exports.scriptInjection = function(exploit) {
  var filepath = __dirname + "/../exploits/" + exploit + ".js";
  var exploit = fs.readFileSync(filepath, 'utf8');
  var payload = "<script type='text/javascript'>" + exploit + "</script>"
  return function(response) { response.write(payload); }
}