<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _gc
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php _gc_post_thumbnail(); ?>

	<div class="content-wrap">

		<div class="entry-content">

			<?php

			the_title( '<h2 class="entry-title">', '</h2>' );

			the_content(
				sprintf(
					wp_kses(
						/* translators: %s: Name of current post. Only visible to screen readers */
						__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', '_gc' ),
						array(
							'span' => array(
								'class' => array(),
							),
						)
					),
					wp_kses_post( get_the_title() )
				)
			);

			wp_link_pages(
				array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', '_gc' ),
					'after'  => '</div>',
				)
			);
			?>
		</div><!-- .entry-content -->

		<footer class="entry-footer">
			<div>
				<?php _gc_posted_on(); ?>
				<?php #_gc_posted_by(); ?>
			</div>
			<?php #_gc_entry_footer(); ?>
		</footer><!-- .entry-footer -->

	</div><!-- .category-wrap -->

</article><!-- #post-<?php the_ID(); ?> -->
