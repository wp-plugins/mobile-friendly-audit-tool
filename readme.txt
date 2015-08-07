=== Mobile Friendly Audit Tool ===
Contributors: TheFoot
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9QPSR47GVX7C6
Tags: mobile-optimised google pagespeed insights api widget
Requires at least: 4.1.1
Tested up to: 4.2.4
Stable tag: 1.2
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This WordPress plugin allows you to embed a frontend widget that tests a given website for mobile friendliness using Google's PageSpeed Insights API.

== Description ==

This WordPress plugin allows you to embed a frontend widget where the user can enter the full URL of the website to
test for mobile friendliness, and the results are displayed below. This widget uses Google's PageSpeed Insights API.

**NOTE: Make sure you enter your Google Apps API key into the settings area.**

The shortcode presents a basic HTML form that captures a URL. When the `Run Audit` button is pressed, the
form is hidden, and the loading UI displayed. When the PageSpeed API call returns, the information is
displayed in templated sections beneath.

**Usage**
Simply embed the shortcode `[mobile_audit_form]` into any post content area, or HTML/Text widget.

**Options**

**Debug output**
Use the `debug="true"` option to show debug output in the browsers JavaScript console.
E.g. `[mobile_audit_form debug="true"]`

**Hiding Result Sections**
You can hide the one or more of the following sections via shortcode attributes:

* Overall: `[mobile_audit_form hide_overall="true"]`
* Recommendations: `[mobile_audit_form hide_recommendations="true"]`
* Statistics: `[mobile_audit_form hide_statistics="true"]`
* Resources: `[mobile_audit_form hide_resources="true"]`
* Preview: `[mobile_audit_form hide_preview="true"]`

##The Results

###Overall
The Overall section shows Google's mobile rating for both Speed and Usability, including a Google-o-meter chart.

###Recommendations
This section shows suggestions for improving the page ratings. Each entry is marked `pass`, `warning` or `fail`.

###Statistics
This section shows useful statistics related to the page request and response breakdowns by asset type.

###Resources
This is a pie chart showing the split between asset type, for the page response.

###Preview
This shows an image snapshot of the page, as Google sees it.

##Theming

All markup is provided via .php files in the plugin's `/templates/` folder. Override these templates within your theme
to fully customise the output.

The CSS is neutral and comes with very basic styling, so as to pick up your theme's default styles.The plugin CSS is
built using SASS, and the plugin comes with a Grunt build file, to compile the SASS into minified CSS, as well as
combine and minify all JavaScripts.

Copy the SASS files into your theme to generate CSS to override the plugin's default styles.

_TODO: Create an admin option to disable the inclusion of the plugin's default CSS._

##Font Awesome

This plugin includes a copy of Font Awesome, for its icons.

_TODO: Create an admin option to disable the inclusion of the plugin's fontawesome CSS._

##Caching

HTML5 localStorage, if present, is used to cache PageSpeed API call results, in order to reduce the number of calls
made to Google's API. Results are cached by page/url.

== Installation ==

###Generate a Google Apps API key.

* Go to the [Google Developers Console](https://console.developers.google.com/).
* Select a project, or create a new one.
* In the sidebar on the left, expand APIs & auth. Next, click APIs. Select the Enabled APIs link in the API section
to see a list of all your enabled APIs. Make sure that the PageSpeed Insights API is on the list of enabled
APIs. If you have not enabled it, select the API from the list of APIs, then select the Enable API button for the API.
* In the sidebar on the left, select Credentials.
* Create a **Public API access** key.
* Paste the new API key into the **Google API Key** setting in the WordPress Admin settings area.

###Install the plugin

####From your WordPress dashboard

* Visit `Plugins > Add New`
* Search for `Mobile Friendly Audit`
* Activate `Mobile Friendly Audit` from your Plugins page.

####From WordPress.org
* Download `Mobile Friendly Audit`.
* Upload the `mobile-friendly-audit` directory to your `/wp-content/plugins/` directory, using your favorite method (ftp, sftp, scp, etc...)
* Activate `Mobile Friendly Audit` from your Plugins page.

####From GitHub
* Clone the git repository into your`/wp-content/plugins/` directory:
  - HTTPS: [https://github.com/onalldevices/wp-plugin-mobile-friendly-audit.git](https://github.com/onalldevices/wp-plugin-mobile-friendly-audit.git)
  - SSH: [git@github.com:onalldevices/wp-plugin-mobile-friendly-audit.git](git@github.com:onalldevices/wp-plugin-mobile-friendly-audit.git)
* Activate `Mobile Friendly Audit` from your Plugins page.

###Configure the settings
Add your Google Apps API key to the `Settings > Mobile Friendly Audit` page.

== Frequently Asked Questions ==

= Can the markup be changed in the templates? =

Yes. Be sure to keep to the general DOM hierarchy, and preserve any CSS classes and data- attributes.

== Screenshots ==
1. **Full screen results** - all report sections displayed.

== Changelog ==

= 1.2 =
* Fixed incorrect installation folder.

= 1.1 =
* Updated readme.txt and copied screenshot-1.png into /assets folder, instead of /trunk/assets.

= 1.0 =
* Initial plugin release

== Upgrade Notice ==

= 1.2 =
* This version fixes an installation bug.