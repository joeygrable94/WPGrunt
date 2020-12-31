 <?php
/**
 * MSQL DATABASE SETTINGS
 */
$requested_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER[HTTP_HOST] . $_SERVER[REQUEST_URI];

# ENV: LOCAL
if ( strpos($requested_link, 'wpgrunt.local') ) {
	define( 'DB_HOST', 'localhost' );
	define( 'DB_NAME', 'wpgruntdb' );
	define( 'DB_USER', 'root' );
	define( 'DB_PASSWORD', 'root' );

# ENV: STAGING
} else if ( strpos($requested_link, 'SITEURL.src.pub') ) {
	define( 'DB_HOST', 'mysql.SITEURL.src.pub' );
	define( 'DB_NAME', 'SITEURL_db' );
	define( 'DB_USER', 'DB_USER' );
	define( 'DB_PASSWORD', 'DB_PASS' );
	define( 'WP_HOME', 'http://SITEURL.src.pub' );
	define( 'WP_SITEURL', 'http://SITEURL.src.pub' );

# ENV: PRODUCTION
} else if ( strpos($requested_link, 'SITEURL.com') ) {
	define( 'DB_HOST', 'mysql.SITEURL.com' );
	define( 'DB_NAME', 'SITEURL_db' );
	define( 'DB_USER', 'DB_USER' );
	define( 'DB_PASSWORD', 'DB_PASS' );
	define( 'WP_HOME', 'http://SITEURL.com' );
	define( 'WP_SITEURL', 'http://SITEURL.com' );
}

# ENV: WPSALT
define( 'AUTH_KEY', 'xSd0Kj9tB81WovZBiLOslXQSsZ6tckcmY9ZMBzpgn94XH8sdiNbM576AEttXlax5' );
define( 'LOGGED_IN_KEY', '1WPpXIa7TnhWJBKFPzbw28NgPnGBackA1MvzBYjamtcW8dn13HRiHKDrNBBOZeZs' );
define( 'NONCE_KEY', 'TL4gFD8WBLMrSUNeKnWUkf3CziWw6gA2TRSB1BQE9UQlVIzjklSQfkRZo3DonVhy' );
define( 'AUTH_SALT', 'hxbIMsDnUgLSSiuULV4BPvURC8AtiWwWL4R2qoYjxJsxH4cqaQavun3JcTMitFhZ' );
define( 'LOGGED_IN_SALT', 'A1Tng3Zba5cZT7UcksGjXRVQXp4sBapMgGm6KQoOwUpsz2f5A9jvKW5xOLL1s6TE' );
define( 'NONCE_SALT', 'XoW9CfhDl0PyDbyMAS9m1HZ3IhlcTahgkzccgUjNPt0zKYrwep8pt4AqK7b4r1O2' );

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

