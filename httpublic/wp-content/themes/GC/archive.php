<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _gc
 */

get_header();
?>

	<header id="page-header" class="category-header hero-dark">
		<?php if ( have_posts() ):
			the_archive_title( '<h1 class="page-title">', '</h1>' );
			the_archive_description( '<div class="archive-description">', '</div>' );
		endif; ?>
	</header><!-- .page-header -->

	<div class="content-wrapper">

		<main id="primary" class="site-main">

			<?php get_template_part( 'template-parts/breadcrumbs', 'content' ); ?>

			<?php if ( have_posts() ) : ?>

				<div class="category-list">
					<?php while ( have_posts() ) : the_post();
						get_template_part( 'template-parts/category' );
					endwhile; ?>
				</div>

				<div class="category-nav">
					<h6 class="nav-title">Pages: </h6>
					<?php $pagination = array(
						'mid_size' => 2,
						'end_size' => 1,
						'prev_next' => false );
					the_posts_pagination($pagination); ?>
					<?php #the_posts_navigation(); ?>
				</div>

			<?php else :
				get_template_part( 'template-parts/content', 'none' );
			endif; ?>

		</main><!-- #primary -->

		<!-- #secondary -->
		<?php get_sidebar(); ?>

	</div><!-- .content-wrapper -->

<?php get_footer(); ?>
