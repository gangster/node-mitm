node-mitm
==================

node-mitm is a lightweight and configurable framework for executing [Man-in-the-middle attacks](http://en.wikipedia.org/wiki/Man-in-the-middle_attack) against victim browsers.  It does this primarily by poisoning the HTTP response.

Attacks can come in many forms, but maintain a consistent structure and can be thought of as simply being payload and exploit pair. Payloads are the vehicle by which exploits get delivered to the client.  Exploits are malicious code the attacker wishes to run victim browsers.

One example attack would be a script injection attack.  In this scenario, the attacker has a an evil script they want deployed to victim browsers so he can take control.  One way he could do this is by writing a <script/> tag containing his code to the browser, which the browser happily executes on his behalf.

node-mitm is designed to be easily extended without having to modify the core features.  This is primarily done by writing middleware and exploits.

Middlewares are configurable functions that generate and deploy payloads to victim browsers at a specified point in the HTTP response's lifecycle.  Put another way, payloads can be configured to deploy before, during, or after writing the response back to the victim.  Additionally, middlewares allow for dynamically configuring payloads with exploits at runtime.  For example, it is possible to configure the script injection middleware with the evil.js exploit, and have it deploy after the page renders.  More on middleware later.  Middleware framework is still undergoing design.  See examples below.

Exploits are functions that execute and mutate the response in some way.  The most common exploits are client-side scripts which the attacker wants to deploy to the user's browser.  Another example would be a function that transforms markup in some way, like the code found in the gsub middleware.

More to follow...

# Changelog
```
  Currently under development
```


# Background
## [Man-in-the-middle](http://en.wikipedia.org/wiki/Man-in-the-middle_attack)
![mitm attack premise](http://f.cl.ly/items/3d0z1p202J1o3s2W3B0E/Screen%20Shot%202013-07-14%20at%209.31.07%20PM.png)


## Prerequisites

node-mitm (currently) assumes you have already setup a fake access point/honeypot.  If you do not know how to do this, check the resources section for links.




### nginx

### node.js (and module dependencies)

### Fake AP Depdencies
#### Backtrack Linux 5r3
* dnspoof
* dhcp3-server
* brctl
* aircrack-ng suite
* wi-fi card with monitoring enable


# Example Usage

```javascript
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

```

# Development

# Resources

* [Wireless Security Megaprimer](http://www.securitytube.net/groups?operation=view&groupId=9)
* [Setup a Fake Access Point with BackTrack 5](http://exploit.co.il/hacking/set-fake-access-point-backtrack5/)
* [Hak 5 Forums](http://forums.hak5.org/)

# People
* Josh Deeden (gangster@github)


