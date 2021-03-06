/**
 * Blackout plugin
 *
 * Press b or . to hide all slides, and b or . again to show them.
 * Also navigating to a different slide will show them again (impress:stepleave).
 *
 * Copyright 2014 @Strikeskids
 * Released under the MIT license.
 */
/* global document */

(function (document) {
    "use strict";

    var blackedOut = false;
    var api = null;
    var gc = null;
    var util = null;
    var root = null;
    var canvas = null;

    // While waiting for a shared library of utilities, copying these 2 from main impress.js
    var css = function (el, props) {
        var key, pkey;
        for (key in props) {
            if (props.hasOwnProperty(key)) {
                pkey = pfx(key);
                if (pkey !== null) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };

    var pfx = (function () {

        var style = document.createElement("dummy").style,
            prefixes = "Webkit Moz O ms Khtml".split(" "),
            memory = {};

        return function (prop) {
            if (typeof memory[prop] === "undefined") {

                var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + " " + prefixes.join(ucProp + " ") + ucProp).split(" ");

                memory[prop] = null;
                for (var i in props) {
                    if (style[props[i]] !== undefined) {
                        memory[prop] = props[i];
                        break;
                    }
                }

            }

            return memory[prop];
        };

    })();

    var flipBlackout = function (newState) {
        if (newState !== blackedOut) {
            blackedOut = newState !== undefined ? newState : !blackedOut;
            css(canvas, {display: blackedOut ? "none" : "block"});
            util.triggerEvent(root, blackedOut ? "impress:autoplay:pause" : "impress:autoplay:play", {});
            if (newState === undefined) {
                api.goto(document.querySelector(".step.active"), 0);
            }

            if (blackedOut) {
                document.body.classList.add("impress-mouse-timeout");
            } else {
                document.body.classList.remove("impress-mouse-timeout");
            }
        }
    };

    // Wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
        api = event.detail.api;
        gc = api.lib.gc;
        util = api.lib.util;
        root = event.target;
        canvas = root.firstElementChild;

        gc.addEventListener(document, "keydown", function (event) {
            // Accept b or . -> . is sent by presentation remote controllers
            if (event.key === "." || event.key === "b") {
                event.preventDefault();
            }
        }, false);

        gc.addEventListener(document, "keyup", function (event) {
            // Accept b or . -> . is sent by presentation remote controllers
            if (event.key === "." || event.key === "b") {
                event.preventDefault();
                flipBlackout();
            }
        }, false);

        util.triggerEvent(document, "impress:help:add",
            {command: "b or .", text: "to hide/unhide all slides", row: 101});

    }, false);

    document.addEventListener("impress:stepleave", function () {
        flipBlackout(false);
    }, false);

})(document);

