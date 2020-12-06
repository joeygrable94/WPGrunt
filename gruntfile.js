// node imports
const sass_basic = require('node-sass');


// GRUNT
module.exports = function(grunt) {

	// -------------------------
	// INITIALIZATION
	// -------------------------
	grunt.initConfig({
	// -------------------------
	// VARIABLES
	// -------------------------
		pkg: grunt.file.readJSON('package.json'),
		timestamp: grunt.template.today('yyyy-mm-dd_HH'),
		paths: grunt.file.readJSON('paths.json'),
		secret: grunt.file.readJSON('secret.json'),

	// -------------------------
	// DEVELOPMENT TASKS
	// -------------------------
		copy: {
			styles: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= paths.local.dev_stack %>/css/styles.min.css'],
						dest: '<%= paths.local.dist_stack %>/css/',
						filter: 'isFile'
					},
				]
			},
			scripts: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= paths.local.dev_stack %>/js/to_dist/scripts.min.js'],
						dest: '<%= paths.local.dist_stack %>/js/',
						filter: 'isFile'
					}
				]
			}
		},

		// compile, convert & compress sass
		sass: {
			dev: {
				options: {
					implementation: sass_basic,
					sourcemap: false,
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: '<%= paths.local.dev_stack %>/sass/',
					src: ['*.scss'],
					dest: '<%= paths.local.dev_stack %>/css/',
					ext: '.dev.css'
				}]
			}
		},
		
		// prefix css
		postcss: {
			options: {
				sourcemap: false,
				processors: [
					require('autoprefixer')()
				],
			},
			dist: {
				src: '<%= paths.local.dev_stack %>/css/*.dev.css',
				dest: '<%= paths.local.dev_stack %>/css/styles.prefixed.css'
			}
		},

		// minify css
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			target: {
				files: [{
					expand: true,
					cwd: '<%= paths.local.dev_stack %>/css/',
					src: 'styles.prefixed.css',
					dest: '<%= paths.local.dev_stack %>/css/',
					ext: '.min.css'
				}]
			}
		},

		// lint JS for errors
		jshint: {
			files: [
				'gruntfile.js',
				'<%= paths.local.dev_stack %>/js/src/*.js'
			],
			options: {
				esversion: 6,
				globals: {
					jQuery: true
				}
			}
		},

		// concat all js files
		concat: {
			options: {
				sourceMap: false,
				separator: '\n\n\n\n\n/** -------------------------------------------------- **/\n'
			},
			dist: {
				src: [
					'<%= paths.local.dev_stack %>/js/vendors/*.js',
					'<%= paths.local.dev_stack %>/js/src/*.js'
				],
				dest: '<%= paths.local.dev_stack %>/js/to_dist/scripts.concat.js'
			}
		},

		// compress JS
		uglify: {
			options: {
				mangle: true
			},
			build : {
				src : [
					'<%= paths.local.dev_stack %>/js/to_dist/scripts.concat.js'
				],
				dest: '<%= paths.local.dev_stack %>/js/to_dist/scripts.min.js'

			}
		},

		// watcher
		watch: {
			css: {
				files: ['<%= paths.local.dev_stack %>/sass/**/*.scss'],
				tasks: ['sass', 'postcss', 'cssmin', 'copy']
			},
			js: {
				files: [
					'<%= paths.local.dev_stack %>/js/src/*.js',
					'<%= paths.local.dev_stack %>/js/vendors/*.js',
				],
				tasks: ['jshint', 'concat', 'uglify', 'copy']
			},
			options: {
				livereload: true,
				spawn: false
			}
		},

	// -------------------------
	// DEPLOYMENT TASKS
	// -------------------------
		// remote commands
		sshexec: {

			// DB-MIGRATE
			dump_staging_db: {
				options: { host: '<%= secret.staging.host %>', username: '<%= secret.staging.username %>', password: '<%= secret.staging.password %>' },
				command: [
					'cd <%= secret.staging.dump_path %>',
					'mysqldump --host=<%= secret.staging.dbhost %> <%= secret.staging.dbname %> --user=<%= secret.staging.dbuser %> --password=<%= secret.staging.dbpass %> --max_allowed_packet=16M > <%= timestamp %>-staging.sql --force',
				].join(' && ')
			},
			dump_production_db: {
				options: { host: '<%= secret.production.host %>', username: '<%= secret.production.username %>', password: '<%= secret.production.password %>' },
				command: [
					'cd <%= secret.production.dump_path %>',
					'mysqldump --host=<%= secret.production.dbhost %> <%= secret.production.dbname %> --user=<%= secret.production.dbuser %> --password=<%= secret.production.dbpass %> --max_allowed_packet=16M > <%= timestamp %>-production.sql --force',
				].join(' && ')
			},
			import_staging_migrated_local_dump: {
				options: { host: '<%= secret.staging.host %>', username: '<%= secret.staging.username %>', password: '<%= secret.staging.password %>' },
				command: [
					'cd <%= secret.staging.dump_path %>',
					'mysql --host=<%= secret.staging.dbhost %> <%= secret.staging.dbname %> --user=<%= secret.staging.dbuser %> --password=<%= secret.staging.dbpass %> --max_allowed_packet=100M < <%= timestamp %>-local_migrated.sql --force'
				].join(' && ')
			},
			import_production_migrated_local_dump: {
				options: { host: '<%= secret.production.host %>', username: '<%= secret.production.username %>', password: '<%= secret.production.password %>' },
				command: [
					'cd <%= secret.production.dump_path %>',
					'mysql --host=<%= secret.production.dbhost %> <%= secret.production.dbname %> --user=<%= secret.production.dbuser %> --password=<%= secret.production.dbpass %> --max_allowed_packet=100M < <%= timestamp %>-local_migrated.sql --force'
				].join(' && ')
			},
			// FILE-CLEANUP
			cleanup_staging: {
				options: { host: '<%= secret.staging.host %>', username: '<%= secret.staging.username %>', password: '<%= secret.staging.password %>' },
				command: [
					'cd <%= secret.staging.dump_path %>',
					'rm <%= timestamp %>-local_migrated.sql'
				].join(' && ')
			},
			cleanup_staging_dump: {
				options: { host: '<%= secret.staging.host %>', username: '<%= secret.staging.username %>', password: '<%= secret.staging.password %>' },
				command: [
					'cd <%= secret.staging.dump_path %>',
					'rm <%= timestamp %>-staging.sql'
				].join(' && ')
			},
			cleanup_production: {
				options: { host: '<%= secret.production.host %>', username: '<%= secret.production.username %>', password: '<%= secret.production.password %>' },
				command: [
					'cd <%= secret.production.dump_path %>',
					'rm <%= timestamp %>-local_migrated.sql'
				].join(' && ')
			},
			cleanup_production_dump: {
				options: { host: '<%= secret.production.host %>', username: '<%= secret.production.username %>', password: '<%= secret.production.password %>' },
				command: [
					'cd <%= secret.production.dump_path %>',
					'rm <%= timestamp %>-production.sql'
				].join(' && ')
			}
		},

		// local commands
		exec: {
			// BACKUP
			backup_local_site: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_local_content',
					'rsync -avr <%= paths.local.site_root %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_local_content'
				].join(' && ')
			},
			backup_staging_site: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_staging_content',
					'rsync -avr <%= secret.staging.username %>@<%= secret.staging.host %>:<%= secret.staging.site_root %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_staging_content'
				].join(' && ')
			},
			backup_production_site: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_production_content',
					'rsync -avr <%= secret.production.username %>@<%= secret.production.host %>:<%= secret.production.site_root %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_production_content'
				].join(' && ')
			},
			// DB-MIGRATE
			wget_staging_dump: {
				command: 'wget -nv <%= paths.staging.dump_url %>/<%= timestamp %>-staging.sql --directory-prefix=<%= paths.local.dump_dir %>/SQL'
			},
			wget_production_dump: {
				command: 'wget -nv <%= paths.production.dump_url %>/<%= timestamp %>-production.sql --directory-prefix=<%= paths.local.dump_dir %>/SQL'
			},
			import_migrated_staging_dump: {
				command: '<%= paths.local.mamp %>/mysql -uroot -proot --host=<%= secret.local.dbhost %> <%= secret.local.dbname %> --max_allowed_packet=1000M < <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-staging_migrated.sql --force'
			},
			import_migrated_production_dump: {
				command: '<%= paths.local.mamp %>/mysql --host=<%= secret.local.dbhost %> <%= secret.local.dbname %> --user=<%= secret.local.dbuser %> --password=<%= secret.local.dbpass %> --max_allowed_packet=1000M < <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-production_migrated.sql --force'
			},
			cleanup_local: {
				command: 'rm -rf <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql'
			},
			cleanup_local_from_staging: {
				command: 'rm -rf <%= paths.local.dump_dir %>/sql/<%= timestamp %>-staging.sql <%= paths.local.dump_dir %>/sql/<%= timestamp %>-staging_migrated.sql'
			},
			cleanup_local_from_production: {
				command: 'rm -rf <%= paths.local.dump_dir %>/sql/<%= timestamp %>-production:.sql <%= paths.local.dump_dir %>/sql/<%= timestamp %>-production_migrated.sql'
			},
			dump_local_db: {
				command: '<%= paths.local.mamp %>/mysqldump --opt --host=<%= secret.local.dbhost %> -u<%= secret.local.dbuser %> -p<%= secret.local.dbpass %> <%= secret.local.dbname %> --max_allowed_packet=16M > <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql --force'
			},
			upload_local_dump_to_staging: {
				command: 'scp <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql <%= secret.staging.username %>@<%= secret.staging.host %>:<%= secret.staging.dump_path %>'
			},
			upload_local_dump_to_production: {
				command: 'scp <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql <%= secret.production.username %>@<%= secret.production.host %>:<%= secret.production.dump_path %>'
			},
			// 
			fix_serialized_dump_local: {
				command: 'php -f <%= paths.local.dump_dir %>/fix-serialization.php SQL/<%= timestamp %>-local_migrated.sql'
			},
			fix_serialized_dump_staging: {
				command: 'php -f <%= paths.local.dump_dir %>/fix-serialization.php SQL/<%= timestamp %>-staging_migrated.sql'
			},
			fix_serialized_dump_production: {
				command: 'php -f <%= paths.local.dump_dir %>/fix-serialization.php SQL/<%= timestamp %>-production_migrated.sql'
			},
			// FILE-SYNC
			push_local_sync_staging: {
				command: 'rsync -avr <%= paths.local.site_root %>/ <%= secret.staging.username %>@<%= secret.staging.host %>:<%= secret.staging.site_root %>'
			},
			push_local_sync_production: {
				command: 'rsync -avr <%= paths.local.site_root %>/ <%= secret.production.username %>@<%= secret.production.host %>:<%= secret.production.site_root %>'
			},
			pull_staging_sync_local: {
				command: 'rsync -auvr <%= secret.staging.username %>@<%= secret.staging.host %>:<%= secret.staging.site_root %>/ <%= paths.local.site_root %>'
			},
			pull_production_sync_local: {
				command: 'rsync -avr <%= secret.production.username %>@<%= secret.production.host %>:<%= secret.production.site_root %>/ <%= paths.local.site_root %>'
			}
		},
		// clean SQL data
		peach: {
			search_replace_local_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= paths.local.site_url %>',
				to:   '<%= paths.local.site_url %>'
			},
			search_replace_local_dump_to_staging: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= paths.local.site_url %>',
				to:   '<%= paths.staging.site_url %>'
			},
			search_replace_local_dump_to_production: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= paths.local.site_url %>',
				to:   '<%= paths.production.site_url %>'
			},
			search_replace_staging_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-staging.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-staging_migrated.sql',
				from: '<%= paths.staging.site_url %>',
				to:   '<%= paths.local.site_url %>'
			},
			search_replace_production_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-production.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-production_migrated.sql',
				from: '<%= paths.production.site_url %>',
				to:   '<%= paths.local.site_url %>'
			}
		}
	});

	// -------------------------
	// LOAD PLUGINS
	// -------------------------
	require('load-grunt-tasks')(grunt);


	// -------------------------
	// DEVELOPMENT TASK RUNNERS
	// -------------------------
	grunt.registerTask('default', [
		'sass',
		'postcss',
		'cssmin',
		'jshint',
		'concat',
		'uglify',
		'copy'
	]);



	// -------------------------
	// BACKUP TASK RUNNERS
	// -------------------------

		// FILE BACKUP
		// -------------------------
		// backup local site files
		grunt.registerTask( 'backup_local_site', [
			'exec:backup_local_site'
		]);

		// backup staging site files
		grunt.registerTask( 'backup_staging_site', [
			'exec:backup_staging_site'
		]);

		// backup production site files
		grunt.registerTask( 'backup_production_site', [
			'exec:backup_production_site'
		]);

		// DB BACKUP
		// -------------------------
		// backup local DB SQL
		grunt.registerTask( 'backup_local_db', [
			'exec:dump_local_db',							// dump local database
			'peach:search_replace_local_dump_to_local',		// search and replace URLs in database
			'exec:fix_serialized_dump_local'				// fix php serialized arrays in the local migrated SQL
		]);

		// backup staging DB SQL
		grunt.registerTask( 'backup_staging_db', [
			'sshexec:dump_staging_db',						// dump staging database
			'exec:wget_staging_dump',						// download staging dump
			'sshexec:cleanup_staging_dump',					// delete staging database dump files
			'peach:search_replace_staging_dump_to_local',	// search and replace URLs in database
			'exec:fix_serialized_dump_staging'				// fix php serialized arrays in the staging migrated SQL
		]);

		// backup production DB SQL
		grunt.registerTask( 'backup_production_db', [
			'sshexec:dump_production_db',					// dump staging database
			'exec:wget_production_dump',					// download staging dump
			'sshexec:cleanup_production_dump',				// delete staging database dump files
			'peach:search_replace_production_dump_to_local',// search and replace URLs in database
			'exec:fix_serialized_dump_production'			// fix php serialized arrays in the staging migrated SQL
		]);



	// -------------------------
	// STAGING TASK RUNNERS
	// -------------------------

		// DB SYNC
		// -------------------------
		// push local DB to update staging DB
		grunt.registerTask( 'sync_staging_db_from_local', [
			'exec:dump_local_db',							// dump local database
			'peach:search_replace_local_dump_to_staging',	// search and replace URLs in database
			'exec:fix_serialized_dump_local',				// fix php serialized arrays in the local migrated SQL
			'exec:upload_local_dump_to_staging',			// upload local dump
			'exec:cleanup_local',							// delete local database dump files
			'sshexec:import_staging_migrated_local_dump',	// import the migrated database
			'sshexec:cleanup_staging'						// delete staging database dump file
		]);

		// pull staging DB to update local DB
		grunt.registerTask( 'sync_local_db_from_staging', [
			'sshexec:dump_staging_db',						// dump staging database
			'exec:wget_staging_dump',						// download staging dump
			'sshexec:cleanup_staging_dump',					// delete staging database dump files
			'peach:search_replace_staging_dump_to_local',	// search and replace URLs in database
			'exec:fix_serialized_dump_staging',				// fix php serialized arrays in the staging migrated SQL
			'exec:import_migrated_staging_dump',			// import the migrated database
			'exec:cleanup_local_from_staging'				// delete local database dump files
		]);

		// file sync — all
		// -------------------------
		// push local files to update staging server — all
		grunt.registerTask( 'push_local_update_staging', [
			'exec:push_local_sync_staging'
		]);

		// pull staging server files to update local — all
		grunt.registerTask( 'pull_staging_update_local', [
			'exec:pull_staging_sync_local'
		]);



	// -------------------------
	// PRODUCTION TASK RUNNERS
	// -------------------------

		// DB SYNC
		// -------------------------
		// pull production DB to update local DB
		grunt.registerTask( 'sync_local_db_from_production', [
			'sshexec:dump_production_db',					// dump production database
			'exec:wget_production_dump',					// download production dump
			'sshexec:cleanup_production_dump',				// delete production database dump files
			'peach:search_replace_production_dump_to_local',// search and replace URLs in database
			'exec:fix_serialized_dump_production',			// fix php serialized arrays in the production migrated SQL
			'exec:import_migrated_production_dump',			// import the migrated database
			'exec:cleanup_local_from_production'			// delete local database dump files
		]);

		// push local DB to update production DB
		grunt.registerTask( 'sync_production_db_from_local', [
			'exec:dump_local_db',							// dump local database
			'peach:search_replace_local_dump_to_production',// search and replace URLs in database
			'exec:fix_serialized_dump_local',				// fix php serialized arrays in the local migrated SQL
			'exec:upload_local_dump_to_production',			// upload local dump to production
			'exec:cleanup_local',							// delete local database dump files
			'sshexec:import_production_migrated_local_dump',// import the migrated database
			'sshexec:cleanup_production'					// delete production database dump file
		]);

		// file sync — all
		// -------------------------
		// pull staging server files to update local — ALL FILES
		grunt.registerTask( 'pull_production_update_local', [
			'exec:pull_production_sync_local'
		]);
		// push local files to update production server — ALL FILES
		grunt.registerTask( 'push_local_update_production', [
			'exec:push_local_sync_production'
		]);

};
