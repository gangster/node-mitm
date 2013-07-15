var util = require('util'),
    colors = require('colors'),
    fs = require("fs");

exports.gsub = function(regex, target) {
  return function(chunk) {
    return chunk.replace(regex, target);
  }
}