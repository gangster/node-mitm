// Load the Mitm DSL
Mitm = require('./dsl/mitm').Mitm;

// Load the script injection middleware
scriptInjection = require('./middlewares/script_injection').scriptInjection;
gsub = require('./middlewares/gsub').gsub;

// Go!
Mitm.before(scriptInjection("alert")). // Execute the middleware before page load
     frame(gsub(/cloud/ig,"Ass")).     // Execute the middleware against each frame
     after(scriptInjection("alert")).  // Execute the middleware after page load
     start(8000); // port
