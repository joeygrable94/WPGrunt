<?php
/**
 * GeneratePress.
 *
 * Please do not make any edits to this file. All edits should be done in a child theme.
 *
 * @package GeneratePress
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Set our theme version and dir path
define( 'GENERATE_VERSION', '3.0.2' );
$theme_dir = get_template_directory();
$theme_dir = explode('/', $theme_dir);
array_pop($theme_dir);
$theme_dir = join('/', $theme_dir);
$theme_dir = $theme_dir . '/gcpress';

// Include necessary code files
include_once $theme_dir . '/custom-functions.php';
