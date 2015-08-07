/**
 * This script belongs to the mobile friendly audit plugin.
 * It
 */

// Create our namespace
window.MobileFriendlyAudit = {};

'use strict';
/*
 Some utilities
 */
(function ( $ ) {

	var _ns = window.MobileFriendlyAudit;

	/*
	    Singleton widget class definition
	 */

	// Properties
	_ns.VERSION = 1.0;
	_ns.Dom = {
		Widget: null, Form: null, Url: null, ApiKey: null, Error: null
	};
	_ns.API_KEY = '';
	_ns.API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
	_ns.CHART_API_URL = 'http://chart.apis.google.com/chart?';
	_ns.cache_enabled = true;
	_ns.CACHE_KEY = 'mobile_friendly_audit_cache';
	_ns.DEBUG = true;
	_ns.fail_score = 40;
	_ns.warning_score = 70;
	_ns.warning_impact = 50;
	_ns.pass_impact = 0;

	// Form submit handler
	_ns.onFormSubmit = function ( e ) {
		e.preventDefault();
		var url = _ns.Dom.Url.val();
		if ( _ns.validateUrl(url) ) {
			_ns.runAudit(url);
		} else {
			_ns.doError('Please enter a correct website URL to run the audit on.');
		}
		return false;
	};

	// Error handler
	_ns.doError = function ( error ) {
		if ( error && error.length ) {
			_ns.Dom.Error.html(error).removeClass('hidden');
		} else {
			_ns.Dom.Error.html('').addClass('hidden');
		}
	};

	// Validate the url
	_ns.validateUrl = function ( url ) {
		return (url && url.length > 0);
	};

	// Start the audit
	_ns.runAudit = function ( url ) {
		_ns.log('New audit requested for: ' + url);

		// Check cache
		if ( this.cache_enabled ) {
			var result = this.checkCache(url);
			if ( result ) {
				_ns.log('Cached request found.');
				this.processAuditResults(url, result);
				return false;
			} else {
				_ns.log('Cached request not found.');
			}
		} else {
			_ns.log('Cached disabled.');
		}

		// Build API request URL
		var request_url = this.API_URL + 'key=' + this.API_KEY +
			'&strategy=mobile&url=' + url + '&screenshot=true';

		// Show loading UI
		this.Dom.Loader.removeClass('hidden');
		this.Dom.Form.addClass('hidden');
		this.Dom.Results.addClass('hidden');

		// Make the request
		var xhr = $.ajax({
			url     : request_url,
			dataType: 'JSONP',
			context : this
		});
		xhr.done(function ( data ) {

			// As JSONP call always uses same callback - check for error
			if ( data.error && data.error.message.length ) {
				_ns.doError(data.error.message);
				return false;
			}

			// Check that the requested URL responded ok
			if ( data.responseCode != 200 ) {
				_ns.doError('The requested URL did not respond with a success status. The site may be down. Please try again later.');
				return false;
			}

			// Cache results
			_ns.cacheResponse(url, data);

			// Process results
			_ns.processAuditResults(url, data);

		});
		xhr.always(function () {

			// Reset UI
			_ns.Dom.Loader.addClass('hidden');
			_ns.Dom.Form.removeClass('hidden');

		});

	};

	// Process audit response
	_ns.processAuditResults = function ( url, data ) {

		_ns.log('Processing ' + url);
		_ns.log(data);

		try {

			// Overall success
			var $node = $('[data-mfa-results-section="overall"]', this.Dom.Results);
			if ( $node.length > 0 ) {
				_ns.processResult_Overall($node, url, data);
			}

			// Recommendations
			$node = $('[data-mfa-results-section="recommendations"]', this.Dom.Results);
			if ( $node.length > 0 ) {
				_ns.processResult_Recommendations($node, url, data);
			}

			// Statistics
			$node = $('[data-mfa-results-section="statistics"]', this.Dom.Results);
			if ( $node.length > 0 ) {
				_ns.processResult_Statistics($node, url, data);
			}

			// Resources
			$node = $('[data-mfa-results-section="resources"]', this.Dom.Results);
			if ( $node.length > 0 ) {
				_ns.processResult_Resources($node, url, data);
			}

			// Preview
			$node = $('[data-mfa-results-section="preview"]', this.Dom.Results);
			if ( $node.length > 0 ) {
				_ns.processResult_Preview($node, url, data);
			}

			// Show
			this.Dom.Results.removeClass('hidden');

		} catch (e) {
			this.doError('An error occurred displaying the results, please refresh the page and try again.');
			console.log(e);
		}

		return this;

	};

	// Process result: resources
	_ns.processResult_Resources = function ( $node, url, data ) {

		if ( $node && $node.length > 0 ) {

			var $ele = $('[data-mfa-results-section="resources"] [data-mfa-template="chart"]', _ns.Dom.Results);

			// From: https://developers.google.com/speed/docs/insights/v2/first-app
			var RESOURCE_TYPE_INFO = [
				{ label: 'JavaScript', field: 'javascriptResponseBytes', colour: 'e2192c' },
				{ label: 'Images', field: 'imageResponseBytes', colour: 'f3ed4a' },
				{ label: 'CSS', field: 'cssResponseBytes', colour: 'ff7008' },
				{ label: 'HTML', field: 'htmlResponseBytes', colour: '43c121' },
				{ label: 'Flash', field: 'flashResponseBytes', colour: 'f8ce44' },
				{ label: 'Text', field: 'textResponseBytes', colour: 'ad6bc5' },
				{ label: 'Other', field: 'otherResponseBytes', colour: '1051e8' }
			];

			// Build the chart data
			var stats = data.pageStats;
			var labels = [];
			var chart_data = [];
			var colours = [];
			var total_bytes = 0;
			var largest_single_category = 0;
			for ( var i = 0, len = RESOURCE_TYPE_INFO.length; i < len; ++i ) {
				var label = RESOURCE_TYPE_INFO[i].label;
				var field = RESOURCE_TYPE_INFO[i].field;
				var colour = RESOURCE_TYPE_INFO[i].colour;
				if ( field in stats ) {
					var val = Number(stats[field]);
					total_bytes += val;
					if ( val > largest_single_category ) {
						largest_single_category = val;
					}
					labels.push(label);
					chart_data.push(val);
					colours.push(colour);
				}
			}

			// Create and append the chart
			$ele.html(this.createGooglePieChart(colours, chart_data, labels, largest_single_category));

		}

		return this;
	};

	// Process result: preview
	_ns.processResult_Preview = function ( $node, url, data ) {

		if ( $node && $node.length > 0 ) {

			var $ele = $('[data-mfa-results-section="preview"] [data-mfa-template="preview_image"]', _ns.Dom.Results);

			// Generate image from base64 encoded data
			// FIX needed - base64 data is corrupt: https://groups.google.com/forum/#!topic/google-api-python-client/DjbJ0BwjbPo
			var img_data = data.screenshot;
			var base64data = img_data.data.replace(/_/g, '/').replace(/-/g, '+');
			var $img = $('<img/>', {
				src: 'data:' + img_data.mime_type + ';base64,' + base64data,
				width: img_data.width
			});
			$ele.html($img);

		}

		return this;
	};

	// Process result: statistics
	_ns.processResult_Statistics = function ( $node, url, data ) {

		// Find and update the element for a given statistics node
		var _updateTemplate = function ( key, data ) {
			var $row = $('[data-mfa-results-section="statistics"] table [data-mfa-template="' + key + '"]', _ns.Dom.Results);
			if ( $row.length > 0 ) {
				$('> td', $row).html(data);
			}
		};

		if ( $node && $node.length > 0 ) {

			var templates = {
				response_size_css  : 'cssResponseBytes',
				response_size_html : 'htmlResponseBytes',
				response_size_image: 'imageResponseBytes',
				response_size_js   : 'javascriptResponseBytes',
				resources_css      : 'numberCssResources',
				hosts              : 'numberHosts',
				resources_js       : 'numberJsResources',
				resources          : 'numberResources',
				resources_static   : 'numberStaticResources',
				response_size_other: 'otherResponseBytes',
				response_size_text : 'textResponseBytes',
				request_size_total : 'totalRequestBytes'
			};

			var stats = data.pageStats;
			var response_total = 0;
			$.each(templates, function(tpl_key, g_key){

				// Find the PageSpeed stat for this template
				var stat = stats[g_key];

				// Format the data
				if (tpl_key.indexOf('_size_') >= 0){
					stat = (stat || 0); // Brace against non-existent property
					var val = parseInt((parseInt(stat) / 1024));
					response_total += val;
					stat = val + ' kB';
				}

				// Update template row
				_updateTemplate(tpl_key, stat);

			});

			// Add in response total
			_updateTemplate('response_size_total', response_total + ' kB');

		}

		return this;
	};

	// Process result: recommendations
	_ns.processResult_Recommendations = function ( $node, url, data ) {

		// Find and update the element for a given recommendationnode
		var _updateTemplate = function ( key, show_message, classes ) {
			var $row = $('[data-mfa-results-section="recommendations"] table [data-mfa-template="' + key + '"]', _ns.Dom.Results);
			if ( $row.length > 0 ) {
				$('i.fa', $row).addClass(classes.icon);
				$row.addClass(classes.state);
				if (show_message){
					$('> td', $row).removeClass('invisible');
				} else {
					$('> td', $row).addClass('invisible');
				}
			}
		};

		// Get the appropriate CSS classes
		var _getRuleImpactClasses = function(score){

			var state = null, icon = null;
			switch (true){

				case (score <= _ns.pass_impact):
					state = 'pass';
					icon = 'fa-check';
					break;

				case (score < _ns.warning_impact):
					state = 'warning';
					icon = 'fa-question';
					break;

				default:
					state = 'fail';
					icon = 'fa-times';
					break;
			}
			return {
				state: state,
				icon: icon
			}
		};

		if ( $node && $node.length > 0 ) {

			var templates = {
				landing_page_redirects: 'AvoidLandingPageRedirects',
				plugins               : 'AvoidPlugins',
				viewport              : 'ConfigureViewport',
				compression           : 'EnableGzipCompression',
				caching               : 'LeverageBrowserCaching',
				server_response_time  : 'MainResourceServerResponseTime',
				minify_css            : 'MinifyCss',
				minify_js             : 'MinifyHTML',
				minify_html           : 'MinifyJavaScript',
				blocking_resources    : 'MinimizeRenderBlockingResources',
				images                : 'OptimizeImages',
				visible_content       : 'PrioritizeVisibleContent',
				viewport_sizing       : 'SizeContentToViewport',
				tap_target_size       : 'SizeTapTargetsAppropriately',
				font_size             : 'UseLegibleFontSizes'
			};

			var rules = data.formattedResults.ruleResults;
			$.each(templates, function(tpl_key, g_key){

				// Find the PageSpeed rule for this template
				var rule = rules[g_key];

				// Grab the appropriate state classes
				var classes = _getRuleImpactClasses(rule.ruleImpact);

				// Parse the correct message
				var show_message = (classes.state != 'pass');

				// Update template row
				_updateTemplate(tpl_key, show_message, classes);

			});

		}

		return this;
	};

	// Process result: overall
	_ns.processResult_Overall = function ( $node, url, data ) {

		// Find and update the score element for a given node
		var _updateScore = function ( score, $node ) {
			var $ele = $('[data-mfa-template="score"]', $node);
			if ( $ele.length > 0 ) {
				$ele.html(score + '/100');
			}
		};

		if ( $node && $node.length > 0 ) {

			var templates = {
				speed    : {
					success: $('[data-mfa-template="overall_speed_success"]', $node),
					warning: $('[data-mfa-template="overall_speed_warning"]', $node),
					fail   : $('[data-mfa-template="overall_speed_fail"]', $node),
					chart  : $('[data-mfa-template="overall_speed_chart"]', $node)
				},
				usability: {
					success: $('[data-mfa-template="overall_usability_success"]', $node),
					warning: $('[data-mfa-template="overall_usability_warning"]', $node),
					fail   : $('[data-mfa-template="overall_usability_fail"]', $node),
					chart  : $('[data-mfa-template="overall_usability_chart"]', $node)
				}
			};

			// Check speed
			var score_s = data.ruleGroups.SPEED.score;
			switch ( true ) {
				case (score_s < _ns.fail_score): // Fail
					templates.speed.success.addClass('hidden');
					templates.speed.warning.addClass('hidden');
					templates.speed.fail.removeClass('hidden');
					_updateScore(score_s, templates.speed.fail);
					break;

				case (score_s < _ns.warning_score): // Warning
					templates.speed.success.addClass('hidden');
					templates.speed.warning.removeClass('hidden');
					templates.speed.fail.addClass('hidden');
					_updateScore(score_s, templates.speed.warning);
					break;

				default: // Pass
					templates.speed.success.removeClass('hidden');
					templates.speed.warning.addClass('hidden');
					templates.speed.fail.addClass('hidden');
					_updateScore(score_s, templates.speed.success);
					break;

			}

			// Check usability
			var score_u = data.ruleGroups.USABILITY.score;
			switch ( true ) {
				case (score_u < _ns.fail_score): // Fail
					templates.usability.success.addClass('hidden');
					templates.usability.warning.addClass('hidden');
					templates.usability.fail.removeClass('hidden');
					_updateScore(score_u, templates.usability.fail);
					break;

				case (score_u < _ns.warning_score): // Warning
					templates.usability.success.addClass('hidden');
					templates.usability.warning.removeClass('hidden');
					templates.usability.fail.addClass('hidden');
					_updateScore(score_u, templates.usability.warning);
					break;

				default: // Pass
					templates.usability.success.removeClass('hidden');
					templates.usability.warning.addClass('hidden');
					templates.usability.fail.addClass('hidden');
					_updateScore(score_u, templates.usability.success);
					break;

			}

			// Create the google-o-meters
			templates.speed.chart.html(this.createGoogleOMeter(score_s));
			templates.usability.chart.html(this.createGoogleOMeter(score_u));

		}

		return this;
	};

	// Create a google-o-meter chart
	_ns.createGoogleOMeter = function ( score ) {
		var query = [
			'chs=180x100',
			'cht=gom',
			'chd=t:' + score,
			'chxt=x,y',
			'chxl=0:|' + score
		].join('&');
		var $img = $('<img/>', { src: this.CHART_API_URL + query });
		return $img.get(0);
	};

	// Create a google pie chart
	_ns.createGooglePieChart = function ( colours, data, labels, largest ) {
		var query = [
			'chs=300x140',
			'cht=p3',
			'chts=' + ['000000', 16].join(','),
			'chco=' + colours.join('|'),
			'chd=t:' + data.join(','),
			'chdl=' + labels.join('|'),
			'chdls=000000,14',
			'chp=1.6',
			'chds=0,' + largest
		].join('&');
		var $img = $('<img/>', { src: this.CHART_API_URL + query });
		return $img.get(0);
	};

	// Check the cache for this url
	_ns.checkCache = function ( url ) {

		var raw_cache = localStorage.getItem(this.CACHE_KEY);
		if ( raw_cache ) {

			// Attempt to parse the cache JSON
			var cache = null;
			try {
				cache = JSON.parse(raw_cache);
			} catch (e) {
				_ns.log('Cache is corrupt: ' + raw_cache);
				localStorage.removeItem(this.CACHE_KEY);
				return false;
			}

			// Check the cache
			var entry = cache[url];
			if ( entry ) {
				return entry;
			}

		}

		return false;

	};

	// Cache an audit request
	_ns.cacheResponse = function ( url, response ) {
		if ( this.cache_enabled ) {

			// Attempt to retrieve stored cache
			var raw_cache = localStorage.getItem(this.CACHE_KEY);
			var cache = null;
			if ( raw_cache ) {

				// Attempt to parse the cache JSON
				try {
					cache = JSON.parse(raw_cache);
				} catch (e) {
					_ns.log('Cache is corrupt: ' + raw_cache);
					localStorage.removeItem(this.CACHE_KEY);
					return false;
				}

			} else {

				// Prep new cache
				cache = {};

			}

			// Add a new entry (or update an existing?? Hmm..)
			cache[url] = response;

			// Save
			localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
			_ns.log('Cached audit response for: ' + url);

		}
		return this;
	};

	// Check for localstorage support
	_ns.testLocalStorage = function () {
		var test = 'test';
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	};

	// Widget init
	_ns.Init = function ( on_success, on_error ) {

		try {

			// Grab dom references
			this.Dom.Widget = $('#mobile_friendly_audit_widget');
			this.Dom.Loader = $('[data-mfa-node="loader"]', this.Dom.Widget);
			this.Dom.Form = $('[data-mfa-node="form"]', this.Dom.Widget);
			this.Dom.Url = $('input[name="url"]', this.Dom.Form);
			this.Dom.ApiKey = $('input[name="api_key"]', this.Dom.Form);
			this.Dom.Error = $('[data-mfa-node="error"]', this.Dom.Form);
			this.Dom.Results = $('[data-mfa-node="results"]', this.Dom.Widget);

			// Validate all nodes are found in the template
			if ( this.Dom.Widget.length == 0 ) { throw ('Widget node not found.'); }
			if ( this.Dom.Loader.length == 0 ) { throw ('Widget loader node not found.'); }
			if ( this.Dom.Form.length == 0 ) { throw ('Widget form node not found.'); }
			if ( this.Dom.Url.length == 0 ) { throw ('Widget url field not found.'); }
			if ( this.Dom.ApiKey.length == 0 ) { throw ('Widget api_key field not found.'); }
			if ( this.Dom.Error.length == 0 ) { throw ('Widget error message node not found.'); }
			if ( this.Dom.Results.length == 0 ) { throw ('Widget results node not found.'); }

			// Grab the Google PageSpeed API key (WP Option)
			this.API_KEY = this.Dom.ApiKey.val();
			if ( this.API_KEY.length == 0 ) { throw ('API KEY not set.'); }

			// Set debug status
			this.DEBUG = (this.Dom.Widget.attr('data-option-debug') == 'true');

			// Set cache status
			this.cache_enabled = (this.cache_enabled && this.testLocalStorage());
			_ns.log('Cache ' + (this.cache_enabled ? 'enabled' : 'disabled'));

			// Handle form submission
			this.Dom.Form.on('submit', this.onFormSubmit);

			// Init success handler
			if ( on_success ) {
				on_success();
			}

		} catch (e) {
			if ( on_error ) {
				on_error(e);
			}
		}

	};

	// Logger
	_ns.log = function ( message ) {
		if (this.DEBUG){
			if (typeof message == 'object'){
				console.log(message);
			} else {
				console.log('Mobile Friendly Audit: ' + message);
			}

		}
	};

	/*
	 Initialisation
	 */
	$(document).ready(function () {

		// Initialise widget
		_ns.Init(function () {
			_ns.log('Widget initialised successfully.');
		}, function ( e ) {
			_ns.log('Initialisation error: ' + e);
		});

	});

})(jQuery);

