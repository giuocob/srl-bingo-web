module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			target: {
				files: [{
					expand: true,
					cwd: 'assets/styles/',
					src: '*.less',
					dest: 'public/css/',
					ext: '.css'
				}]
			}
		},

		copy: {
			target: {
				files: [{
					expand: true,
					cwd: 'assets/styles/',
					src: '*.css',
					dest: 'public/css/',
					ext: '.css'
				}, {
					expand: true,
					cwd: 'assets/js/',
					src: '*.js',
					dest: 'public/js/',
					ext: '.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['less', 'copy']);
};
