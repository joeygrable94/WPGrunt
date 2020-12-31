<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package _gc
 */



/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function _gc_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', '_gc_body_classes' );



/**
 * Adds category classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function _gc_add_category_to_single($classes) {
	if (is_single() ) {
		global $post;
		foreach((get_the_category($post->ID)) as $category) {
			// add category slug to the $classes array
			$classes[] = $category->category_nicename;
		}
	}
	// return the $classes array
	return $classes;
}
add_filter('body_class', '_gc_add_category_to_single');



/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function _gc_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', '_gc_pingback_header' );



/**
 * Add a max char length for the post excerpts
 */
function _gc_excerpt_length($length){
	return 72;
}
add_filter( 'excerpt_length', '_gc_excerpt_length', 999 );



/**
 * Remove "Category: " text from archive pages
 */
function _gc_the_archive_title( $title ) {
	if( is_category() ) {
		$title = single_cat_title( '', false );
	}
	return $title;
}
add_filter( 'get_the_archive_title', '_gc_the_archive_title' );



/**
 * Make search for HTML5 compliant
 */
function _gc_html5_search_form( $form ) { 
	$form = '<section class="search"><form role="search" method="get" id="search-form" action="' . home_url( '/' ) . '" >
	<label class="screen-reader-text" for="s">' . __('',  'domain') . '</label>
	<input type="search" value="' . get_search_query() . '" name="s" placeholder="enter your search" class="search-field" />
	<input type="submit" class="search-submit" value="'. esc_attr__('GO', 'domain') .'" />
	</form></section>';
	return $form;
}
add_filter( 'get_search_form', '_gc_html5_search_form' );



/**
 * Disable the emoji's
 */
function _gc_disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' ); 
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' ); 
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', '_gc_disable_emojis_tinymce' );
	add_filter( 'wp_resource_hints', '_gc_disable_emojis_remove_dns_prefetch', 10, 2 );
}
add_action( 'init', '_gc_disable_emojis' );



/**
 * Filter function used to remove the tinymce emoji plugin.
 * 
 * @param array $plugins 
 * @return array Difference betwen the two arrays
 */
function _gc_disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}



/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array $urls URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array Difference betwen the two arrays.
 */
function _gc_disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' == $relation_type ) {
		
		/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );
		$urls = array_diff( $urls, array( $emoji_svg_url ) );
	}
	return $urls;
}

