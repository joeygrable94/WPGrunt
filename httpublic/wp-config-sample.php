 <?php
/**
 * MSQL DATABASE SETTINGS
 */
$requested_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER[HTTP_HOST] . $_SERVER[REQUEST_URI];

# ENV: LOCAL
if ( strpos($requested_link, 'WEBSITE.local') ) {
		define( 'DB_HOST', '' );
		define( 'DB_NAME', '' );
		define( 'DB_USER', '' );
		define( 'DB_PASSWORD', '' );

# ENV: STAGING
} else if ( strpos($requested_link, 'WEBSITE.src.pub') ) {
		define( 'DB_HOST', '' );
		define( 'DB_NAME', '' );
		define( 'DB_USER', '' );
		define( 'DB_PASSWORD', '' );
		define( 'WP_HOME', '' );
		define( 'WP_SITEURL', '' );

# ENV: PRODUCTION
} else if ( strpos($requested_link, 'WEBSITE.com') ) {
		define( 'DB_HOST', '' );
		define( 'DB_NAME', '' );
		define( 'DB_USER', '' );
		define( 'DB_PASSWORD', '' );
		define( 'WP_HOME', '' );
		define( 'WP_SITEURL', '' );
}

# ENV: WPSALT
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );

/**
 * DB charset
 */
define( 'DB_CHARSET', 'utf8');
define( 'DB_COLLATE', '');

/**
 * WordPress Database Table prefix.
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 */
define( 'WP_DEBUG', false );

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
