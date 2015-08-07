module.exports = function ( grunt ) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		pkg    : grunt.file.readJSON('package.json'),

		// Minify JS
		uglify : {
			js: {
				files: {
					'js/mobile-friendly-audit.min.js': 'js/mobile-friendly-audit.js'
				}
			}
		},

		// SASS to CSS config
		sass: {
			dist: {
				files: {
					'css/mobile-friendly-audit.css': 'sass/mobile-friendly-audit.scss'
				}
			}
		},

		// Concatenate files
		concat: {
			css: {
				src: [
					'css/mobile-friendly-audit.css'
				],
				dest: 'css/mobile-friendly-audit.combined.css'
			},
			js: {
				src: 'js/mobile-friendly-audit.js',
				dest: 'js/mobile-friendly-audit.combined.js'
			}
		},

		// Minify CSS
		cssmin : {
			css:{
				src: 'css/mobile-friendly-audit.combined.css',
				dest: 'css/mobile-friendly-audit.min.css'
			}
		},

		// Watch for changes to sass and js..
		watch  : {
			css   : {
				files: '**/*.scss',
				tasks: ['sass', 'concat', 'cssmin', 'clean']
			},
			scripts: {
				files: ['**/*.js'],
				tasks: ['concat', 'uglify', 'clean']
			}
		},

		// Cleanup unused build files from dist folder
		clean: {
			js: [
				'js/*.js',
				'!js/mobile-friendly-audit.js',
				'!js/mobile-friendly-audit.min.js'
			],
			css: [
				'css/*.css',
				'!css/font-awesome.min.css',
				'!css/mobile-friendly-audit.min.css'
			]
		}

	});

	/*
	    Custom Tasks
	 */

	// Build task
	grunt.registerTask('build', ['sass', 'concat', 'cssmin', 'uglify', 'clean']);

};