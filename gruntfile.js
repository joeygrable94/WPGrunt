// GRUNT
module.exports = function(grunt) {

	// initial config
	grunt.initConfig({

	// =========================
	// VARIABLES
	// =========================
		pkg: grunt.file.readJSON('package.json'),
		paths: grunt.file.readJSON('paths.json'),
		secret: grunt.file.readJSON('secret.json'),
		timestamp: grunt.template.today('yyyy-mm-dd_HH-MM-ss'),


	// =========================
	// DEVELOPMENT
	// =========================

		// copy
		copy: {
			info: {
				files: [
					{
						expand: true,
						src: ['_README.md', '_LICENSE.md'],
						dest: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/'
					},
				]
			},
			scripts: {
				files: [
					{
						cwd: 'node_modules/html5-boilerplate/dist/js/vendor/',
						expand: true,
						src: 'modernizr-3.6.0.min.js',
						dest: '<%= paths.local.stack %>/js/vendors/'
					},
					{
						cwd: 'node_modules/html5-boilerplate/dist/js/vendor/',
						expand: true,
						src: 'jquery-3.3.1.min.js',
						dest: '<%= paths.local.stack %>/js/vendors/'
					},
					{
						cwd: 'node_modules/jquery-mousewheel/',
						expand: true,
						src: 'jquery.mousewheel.js',
						dest: '<%= paths.local.stack %>/js/vendors/'
					}
				] 
			},
			fonts: {
				files: [
					{
						cwd: '<%= paths.local.stack %>/fonts',
						expand: true,
						src: '*',
						dest: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/assets/fonts'
					}
				]
			}
		},

		// localization
		makepot: {
			target: {
				options: {
					cwd: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/',
					mainFile: './htpublic/index.php',
					potFilename: 'joeygrable.pot',
					domainPath: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/languages',
					type: 'wp-theme'
				}
			}
		},

		// GOOGLE FONTS — https://google-webfonts-helper.herokuapp.com/fonts
		curl: {
			'google-fonts-source': {
				src: 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCrD4mhSNS7LYjy1dcVq-AL4bBc47akVYM',
				dest: '<%= paths.local.stack %>/fonts/google-fonts-source.json'
			}
		},

		// compile, convert & compress sass
		sass: {
			dev: {
				options: {
					sourcemap: false,
					style: 'expanded'
				},
				files: [{
					expand: true,
					cwd: '<%= paths.local.sassy %>',
					src: ['*.scss'],
					dest: '<%= paths.local.stack %>/css',
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
				src: '<%= paths.local.stack %>/css/*.dev.css',
				dest: '<%= paths.local.stack %>/css/styles.prefixed.css'
			}
		},

		// minify css
		cssnano: {
			options: {
				sourcemap: false
			},
			dist: {
				src: '<%= paths.local.stack %>/css/styles.prefixed.css',
				dest: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/assets/css/styles.min.css',
			}
		},

		// lint JS for errors
		jshint: {
			files: [
				'gruntfile.js',
				'<%= paths.local.stack %>/js/wordpress/*.js',
				'<%= paths.local.stack %>/js/src/*.js',
				'<%= paths.local.stack %>/js/tests/*.js',
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
				separator: '\n\n\n\n\n/** ================================================== **/\n'
			},
			dev: {
				src: [
					'<%= paths.local.stack %>/js/vendors/*.js',
					'<%= paths.local.stack %>/js/wordpress/*.js',
					'<%= paths.local.stack %>/js/src/*.js',
					'<%= paths.local.stack %>/js/tests/*.js',
				],
				dest: '<%= paths.local.stack %>/js/concatenated/scripts.concat.js'
			}
		},

		// convert JS ES6 to ES5 compatible
		babel: {
			options: {
				sourceMap: false,
				presets: ['env']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= paths.local.stack %>/js/concatenated',
					src: ['*.js'],
					dest: '<%= paths.local.stack %>/js/compiled',
					ext: '.compiled.js'
				}]
			}
		},

		// compress JS
		uglify: {
			options: {
				mangle: true
			},
			build : {
				src : [
					'<%= paths.local.stack %>/js/compiled/scripts.compiled.js'
				],
				dest: '<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/assets/js/scripts.min.js',
			}
		},

		// watcher
		watch: {
			css: {
				files: [
					'<%= paths.local.sassy %>/**/*.scss'
				],
				tasks: ['sass', 'postcss', 'cssnano']
			},
			js: {
				files: [
					'<%= paths.local.stack %>/js/src/*.js',
					'<%= paths.local.stack %>/js/vendors/*.js',
					'<%= paths.local.stack %>/js/wordpress/*.js'
				],
				tasks: ['jshint', 'concat', 'babel', 'uglify']
			},
			php: {
				files: [
					'*.php',
					'<%= paths.wordpress.root %><%= paths.wordpress.active_theme %>/{,*/}*.php'
				],
			},
			options: {
				livereload: true,
				spawn: false
			}
		},


	// =========================
	// DEPLOYMENT
	// =========================
		
		// remote commands
		sshexec: {
			// DB-MIGRATE
			dump_remote_db: {
				options: { host: '<%= secret.remote.host %>', username: '<%= secret.remote.username %>', password: '<%= secret.remote.password %>' },
				command: [
					'cd <%= secret.remote.dump_path %>',
					//'mysqldump --host=<%= secret.remote.dbhost %> <%= secret.remote.dbname %> --user=<%= secret.remote.dbuser %> --password=<%= secret.remote.dbpass %> --max_allowed_packet=16M > <%= timestamp %>-remote.sql --force',
					'mysqldump --opt --user=<%= secret.remote.dbuser %> --password=<%= secret.remote.dbpass %> --host=<%= secret.remote.dbhost %> <%= secret.remote.dbname %> --max_allowed_packet=16M > <%= timestamp %>-remote.sql --force',
				].join(' && ')
			},
			import_migrated_local_dump: {
				options: { host: '<%= secret.remote.host %>', username: '<%= secret.remote.username %>', password: '<%= secret.remote.password %>' },
				command: [
					'cd <%= secret.remote.dump_path %>',
					'mysql --host=<%= secret.remote.dbhost %> <%= secret.remote.dbname %> --user=<%= secret.remote.dbuser %> --password=<%= secret.remote.dbpass %> --max_allowed_packet=16M < <%= timestamp %>-local_migrated.sql --force'
				].join(' && ')
			},
			// FILE-CLEANUP
			cleanup_remote: {
				options: { host: '<%= secret.remote.host %>', username: '<%= secret.remote.username %>', password: '<%= secret.remote.password %>' },
				command: [
					'cd <%= secret.remote.dump_path %>',
					'rm <%= timestamp %>-local_migrated.sql'
				].join(' && ')
			},
			cleanup_remote_dump: {
				options: { host: '<%= secret.remote.host %>', username: '<%= secret.remote.username %>', password: '<%= secret.remote.password %>' },
				command: [
					'cd <%= secret.remote.dump_path %>',
					'rm <%= timestamp %>-remote.sql'
				].join(' && ')
			},
		},

		// local commands
		exec: {

			// FILE-BACKUP
			backup_local_site: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_LOCAL_wp-content',
					'rsync -avr <%= paths.local.site_root %><%= paths.wordpress.content %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_LOCAL_wp-content'
				].join(' && ')
			},
			backup_remote_site: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_REMOTE_wp-content',
					'rsync -avr <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_content %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_REMOTE_wp-content'
				].join(' && ')
			},
			backup_local_theme: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_LOCAL_<%= paths.wordpress.theme_name %>',
					'rsync -avr <%= paths.local.site_root %><%= paths.wordpress.active_theme %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_LOCAL_<%= paths.wordpress.theme_name %>'
				].join(' && ')
			},
			backup_remote_theme: {
				command: [
					'mkdir <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_REMOTE_<%= paths.wordpress.theme_name %>',
					'rsync -avr <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_content %>/themes/<%= paths.wordpress.theme_name %>/ <%= paths.local.dump_dir %>/FILES/<%= timestamp %>_REMOTE_<%= paths.wordpress.theme_name %>',
				].join(' && ')
			},

			// DB-MIGRATE
			wget_remote_dump: {
				command: 'wget -nv <%= paths.remote.dump_url %>/<%= timestamp %>-remote.sql --directory-prefix=<%= paths.local.dump_dir %>/SQL'
			},
			import_migrated_remote_dump: {
				command: '/Applications/MAMP/Library/bin/mysql --host=<%= secret.local.dbhost %> <%= secret.local.dbname %> --user=<%= secret.local.dbuser %> --password=<%= secret.local.dbpass %> --max_allowed_packet=16M < <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-remote_migrated.sql --force'
			},
			cleanup_local: {
				command: 'rm -rf <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql'
			},
			cleanup_local_from_remote: {
				command: 'rm -rf <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-remote.sql <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-remote_migrated.sql'
			},
			dump_local_db: {
				command: '/Applications/MAMP/Library/bin/mysqldump --opt --host=<%= secret.local.dbhost %> -u<%= secret.local.dbuser %> -p<%= secret.local.dbpass %> <%= secret.local.dbname %> --max_allowed_packet=16M > <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql --force'
			},
			scp_local_dump: {
				command: 'scp <%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.dump_path %>'
			},
			fix_serialized_dump_local: {
				command: 'php -f <%= paths.local.dump_dir %>/fix-serialization.php SQL/<%= timestamp %>-local_migrated.sql'
			},
			fix_serialized_dump_remote: {
				command: 'php -f <%= paths.local.dump_dir %>/fix-serialization.php SQL/<%= timestamp %>-remote_migrated.sql'
			},

			// FILE-SYNC
			push_local_sync_server: {
				command: 'rsync -avr <%= paths.local.site_root %><%= paths.wordpress.content %>/ <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_root %><%= paths.wordpress.content %>'
			},
			pull_server_sync_local: {
				command: 'rsync -avr <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_root %><%= paths.wordpress.content %>/ <%= paths.local.site_root %><%= paths.wordpress.content %>'
			},
			push_theme_sync_server: {
				command: 'rsync -avr <%= paths.local.site_root %><%= paths.wordpress.active_theme %>/ <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_root %><%= paths.wordpress.active_theme %>'
			},
			pull_theme_sync_local: {
				command: 'rsync -avr <%= secret.remote.username %>@<%= secret.remote.host %>:<%= secret.remote.site_root %><%= paths.wordpress.active_theme %>/ <%= paths.local.site_root %><%= paths.wordpress.active_theme %>'
			}
		},

		// clean SQL data
		peach: {
			search_replace_remote_dump: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-remote.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-remote_migrated.sql',
				from: '<%= paths.remote.site_url %>',
				to:   '<%= paths.local.site_url %>'
			},
			search_replace_local_dump: {
				options: {
					force: true
				},
				src:  '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local.sql',
				dest: '<%= paths.local.dump_dir %>/SQL/<%= timestamp %>-local_migrated.sql',
				from: '<%= paths.local.site_url %>',
				to:   '<%= paths.remote.site_url %>'
			}
		}


	}); // END initial config


	// =========================
	// LOAD PLUGINS
	// =========================
		require('load-grunt-tasks')(grunt);
		grunt.loadNpmTasks('grunt-babel');


	// =========================
	// REGISTER DEV TASKS
	// =========================

		// default
		// -------------------------
		grunt.registerTask( 'default', [
			//'copy:scripts',
			//'copy:fonts',
			'sass',
			'postcss',
			'cssnano',
			'jshint',
			'concat',
			'babel',
			'uglify'
		]);

		// copy site meta
		// -------------------------
		grunt.registerTask( 'copy_site_meta', [
			'copy:info',
			'curl',
			'makepot'
		]);

		// build sass
		// -------------------------
		grunt.registerTask( 'sassy', [
			'sass',
			'postcss',
			'cssnano',
			'watch:css'
		]);


	// =========================
	// BACKUP WORDPRESS
	// =========================

		// FILE BACKUP
		// -------------------------
		// backup local site files
		grunt.registerTask( 'backup_local_site', [
			'exec:backup_local_site'
		]);

		// backup remote site files
		grunt.registerTask( 'backup_remote_site', [
			'exec:backup_remote_site'
		]);

		// backup local theme files
		grunt.registerTask( 'backup_local_theme', [
			'exec:backup_local_theme'
		]);

		// backup remote theme files
		grunt.registerTask( 'backup_remote_theme', [
			'exec:backup_remote_theme'
		]);


		// DB BACKUP
		// -------------------------
		// backup local DB SQL
		grunt.registerTask( 'backup_local_db', [
			'exec:dump_local_db',					// dump local database
			'peach:search_replace_local_dump',		// search and replace URLs in database
			'exec:fix_serialized_dump_local',		// fix php serialized arrays in the local migrated SQL
		]);

		// backup remote DB SQL
		grunt.registerTask( 'backup_remote_db', [
			'sshexec:dump_remote_db',				// dump remote database
			'exec:wget_remote_dump',				// download remote dump
			'sshexec:cleanup_remote_dump',			// delete remote database dump files
			'peach:search_replace_remote_dump',		// search and replace URLs in database
			'exec:fix_serialized_dump_remote',		// fix php serialized arrays in the remote migrated SQL
		]);


	// =========================
	// DEPLOY WORDPRESS
	// =========================

		// DB SYNC
		// -------------------------
		// pull remote DB to update local DB
		grunt.registerTask( 'sync_local_db', [
			'sshexec:dump_remote_db',				// dump remote database
			'exec:wget_remote_dump',				// download remote dump
			'sshexec:cleanup_remote_dump',			// delete remote database dump files
			'peach:search_replace_remote_dump',		// search and replace URLs in database
			'exec:fix_serialized_dump_remote',		// fix php serialized arrays in the remote migrated SQL
			'exec:import_migrated_remote_dump',		// import the migrated database
			// 'exec:cleanup_local_from_remote',		// delete local database dump files
		]);

		// push local DB to update remote DB
		grunt.registerTask( 'sync_remote_db', [
			'exec:dump_local_db',					// dump local database
			'peach:search_replace_local_dump',		// search and replace URLs in database
			'exec:fix_serialized_dump_local',		// fix php serialized arrays in the local migrated SQL
			'exec:scp_local_dump',					// upload local dump
			//'exec:cleanup_local',					// delete local database dump files
			'sshexec:import_migrated_local_dump',	// import the migrated database
			'sshexec:cleanup_remote',				// delete remote database dump file
		]);


		// FILE SYNC — ALL
		// -------------------------
		// push local files to update server — ALL /wp-content/files
		grunt.registerTask( 'push_local', [
			'exec:push_local_sync_server'
		]);

		// pull server files to update local — ALL /wp-content/files
		grunt.registerTask( 'pull_remote', [
			'exec:pull_server_sync_local'
		]);


		// FILE SYNC — THEME
		// -------------------------
		// push local theme to update server — ONLY ACTIVE THEME files
		grunt.registerTask( 'push_local_theme', [
			'exec:push_theme_sync_server'
		]);

		// pull server files to update local — ONLY ACTIVE THEME files
		grunt.registerTask( 'pull_remote_theme', [
			'exec:pull_theme_sync_local'
		]);

};