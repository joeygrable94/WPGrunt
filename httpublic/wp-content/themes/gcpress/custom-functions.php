<?php
/** 
 * 
 * WPGRUNT CUSTOM FUNCTIONS
 * 
 **/


// add custom styles and scripts
function wpgrunt_add_custom_styles_and_scripts() {
	$theme_path = get_stylesheet_directory_uri();
	$custom_styles = $theme_path . '/assets/css/wpgrunt.styles.min.css';
	$custom_script = $theme_path . '/assets/js/wpgrunt.scripts.min.js';
	print("\n".'<!-- STYLES -->'."\n");
	printf('<link id="wpgrunt-style-css" rel="stylesheet" href="%s">'."\n", $custom_styles);
	print("\n".'<!-- SCRIPTS -->'."\n");
	print('<script src="https://code.jquery.com/jquery-3.6.0.slim.min.js" integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI=" crossorigin="anonymous"></script>'."\n");
	printf('<script id="wpgrunt-script-js" src="%s"></script>'."\n", $custom_script);
}
add_action( 'wp_head', 'wpgrunt_add_custom_styles_and_scripts' );


// add the color of the fly tour dynamically to the body
function wpgrunt_add_category_body_class( $classes, $item ) {
	// add category slug to the $classes array
	if (is_single() ) {
		global $post;
		foreach((get_the_category($post->ID)) as $category) {
			$classes[] = $category->category_nicename;
		}
	}
	return $classes;
}
add_filter( 'body_class', 'wpgrunt_add_category_body_class', 10, 2 );

