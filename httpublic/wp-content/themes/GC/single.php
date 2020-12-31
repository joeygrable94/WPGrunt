<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _gc
 */

get_header();
?>

	<header id="page-header" class="entry-header hero-dark">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post();
			the_title( '<h1 class="entry-title">', '</h1>' );
		endwhile; endif; ?>
	</header><!-- page-header -->

	<div class="content-wrapper">

		<main id="primary" class="site-main">

			<?php get_template_part( 'template-parts/breadcrumbs', 'content' ); ?>

			<?php while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/content', get_post_type() );
				
				the_posts_navigation();

				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

			endwhile; // End of the loop. ?>

		</main><!-- #primary -->

		<!-- #secondary -->
		<?php get_sidebar(); ?>

	</div><!-- .content-wrapper -->

<?php get_footer(); ?>
