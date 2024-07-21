// ==UserScript==
// @name BCDND Loader
// @namespace https://www.bondageprojects.com/
// @version 1
// @description 
// @author Natalie
// @downloadURL  https://github.com/apathy23/BCDnD/raw/main/bcdndLoader.user.js
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match http://localhost:*/*
// @grant none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement("script");
    script.src = "https://apathy23.gitlab.io/index.js";
    document.head.appendChild(script);
})();