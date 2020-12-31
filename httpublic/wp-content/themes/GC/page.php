<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _gc
 */

get_header();
?>

	<header id="page-header" class="page-header hero-dark">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post();
		if ( is_singular() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif; endwhile; endif; ?>
	</header><!-- page-header -->

	<div class="content-wrapper">

		<main id="primary" class="site-main">

			<?php get_template_part( 'template-parts/breadcrumbs', 'content' ); ?>

			<?php while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/content', 'page' );

				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

			endwhile; // End of the loop. ?>

		</main><!-- #primary -->

		<!-- #secondary -->
		<?php get_sidebar(); ?>

	</div><!-- .content-wrapper -->

<?php get_footer(); ?>
