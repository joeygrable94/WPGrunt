<?php
/**
 * Template part for displaying results in search pages
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
			<?php the_title( '<h3 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h3>' ); ?>
		</header><!-- .entry-header -->

		<div class="entry-summary">
			<?php the_excerpt(); ?>
		</div><!-- .entry-summary -->

		<footer class="entry-footer">
			<div>
				<?php _gc_posted_on(); ?>
				<?php #_gc_posted_by(); ?>
			</div>
			<?php #_gc_entry_footer(); ?>
		</footer><!-- .entry-footer -->

	</div><!-- .category-wrap -->

</article><!-- #post-<?php the_ID(); ?> -->
