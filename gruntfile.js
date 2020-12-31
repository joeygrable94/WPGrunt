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
		config: grunt.file.readJSON('build.json'),

	// -------------------------
	// DEVELOPMENT TASKS
	// -------------------------
		copy: {
			styles: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= config.dev_stack %>/css/styles.min.css'],
						dest: '<%= config.dist_stack %>/css/',
						filter: 'isFile'
					},
				]
			},
			scripts: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= config.dev_stack %>/js/dist/scripts.min.js'],
						dest: '<%= config.dist_stack %>/js/',
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
					cwd: '<%= config.dev_stack %>/sass-gc/',
					src: ['*.scss'],
					dest: '<%= config.dev_stack %>/css/',
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
				src: '<%= config.dev_stack %>/css/*.dev.css',
				dest: '<%= config.dev_stack %>/css/styles.prefixed.css'
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
					cwd: '<%= config.dev_stack %>/css/',
					src: 'styles.prefixed.css',
					dest: '<%= config.dev_stack %>/css/',
					ext: '.min.css'
				}]
			}
		},

		// lint JS for errors
		jshint: {
			files: [
				'gruntfile.js',
				'<%= config.dev_stack %>/js/src/*.js'
			],
			options: {
				esversion: 6,
				globals: {
					jQuery: false
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
					'<%= config.dev_stack %>/js/vendors/*.js',
					'<%= config.dev_stack %>/js/src/*.js'
				],
				dest: '<%= config.dev_stack %>/js/dist/scripts.concat.js'
			}
		},

		// compress JS
		uglify: {
			options: {
				mangle: true
			},
			build : {
				src : [
					'<%= config.dev_stack %>/js/dist/scripts.concat.js'
				],
				dest: '<%= config.dev_stack %>/js/dist/scripts.min.js'
			}
		},

		// watcher
		watch: {
			css: {
				files: ['<%= config.dev_stack %>/sass-gc/**/*.scss'],
				tasks: ['sass', 'postcss', 'cssmin', 'copy']
			},
			js: {
				files: [
					'<%= config.dev_stack %>/js/src/*.js',
					'<%= config.dev_stack %>/js/vendors/*.js',
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
				options: { host: '<%= config.staging.host %>', username: '<%= config.staging.ssh_user %>', password: '<%= config.staging.ssh_pass %>' },
				command: [
					'cd <%= config.staging.dump_path %>',
					'mysqldump --host=<%= config.staging.db_host %> <%= config.staging.db_name %> --user=<%= config.staging.db_user %> --password=<%= config.staging.db_password %> --max_allowed_packet=16M > <%= timestamp %>-staging.sql --force',
				].join(' && ')
			},
			dump_production_db: {
				options: { host: '<%= config.production.host %>', username: '<%= config.production.ssh_user %>', password: '<%= config.production.ssh_pass %>' },
				command: [
					'cd <%= config.production.dump_path %>',
					'mysqldump --host=<%= config.production.db_host %> <%= config.production.db_name %> --user=<%= config.production.db_user %> --password=<%= config.production.db_password %> --max_allowed_packet=16M > <%= timestamp %>-production.sql --force',
				].join(' && ')
			},
			import_staging_migrated_local_dump: {
				options: { host: '<%= config.staging.host %>', username: '<%= config.staging.ssh_user %>', password: '<%= config.staging.ssh_pass %>' },
				command: [
					'cd <%= config.staging.dump_path %>',
					'mysql --host=<%= config.staging.db_host %> <%= config.staging.db_name %> --user=<%= config.staging.db_user %> --password=<%= config.staging.db_password %> --max_allowed_packet=100M < <%= timestamp %>-local_migrated.sql --force'
				].join(' && ')
			},
			import_production_migrated_local_dump: {
				options: { host: '<%= config.production.host %>', username: '<%= config.production.ssh_user %>', password: '<%= config.production.ssh_pass %>' },
				command: [
					'cd <%= config.production.dump_path %>',
					'mysql --host=<%= config.production.db_host %> <%= config.production.db_name %> --user=<%= config.production.db_user %> --password=<%= config.production.db_password %> --max_allowed_packet=100M < <%= timestamp %>-local_migrated.sql --force'
				].join(' && ')
			},
			// FILE-CLEANUP
			cleanup_staging: {
				options: { host: '<%= config.staging.host %>', username: '<%= config.staging.ssh_user %>', password: '<%= config.staging.ssh_pass %>' },
				command: [
					'cd <%= config.staging.dump_path %>',
					'rm <%= timestamp %>-local_migrated.sql'
				].join(' && ')
			},
			cleanup_staging_dump: {
				options: { host: '<%= config.staging.host %>', username: '<%= config.staging.ssh_user %>', password: '<%= config.staging.ssh_pass %>' },
				command: [
					'cd <%= config.staging.dump_path %>',
					'rm <%= timestamp %>-staging.sql'
				].join(' && ')
			},
			cleanup_production: {
				options: { host: '<%= config.production.host %>', username: '<%= config.production.ssh_user %>', password: '<%= config.production.ssh_pass %>' },
				command: [
					'cd <%= config.production.dump_path %>',
					'rm <%= timestamp %>-local_migrated.sql'
				].join(' && ')
			},
			cleanup_production_dump: {
				options: { host: '<%= config.production.host %>', username: '<%= config.production.ssh_user %>', password: '<%= config.production.ssh_pass %>' },
				command: [
					'cd <%= config.production.dump_path %>',
					'rm <%= timestamp %>-production.sql'
				].join(' && ')
			}
		},

		// local commands
		exec: {
			// BACKUP
			backup_local_site: {
				command: [
					'mkdir <%= config.local.backups %>/FILES/<%= timestamp %>_local_content',
					'rsync -avr <%= config.local.site_dir %>/ <%= config.local.backups %>/FILES/<%= timestamp %>_local_content'
				].join(' && ')
			},
			backup_staging_site: {
				command: [
					'mkdir <%= config.local.backups %>/FILES/<%= timestamp %>_staging_content',
					'rsync -avr <%= config.staging.ssh_user %>@<%= config.staging.host %>:<%= config.staging.site_dir %>/ <%= config.local.backups %>/FILES/<%= timestamp %>_staging_content'
				].join(' && ')
			},
			backup_production_site: {
				command: [
					'mkdir <%= config.local.backups %>/FILES/<%= timestamp %>_production_content',
					'rsync -avr <%= config.production.ssh_user %>@<%= config.production.host %>:<%= config.production.site_dir %>/ <%= config.local.backups %>/FILES/<%= timestamp %>_production_content'
				].join(' && ')
			},
			// DB-MIGRATE
			wget_staging_dump: {
				command: 'wget -nv <%= config.staging.access %><%= config.staging.host %>/dumps/<%= timestamp %>-staging.sql --directory-prefix=<%= config.local.backups %>/SQL'
			},
			wget_production_dump: {
				command: 'wget -nv <%= config.production.access %><%= config.production.host %>/dumps/<%= timestamp %>-production.sql --directory-prefix=<%= config.local.backups %>/SQL'
			},
			import_migrated_staging_dump: {
				command: '<%= config.local.mamp %>/mysql -uroot -proot --host=<%= config.local.db_host %> <%= config.local.db_name %> --max_allowed_packet=1000M < <%= config.local.backups %>/SQL/<%= timestamp %>-staging_migrated.sql --force'
			},
			import_migrated_production_dump: {
				command: '<%= config.local.mamp %>/mysql --host=<%= config.local.db_host %> <%= config.local.db_name %> --user=<%= config.local.db_user %> --password=<%= config.local.db_password %> --max_allowed_packet=1000M < <%= config.local.backups %>/SQL/<%= timestamp %>-production_migrated.sql --force'
			},
			cleanup_local: {
				command: 'rm -rf <%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql'
			},
			cleanup_local_from_staging: {
				command: 'rm -rf <%= config.local.backups %>/sql/<%= timestamp %>-staging.sql <%= config.local.backups %>/sql/<%= timestamp %>-staging_migrated.sql'
			},
			cleanup_local_from_production: {
				command: 'rm -rf <%= config.local.backups %>/sql/<%= timestamp %>-production:.sql <%= config.local.backups %>/sql/<%= timestamp %>-production_migrated.sql'
			},
			dump_local_db: {
				command: '<%= config.local.mamp %>/mysqldump --opt --host=<%= config.local.db_host %> -u<%= config.local.db_user %> -p<%= config.local.db_password %> <%= config.local.db_name %> --max_allowed_packet=16M > <%= config.local.backups %>/SQL/<%= timestamp %>-local.sql --force'
			},
			upload_local_dump_to_staging: {
				command: 'scp <%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql <%= config.staging.ssh_user %>@<%= config.staging.host %>:<%= config.staging.dump_path %>'
			},
			upload_local_dump_to_production: {
				command: 'scp <%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql <%= config.production.ssh_user %>@<%= config.production.host %>:<%= config.production.dump_path %>'
			},
			// 
			fix_serialized_dump_local: {
				command: 'php -f <%= config.local.backups %>/fix-serialization.php SQL/<%= timestamp %>-local_migrated.sql'
			},
			fix_serialized_dump_staging: {
				command: 'php -f <%= config.local.backups %>/fix-serialization.php SQL/<%= timestamp %>-staging_migrated.sql'
			},
			fix_serialized_dump_production: {
				command: 'php -f <%= config.local.backups %>/fix-serialization.php SQL/<%= timestamp %>-production_migrated.sql'
			},
			// FILE-SYNC
			push_local_sync_staging: {
				command: 'rsync -avr <%= config.local.site_dir %>/ <%= config.staging.ssh_user %>@<%= config.staging.host %>:<%= config.staging.site_dir %>'
			},
			push_local_sync_production: {
				command: 'rsync -avr <%= config.local.site_dir %>/ <%= config.production.ssh_user %>@<%= config.production.host %>:<%= config.production.site_dir %>'
			},
			pull_staging_sync_local: {
				command: 'rsync -auvr <%= config.staging.ssh_user %>@<%= config.staging.host %>:<%= config.staging.site_dir %>/ <%= config.local.site_dir %>'
			},
			pull_production_sync_local: {
				command: 'rsync -avr <%= config.production.ssh_user %>@<%= config.production.host %>:<%= config.production.site_dir %>/ <%= config.local.site_dir %>'
			}
		},
		// clean SQL data
		peach: {
			search_replace_local_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= config.local.backups %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
				to:   '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
			},
			search_replace_local_dump_to_staging: {
				options: {
					force: true
				},
				src:  '<%= config.local.backups %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
				to:   '<%= config.staging.access %><%= config.staging.host %>/',
			},
			search_replace_local_dump_to_production: {
				options: {
					force: true
				},
				src:  '<%= config.local.backups %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= config.local.backups %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
				to:   '<%= config.production.access %><%= config.production.host %>/',
			},
			search_replace_staging_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= config.local.backups %>/SQL/<%= timestamp %>-staging.sql',
				dest: '<%= config.local.backups %>/SQL/<%= timestamp %>-staging_migrated.sql',
				from: '<%= config.staging.access %><%= config.staging.host %>/',
				to:   '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
			},
			search_replace_production_dump_to_local: {
				options: {
					force: true
				},
				src:  '<%= config.local.backups %>/SQL/<%= timestamp %>-production.sql',
				dest: '<%= config.local.backups %>/SQL/<%= timestamp %>-production_migrated.sql',
				from: '<%= config.production.access %><%= config.production.host %>/',
				to:   '<%= config.local.access %><%= config.local.host %>:<%= config.local.port %>/',
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
