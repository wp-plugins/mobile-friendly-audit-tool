<?php

	// Grab WP options
	$options = get_option(PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT . '_options');
	$google_api_key = $options['google_api_key'];
	global $attributes; // Shortcode attributes

?>

<!-- Mobile Friendly Audit Widget -->
<aside id="mobile_friendly_audit_widget" class="mfa"
       data-option-debug="<?php echo (!!$attributes['debug'] ? 'true' : 'false'); ?>"
	>

	<!-- Loader -->
	<?php include ('_loader.php'); ?>

	<!-- The URL Form -->
	<?php include ('_url_form.php'); ?>

	<!-- The audit results -->
	<section data-mfa-node="results" class="mfa__results hidden">

		<h2>Audit Results</h2>

		<!-- Overall -->
		<?php if (!$attributes['hide_overall']) include ('_results_overall.php'); ?>

		<!-- Recommendations -->
		<?php if (!$attributes['hide_recommendations']) include ('_results_recommendations.php'); ?>

		<!-- Statistics -->
		<?php if (!$attributes['hide_statistics']) include ('_results_statistics.php'); ?>

		<!-- Resources -->
		<?php if (!$attributes['hide_resources']) include ('_results_resources.php'); ?>

		<!-- GPreview -->
		<?php if (!$attributes['hide_preview']) include ('_results_preview.php'); ?>

	</section>

</aside>



