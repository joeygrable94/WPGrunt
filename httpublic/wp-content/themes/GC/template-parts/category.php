<?php
/**
 * Template part for displaying categories content
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _gc
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php _gc_post_thumbnail(); ?>

	<div class="category-wrap">

		<header class="entry-header">
			<?php if ( is_singular() ) :
				the_title( '<h2 class="entry-title">', '</h2>' );
			else :
				the_title( '<h3 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' );
			endif; ?>
		</header>

		<div class="entry-content">
			<?php the_excerpt(); ?>
			<?php
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
