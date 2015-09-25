'use strict';
requirejs.config({
    paths: {
        jquery : '../bower_components/jquery/dist/jquery',
        underscore : '../bower_components/underscore/underscore',
        backbone : '../bower_components/backbone/backbone',
        backboneLocalStorage : '../bower_components/backbone.localStorage/backbone.localStorage',
    },
    shim: {
    	jquery: {exports : '$'},
        underscore : {exports : '_'},
        backbone : {exports : 'Backbone', deps:['underscore', 'jquery']},
        backboneLocalStorage : {deps:['backbone'], exports: 'Store'}
    }
});
define(['views/app'], function(AppView) {
    new AppView();
});
