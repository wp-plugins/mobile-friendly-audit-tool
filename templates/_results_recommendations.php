<section data-mfa-results-section="recommendations" class="mfa__results__section recommendations">

	<h3><?php _e('Recommendations', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></h3>

	<table class="mfa__results__section__table">
		<tbody>
			<tr data-mfa-template="landing_page_redirects">
				<th><i class="fa"></i> <?php _e('Landing Page Redirects', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has landing page redirects. Redirects trigger an additional HTTP request-response cycle and delay page rendering.</td>
			</tr>
			<tr data-mfa-template="plugins">
				<th><i class="fa"></i> <?php _e('Plugins', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has browser plugins. Most mobile devices do not support plugins, and plugins are a leading cause of hangs, crashes, and security incidents in browsers that provide support.</td>
			</tr>
			<tr data-mfa-template="viewport">
				<th><i class="fa"></i> <?php _e('Viewport', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your viewport is incorrectly configured. Without a correctly configured viewport, mobile devices will render the page at a typical desktop screen width, scaled to fit the screen.</td>
			</tr>
			<tr data-mfa-template="compression">
				<th><i class="fa"></i> <?php _e('Compression', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Compressing resources with gzip or deflate can reduce the number of bytes sent over the network.</td>
			</tr>
			<tr data-mfa-template="caching">
				<th><i class="fa"></i> <?php _e('Caching', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has resources that do not utilise the browser cache. Setting an expiry date or a maximum age in the HTTP headers for static resources instructs the browser to load previously downloaded resources from local disk rather than over the network.</td>
			</tr>
			<tr data-mfa-template="server_response_time">
				<th><i class="fa"></i> <?php _e('Server Response Time', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your server response could be improved. Server response time measures how long it takes to load the necessary HTML to begin rendering the page from your server.</td>
			</tr>
			<tr data-mfa-template="minify_css">
				<th><i class="fa"></i> <?php _e('Minify CSS', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has unminified CSS. Compacting CSS code can save many bytes of data and speed up download and parse times.</td>
			</tr>
			<tr data-mfa-template="minify_js">
				<th><i class="fa"></i> <?php _e('Minify JS', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has unminified JavaScript. Compacting script files can save many bytes of data and speed up download and parse times.</td>
			</tr>
			<tr data-mfa-template="minify_html">
				<th><i class="fa"></i> <?php _e('Minify HTML', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has unminified HTML. Compacting HTML code, including any inline JavaScript and CSS contained in it, can save many bytes of data and speed up download and parse times.</td>
			</tr>
			<tr data-mfa-template="blocking_resources">
				<th><i class="fa"></i> <?php _e('Blocking Resources', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your page has blocking script resources and blocking CSS resources. This causes a delay in rendering your page.</td>
			</tr>
			<tr data-mfa-template="images">
				<th><i class="fa"></i> <?php _e('Images', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Properly formatting and compressing images can save many bytes of data.</td>
			</tr>
			<tr data-mfa-template="visible_content">
				<th><i class="fa"></i> <?php _e('Visible Content', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Your above-the-fold content is not correctly prioritised. If the amount of data required exceeds the initial congestion window (typically 14.6kB compressed), it will require additional round trips between your server and the user's browser.</td>
			</tr>
			<tr data-mfa-template="viewport_sizing">
				<th><i class="fa"></i> <?php _e('Viewport Sizing', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>The contents of your page do not fit within the viewport. On both desktop and mobile devices, users are used to scrolling websites vertically but not horizontally, and forcing the user to scroll horizontally or to zoom out in order to see the whole page results in a poor user experience.</td>
			</tr>
			<tr data-mfa-template="tap_target_size">
				<th><i class="fa"></i> <?php _e('Tap Target Size', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Some of the links/buttons on your webpage may be too small for a user to easily tap on a touchscreen. Consider making these tap targets larger to provide a better user experience.</td>
			</tr>
			<tr data-mfa-template="font_size">
				<th><i class="fa"></i> <?php _e('Font Size', PLUGIN_SAFE_NAME_MOBILE_FRIENDLY_AUDIT); ?></th>
				<td>Some of the text on your page renders in a way that may be difficult for some of your visitors to read. Use legible font sizes to provide a better user experience.</td>
			</tr>
		</tbody>
	</table>

</section>