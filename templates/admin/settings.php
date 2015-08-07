<div id="theme-options-wrap">

	<h2>Mobile Friendly Audit Settings</h2>

	<form method="post" action="options.php">

		<?php
			settings_fields( PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT );
			do_settings_sections( PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT );
		?>

		<button type="submit" value="<?php esc_attr_e('Save Changes'); ?>" class="button button-primary">
			<?php esc_attr_e('Save Changes'); ?></button>

	</form>

</div>