<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _gc
 */

?>
	
	<?php get_template_part( 'template-parts/breadcrumbs', 'footer' ); ?>

	<footer id="colophon" class="site-footer hero-dark">
		<nav id="footer-navigation" class="footer-navigation">
			<span class="menu-toggle" aria-controls="main-menu" aria-expanded="false"><span class="hamburger">|||</span> <span class="toggle-text">menu</span></span>
			<?php wp_nav_menu(
				array(
					'theme_location' => 'menu-2',
					'menu_id'        => 'footer-menu',
				)
			); ?>
		</nav><!-- #footer-navigation -->
		<div class="site-info">
			<a href="<?php echo get_home_url(); ?>"><?php printf( esc_html__( 'Proudly powered by %s', '_gc' ), 'Get Community' ); ?></a><br>&copy; <?php echo date("Y"); ?> All rights reserved. <a class="hide" href="https://joeygrable.com"><?php  printf( esc_html__( 'Built by %s', '_gc' ), 'Joey Grable' ); ?></a>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
