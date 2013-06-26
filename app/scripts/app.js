/*global define */
define(['jquery'], function ($) {
	'use strict';

	function ShuttleSchedule() {
		this.timerId = null;
		this.$previousElements = $();
	}

	ShuttleSchedule.prototype.setupEventHandlers = function() {
		$('.schedule-switcher').on('click', 'li', function(e) {
			e.preventDefault();
			if (!$(this).hasClass('active')) {
				$('.schedule-switcher li').removeClass('active');
				$(this).addClass('active');
				$('.schedule-container table').toggleClass('invisible');
			}
		});
	};

	ShuttleSchedule.prototype.timeUpdater = function(timeDestination, frequency) {
		var that = this;

		if (this.timerId) {
			clearTimeout(this.timerId);
		}

		this.timerId = setInterval(function() {
			that.setTime(timeDestination);
		}, frequency);
	};

	ShuttleSchedule.prototype.setTime = function(timeDestination) {
		var now = new Date(),
			hour = now.getHours(),
			minutes = now.getMinutes(),
			amPM = hour - 12 < 0 ? 'AM' : 'PM',
			amPMHour = amPM === 'AM' ? hour : hour - 12,
			timeString = amPMHour + ':' + minutes + ' ' + amPM;

		$(timeDestination).text(timeString);
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
		this.$previousElements.removeClass(style.join(' '));
		$elements.each(function() {
			$('span', this).addClass(style.join(' '));
		});
		this.$previousElements = $elements;
	};
	return ShuttleSchedule;
});