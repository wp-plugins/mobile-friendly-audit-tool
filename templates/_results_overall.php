<section data-mfa-results-section="overall" class="mfa__results__section overall">

	<h3><?php _e('Overall', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></h3>

	<!-- Speed section -->
	<section class="speed">

		<div data-mfa-template="overall_speed_success" class="mfa__alert mfa__alert--success">
			<b>Speed = Pass!</b> The speed of this site is rated
			<span data-mfa-template="score" class="score"></span>. No work is needed!
		</div>
		<div data-mfa-template="overall_speed_warning" class="mfa__alert mfa__alert--warning">
			<b>Speed = Ok.</b> The speed of this site is rated
			<span data-mfa-template="score" class="score"></span>. This is "ok" but could use some work.
		</div>
		<div data-mfa-template="overall_speed_fail" class="mfa__alert mfa__alert--error">
			<b>Speed = Fail!</b> The speed of this site is rated
			<span data-mfa-template="score" class="score"></span>. Work is needed to optimise this website for mobile devices.
		</div>
		<div data-mfa-template="overall_speed_chart" class="google-o-meter"></div>

	</section>

	<hr />

	<!-- Usability alerts -->
	<section class="usability">

		<div data-mfa-template="overall_usability_success" class="mfa__alert mfa__alert--success">
			<b>Usability = Pass!</b> The usability of this site is rated
			<span data-mfa-template="score" class="score"></span>. No work is needed!
		</div>
		<div data-mfa-template="overall_usability_warning" class="mfa__alert mfa__alert--warning">
			<b>Usability = Ok.</b> The usability of this site is rated
			<span data-mfa-template="score" class="score"></span>. This is "ok" but could use some work.
		</div>
		<div data-mfa-template="overall_usability_fail" class="mfa__alert mfa__alert--error">
			<b>Usability = Fail!</b> The usability of this site is rated
			<span data-mfa-template="score" class="score"></span>. Work is needed to optimise this website for mobile devices.
		</div>
		<div data-mfa-template="overall_usability_chart" class="google-o-meter"></div>

	</section>

</section>