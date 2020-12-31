<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _gc
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<!-- WP head -->
	<?php wp_head(); ?>
	<!-- remove wpadmin toolbar -->
	<style type="text/css">
		html { margin-top: 0px !important; }
		#debug { display: none; }
		#wpadminbar { display: none; }
	</style>
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '_s' ); ?></a>

	<header id="masthead" class="site-header">
		
		<div class="nav-wrap">
		
			<div id="site-branding" class="site-branding">
				<?php
				the_custom_logo();
				if ( is_front_page() && is_home() ) : ?>
					<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<?php else : ?>	
					<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
				<?php endif;
				$_gc_description = get_bloginfo( 'description', 'display' );
				if ( $_gc_description || is_customize_preview() ) : ?>
					<p class="site-description"><?php echo $_gc_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
				<?php endif; ?>
			</div><!-- .site-branding -->


			<span id="main-navigation-toggle" class="toggle-menu" data-toggle="main-navigation" aria-controls="main-menu" aria-expanded="false"><span class="toggle-hamburger">|||</span> <span class="toggle-text">menu</span></span>
			<nav id="main-navigation" class="main-navigation">
				<?php wp_nav_menu(array( 'theme_location' => 'menu-1', 'menu_id' => 'main-menu' )); ?>
				<?php get_template_Part( 'template-parts/social', 'navigation' ); ?>
			</nav><!-- #site-navigation -->
		</div><!-- .nav-wrap -->
	
	</header><!-- #masthead -->

	<?php get_template_part( 'template-parts/breadcrumbs', 'content' ); ?>
