<?php
include('perch/runtime.php');
include('_CMScontent.php');
?>


<!-- Perch HEADER -->
<?php perch_layout('global.header'); ?>

	<!-- HEADER -->
	<header id="obc-header">
		<!-- nav -->
		<nav class="obc-header--navigation">
			<div class="container h-1-1-per | flex f-row f-align-center f-nowrap">
				<a class="brand | col-1-2 col-sm-2-5 col-lg-3-8 | flex f-row f-spaced f-align-center f-justify-start" href="./">
					<span class="hide-min-only"><?php echo $headerLogoDesktop; ?></span>
					<span class="show-min-only"><?php echo $headerLogoMobile; ?></span>
				</a>
				<a class="contact | col-1-2 col-sm-3-5 col-lg-offset-2-8 col-lg-3-8 | flex f-row f-align-center f-justify-end" target="_blank" href="mailto:<?php echo $ContactEmail; ?>" alt="click here to email info at Ocean Bright Consulting." onclick="ga('send',{'event','contact','contacted','contacted directly from website'});">
					<div class="hide show-sm"><?php echo $ContactEmail; ?></div>
					<img class="hide-sm" src="./images/icon-email-contact.png" alt="click here to email info at Ocean Bright Consulting.">
				</a>
			</div>
		</nav>
		<!-- parallax -->
		<div class="obc-header--parallax">
			<div class="obc-header--bkgimg w-1-1-per">
				<?php echo $headerBkgPhoto; ?>
			</div>
		</div>
		<!-- main -->
		<section class="obc-header--main">
			<main class="obc-header--mission | col-2-2 col-sm-3-5 col-lg-5-8">
				<?php perch_content_custom('Company Intro'); ?>
			</main>
			<aside class="obc-header--services | col-2-2 col-sm-2-5 col-lg-3-8">
				<p><?php echo $serviceStatement; ?></p>
				<?php perch_content_custom('Service List'); ?>
			</aside>
		</section>
	</header>
	<!-- END HEADER -->

	<!-- TESTIMONIALS -->
	<article id="obc-testimonials">
		<section class="obc-title">
			<?php perch_content_custom('Testimonials Section Title'); ?>
		</section>

		<!-- Slideshow -->
		<div class="obc-testimonials--slideshow | slideshow-wrapper">
			<!-- Slide container -->
			<div class="obc-testimonials--container | slides-container">
				<?php perch_content_custom('Testimonials'); ?>
			</div>
			<!-- END Slide container -->
			<!-- Slide controls -->
			<div class="slides-controls">
				<div class="fullscreen-btn hide"></div>
				<div class="slide-control-count hide">
					<span class="slide-control-current hide"></span> of <span class="slide-control-total hide"></span>
				</div>
				<div class="control slide-control-prev">
					<span class="show-min show-sm hide-md">previous</span>
					<div class="hide show-md">
						<span class="arrow arrow-left"></span>
					</div>
				</div>
				<div class="control slide-control-next">
					<span class="show-min show-sm hide-md">next</span>
					<div class="hide show-md">
						<span class="arrow arrow-right"></span>
					</div>
				</div>
			</div>
			<!-- Slide controls -->
		</div>
		<!-- Slide controls -->

	</article>
	<!-- END TESTIMONIALS -->

	<!-- CLIENTELE -->
	<article id="obc-clientele">
		<section class="padding-surround-bottom text-center">
			<?php perch_content_custom('Clientele Section Title'); ?>
		</section>
		<section id="show-all-clients" class="obc-clientele--grid" data-bind="click" data-event="showFullHeight" data-show-id="show-all-clients" data-hide-id="show-all-clients--button-hide">
			<?php perch_content_custom('Clientele'); ?>
		</section>
		<section id="show-all-clients--button-hide" class="padding text-center | show-min-only" data-bind="click" data-event="showFullHeight" data-show-id="show-all-clients" data-hide-id="show-all-clients--button-hide">
			<a href="#obc-clientele"><p><small>click to see more</small></p></a>
		</section>
	</article>
	<!-- END CLIENTELE -->

	<!-- ABOUT OBC -->
	<article id="obc-about">
		<section class="obc-about--expertise">
			<?php perch_content_custom('Expertise Section Title'); ?>
			<ul class="obc-about--expertise-grid | flex f-row f-wrap">
				<?php perch_content_custom('Expertise'); ?>
			</ul>
		</section>
		<aside class="obc-about--aside">
			<?php perch_content_custom('Announcement'); ?>
			<section class="obc-about--leadership">
				<?php perch_content_custom('Biography'); ?>
			</section>
		</aside>
	</article>
	<!-- END ABOUT OBC -->

	<!-- FOOTER -->
	<footer id="obc-contact">
		<section class="obc-title | col-2-2">
			<h2 class="text-left"><?php perch_content('Footer Contact Title'); ?></h2>
		</section>
		<section class="obc-contact--container">
			<div class="obc-contact--statement">
				<?php perch_content('Footer Text'); ?>
				<p>
					<em>Ocean Bright Consulting</em>
					<?php echo $ContactLocation; ?>
				</p>
			</div>
			<div class="obc-contact--actions">
				<a class="col-2-2 | button" target="_blank" href="tel:<?php echo $ContactPhone; ?>" onclick="ga('send',{'event','contact','contacted','contacted directly from website'});"><div><?php echo $ContactPhone; ?></div></a>
				<a class="col-2-2 | button" target="_blank" href="mailto:<?php echo $ContactEmail; ?>" onclick="ga('send',{'event','contact','contacted','contacted directly from website'});"><div>email us direct</div></a>
			</div>
			<div class="obc-contact--backtotop">
				<a class="col-2-2" href="#obc-header"><span class="arrow arrow-top"></span>back to top</a>
			</div>
			<h5 class="col-2-2 padding-top font-light">Header photography by <em><?php echo $headerBkgPhotoBy; ?></em>.</h5>
			<h5 class="joeygrablellc">Website designed &amp; developed by <em><a href="https://joeygrable.com" target="_blank">Joey Grable LLC</a></em>.</h5>
		</section>
	</footer>

<!-- Perch FOOTER -->
<?php perch_layout('global.footer'); ?>