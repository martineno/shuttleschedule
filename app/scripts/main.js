require.config({
	paths: {
		jquery: '../bower_components/jquery/jquery',
		bootstrap: 'vendor/bootstrap'
	},
	shim: {
		bootstrap: {
			deps: ['jquery'],
			exports: 'jquery'
		}
	}
});

require(['app', 'jquery', 'bootstrap'], function (App, $) {
	'use strict';
	$(function() {
		var ss = new App();
		ss.setupEventHandlers();
		ss.setTime('h1');
		ss.timeUpdater('h1', 1000);

		var shuttles = ss.findNextShuttle('table');
		ss.applyLabelsOn(shuttles, 'Arriving next', ['label', 'label-info', 'arriving']);
	});
});
