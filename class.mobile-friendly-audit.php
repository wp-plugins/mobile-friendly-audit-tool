<?php

	// If this file is called directly, abort.
	if ( !defined('WPINC') ) {
		die;
	}

	define ( 'PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT', 'mobile-friendly-audit-tool' );

	/**
	 * Plugin Name: Mobile Friendly Audit
	 * Plugin URI:
	 * Description: A front-end widget that uses Google's PageSpeed APi to evaluate the performance and usability of
	 * a given website
	 * Author: Barry Jones <barry@onalldevices.com>
	 * Version: 1.2
	 * Author URI: http://onalldevices.com
	 */
	class Mobile_Friendly_Audit {

		protected $paths = null;

		// Plug-in initialisation
		public function __construct() {

			// Setup Paths
			$this->paths                = new stdClass();
			$this->paths->plugin        = plugin_dir_path(__FILE__);
			$this->paths->parent_theme  = get_template_directory() . '/';
			$this->paths->current_theme = get_stylesheet_directory() . '/';
			if ( $this->paths->parent_theme == $this->paths->current_theme ) {
				$this->paths->parent_theme = null;
			}

			// Prepare Shortcodes
			$this->createShortCodes();

			// Register our javascripts and styles for front-end
			add_action( 'wp_enqueue_scripts', array($this, 'registerAssets') );

			// Register options
			add_action('admin_menu', array( $this, 'registerOptions' ));
			add_action('admin_init', array( $this, 'registerOptionFields' ));

		}

		// Create shortcodes
		private function createShortCodes() {

			// Form UI
			add_shortcode('mobile_audit_form', array( $this, 'shortcodeMobileAuditForm' ));

			// Add shortcode support for widgets
			add_filter('widget_text', 'do_shortcode');

		}

		// Register our client side assets
		public function registerAssets(){

			// JS Script
			wp_register_script(
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_js',
				plugins_url(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '/js/mobile-friendly-audit.min.js'),
				array( 'jquery' ),
				'',
				true
			);

			// CSS styles
			wp_register_style(
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_css',
				plugins_url(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '/css/mobile-friendly-audit.min.css')
			);
			wp_enqueue_style( PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_css' );
			wp_register_style(
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_fontawesome_css',
				plugins_url(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '/css/font-awesome.min.css')
			);
			wp_enqueue_style( PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_fontawesome_css' );

		}

		// Register admin option fields
		public function registerOptionFields() {
			register_setting(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT, PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_options', array( $this, 'validateOptions' ));

			// Main section
			add_settings_section(
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_main',
				'',
				array( $this, 'displayOptionSectionMain' ),
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT
			);

			// Google API Key
			add_settings_field(
				'google_api_key',
				'Google API Key',
				array( $this, 'displayOptionGoogleAPIKey' ),
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT,
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_main'
			);

		}

		// Display the main options section
		public function displayOptionSectionMain() {
			echo '';
		}

		// Display the main options section
		public function displayOptionGoogleAPIKey() {
			$options = get_option(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_options');
			echo '<input id="' . PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_google_api_key" ' .
				'name="' . PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_options[google_api_key]" type="text" value="' .
				$options['google_api_key'] . '" class="regular-text" required />';
		}

		// Validate the option fields
		public function validateOptions($inputs) {
			$options = get_option(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_options');

			// Google API Key
			$options['google_api_key'] = trim($inputs['google_api_key']);
			if ( strlen($options['google_api_key']) < 5 ) {
				$options['google_api_key'] = '';
			}

			return $options;
		}

		// Register admin options
		public function registerOptions() {
			add_options_page(
				'Mobile Friendly Audit',
				'Mobile Friendly Audit',
				'manage_options',
				PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT,
				array( $this, 'buildOptions' )
			);
		}

		// Register admin options
		public function buildOptions() {

			// Check user permissions
			if ( !current_user_can('manage_options') ) {
				wp_die(__('You do not have sufficient permissions to access this page.'));
			}

			// Return the admin page template
			$this->includeTemplateFile('admin/settings.php');

		}

		/*
		 * Fetch a template file contents
		 * Check current theme for an override, then check parent theme (if applicable),
		 * otherwise use plugin default.
		 */

		protected function includeTemplateFile($filename) {
			if ( file_exists($this->paths->current_theme . 'templates/' . $filename) ) {
				include( $this->paths->current_theme . 'templates/' . $filename );
			} elseif ( $this->paths->parent_theme && file_exists($this->paths->parent_theme . 'templates/' . $filename) ) {
				include( $this->paths->parent_theme . 'templates/' . $filename );
			} else {
				include( $this->paths->plugin . 'templates/' . $filename );
			}
		}

		/*
		 * Same as above, but output the contents of the PHP file instead of return it
		 */

		public function shortcodeMobileAuditForm($atts) {

			// Enqueue the JS
			wp_enqueue_script(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_js');

			// Default attribute values
			global $attributes;
			$attributes = shortcode_atts(array(
				'debug'                    => false,
				'hide_overall'             => false,
				'hide_recommendations'     => false,
				'hide_statistics'          => false,
				'hide_resources'           => false,
				'hide_preview'             => false
			), $atts);

			// Return the main template for the shortcode
			ob_start();
			$this->includeTemplateFile('mobile-friendly-audit.php');
			return ob_get_clean();

		}

		// Present the mobile audit form

		protected function getTemplateFile($filename) {
			if ( file_exists($this->paths->current_theme . 'templates/' . $filename) ) {
				return file_get_contents($this->paths->current_theme . 'templates/' . $filename);
			} elseif ( $this->paths->parent_theme && file_exists($this->paths->parent_theme . 'templates/' . $filename) ) {
				return file_get_contents($this->paths->parent_theme . 'templates/' . $filename);
			} else {
				return file_get_contents($this->paths->plugin . 'templates/' . $filename);
			}
		}

	}

	$mobile_audit = new Mobile_Friendly_Audit();