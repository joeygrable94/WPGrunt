<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package _gc
 */

get_header();
?>

	<header id="page-header" class="page-header hero-dark"></header>

	<div class="content-wrapper">

		<main id="primary" class="site-main">

			<?php get_template_part( 'template-parts/breadcrumbs', 'content' ); ?>

			<article class="content-wrap">

				<div class="entry-content">
					<h2 class="title-404 font-10x text-center">404</h2>
					<h1 class="entry-title text-center"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', '_gc' ); ?></h1>
					<p class="text-center"><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', '_gc' ); ?></p>
					<hr style="margin-top: 3rem; margin-bottom: 3rem;">
					<div class="search-block-404">
						<?php get_search_form(); ?>
					</div>
					<hr style="margin-top: 3rem; margin-bottom: 3rem;">
				</div><!-- .entry-content -->

				<footer class="entry-footer">
					<?php the_widget( 'WP_Widget_Recent_Posts', array(), array(
						'before_title' => '<h6 class="widgettitle">',
						'after_title' => '</h6>'
					) ); ?>
					<div class="widget widget_categories">
						<h6 class="widget-title"><?php esc_html_e( 'Articles By Category', '_gc' ); ?></h6>
						<ul><?php wp_list_categories(array(
							'orderby'    => 'count',
							'order'      => 'DESC',
							'show_count' => 1,
							'title_li'   => '',
							'number'     => 10,
						)); ?></ul>
					</div><!-- .widget -->
				</footer><!-- .entry-footer -->

			</article><!-- .error-404 -->

		</main><!-- #primary -->

	</div><!-- .content-wrapper -->

<?php get_footer(); ?>
