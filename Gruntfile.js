module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! I am Ugly! */\n',
				compress: true,
				mangle: true,
				sourceMap: true
			},
			target: {
				src: 'src/js/main.js',
				dest: 'dist/js/main.min.js'
			}
		},
		markdown: {
		    all: {
		      files: [
		        {
		          expand: true,
		          src: 'index.md',
		          dest: 'html/',
		          ext: '.html'
		        }
		      ]
		    }
		},
		validation: {
		    options: {
		        reset: grunt.option('reset') || false,
		        stoponerror: false,
		        relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors 
		    },
		    files: {
		        src: 'index.html'
		    }
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.',
					livereload: true
				}
			}
		},
		watch: {
		    files: ['index.html','css/main.css'],
		    tasks: ['validation'],
		    options: {
		      livereload: true
		    }
		}		
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-html-validation');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task
	grunt.registerTask('default', ['connect','watch']);
};