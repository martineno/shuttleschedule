/*global define */
define(['jquery'], function ($) {
	'use strict';

	function ShuttleSchedule() {
		this.timerId = null;
	}

	ShuttleSchedule.prototype.timeUpdater = function(timeDestination, frequency) {
		if (this.timerId) {
			clearTimeout(this.timerId);
		}

		this.timerId = setInterval(function() {
			var now = new Date();
			$(timeDestination).text(now.getHours() + ':' + now.getMinutes());
		}, frequency);
	};

	/**
	 * Given a reference to the table, returns the table data reference
	 * that contains the next departi shuttle
	 * @param  {STring} table The string representing the selector for the table
	 * @return {Object}       The jQuery object that represents the data table data
	 */
	ShuttleSchedule.prototype.findNextShuttle = function(table) {
		var toTownsend = this.getToTownsendArray(table),
			toMarket = this.getToMarketArray(table),
			now = new Date(),
			minutesSinceMidnight = now.getHours() * 60 + now.getMinutes(),
			nextArrival = function(array) {
				var result = array.reduce(function(previousValue, item) {
					if (previousValue === null && item.minutesSinceMidnight > minutesSinceMidnight) {
						return item;
					}

					return previousValue;
				}, null);

				if (result === null) {
					return $();
				} else {
					return result.$dom;
				}
			};

		return nextArrival(toTownsend).add(nextArrival(toMarket));
	};

	ShuttleSchedule.prototype.getToTownsendArray = function(table) {
		return this.getScheduleArray(table, 'tr td:first-child');
	};

	ShuttleSchedule.prototype.getToMarketArray = function(table) {
		return this.getScheduleArray(table, 'tr td:nth-child(2)');
	};

	ShuttleSchedule.prototype.getScheduleArray = function(table, dataSelector) {
		var $scheduleData = $(table + ' ' + dataSelector),
			result = [];
		$scheduleData.each(function() {
			var $this = $(this),
				hours = parseInt($this.data('hour'), 10),
				minutes = parseInt($this.data('minute'), 10),
				minutesSinceMidnight = hours * 60 + (minutes ? minutes : 0);

			result.push({
				minutesSinceMidnight: minutesSinceMidnight,
				$dom: $this
			});
		});

		return result;
	};

	ShuttleSchedule.prototype.applyLabelsOn = function($elements, label, style) {
		var $label = $('<span>').text(label).addClass(style.join(' '));
		$elements.each(function() {
			$(this).append($label);
		});
	};
	return ShuttleSchedule;
});