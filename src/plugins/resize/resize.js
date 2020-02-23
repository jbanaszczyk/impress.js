/**
 * Resize plugin
 *
 * Rescale the presentation after a window resize.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 * Released under the MIT license.
 * ------------------------------------------------
 *  author:   Bartek Szopka
 *  modifier: Jacek Banaszczyk
 *  version:  0.5.4
 *  url:      http://bartaz.github.com/impress.js/
 *  source:   http://github.com/bartaz/impress.js/
 *
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    var showWindowSize = function( ) {
        console.log( "width:   " + window.innerWidth );
        console.log( "height:  " + window.innerHeight );
        console.log( "body em: " + parseFloat(getComputedStyle(document.body).fontSize));
    };

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {
        var api = event.detail.api;
        showWindowSize();

        // Rescale presentation when window is resized
        api.lib.gc.addEventListener( window, "resize", api.lib.util.throttle( function() {

            // Force going to active step again, to trigger rescaling
            api.goto( document.querySelector( ".step.active" ), 0 );
            showWindowSize();
        }, 250 ), false );
    }, false );

} )( document, window );
