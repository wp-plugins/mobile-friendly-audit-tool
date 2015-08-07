<form data-mfa-node="form" class="mfa__form" role="form">

	<!-- Form error message -->
	<div data-mfa-node="error" class="mfa__alert mfa__alert--error hidden"></div>

	<!-- The fields-->
	<fieldset>
		<input type="hidden" name="api_key" value="<?php echo $google_api_key; ?>" />
		<label>
			<?php _e('Website address to check:', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?>
			<input type="url" name="url" required />
		</label>
		<button type="submit" value="<?php _e('Run audit', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?>">
			<?php _e('Run audit', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?>
		</button>
	</fieldset>

</form>