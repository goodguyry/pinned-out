'use strict';
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.longName %> v<%= pkg.version %> by <%= pkg.author.name %>\n' +
            ' * Source available at <%= pkg.homepage %> */',

    html_banner:  '<!--\n' + ' <%= pkg.longName %> v<%= pkg.version %> by <%= pkg.author.name %>\n' +
                  ' Source available at <%= pkg.homepage %>\n' + '-->',

    jshint: {
      files: ['src/*.js', 'src/**/*.js'],
      options: {
        jshintrc: '.jshint'
      }
    },

    cssmin: {
      options: {
        report: 'min',
        banner: '<%= banner %>\n'
      },
      deploy: { expand: true, flatten: true, src: ['src/**/*.css'], dest: 'build/css/' }
    },

    uglify: {
      options: {
        report: 'min',
        mangle: false,
        banner: '<%= banner %>\n\n',
        compress: {
          drop_console: true
        }
      },
      deploy: {
        expand: true,
        flatten: true,
        src: ['src/*.js', 'src/**/*.js'],
        dest: 'build/js/'
      }
    },

    copy: {
      css: {
        files: [
          {expand: true, flatten: true, src: ['src/**/*.css'], dest: 'build/css/'}
        ]
      },
      js: {
        files: [
          {expand: true, flatten: true, src: ['src/*.js', 'src/**/*.js'], dest: 'build/js/'}
        ]
      },
      html: {
        files: [
          {expand: true, flatten: true, src: ['src/**/*.html'], dest: 'build/'}
        ]
      },
      deploy: {
        files: [
          {expand: true, flatten: true, src: ['manifest.json'], dest: 'build/'},
          {expand: true, flatten: true, src: ['icons/*'], dest: 'build/icons/'}
        ]
      }
    },

    usebanner: {
      deploy: {
        options: {
          position: 'bottom',
          banner: '<%= html_banner %>',
          linebreak: true
        },
        files: {
          src: ['build/*.html']
        }
      }
    },

    clean: {
      build: 'build'
    },

    compress: {
      deploy: {
        options: {
          archive: 'releases/<%= pkg.name %>.<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: ['**/*']
        }]
      }
    },

    watch: {
      js: {
        files: ['src/*', 'src/**/*'],
        tasks: ['jshint', 'copy:js'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      css: {
        files: ['src/**/*'],
        tasks: ['copy:css'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      html: {
        files: ['src/**/*'],
        tasks: ['copy:html'],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }

  });

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Build tasks
  grunt.registerTask('default', ['jshint', 'copy']);

  // Deploy tasks
  grunt.registerTask('deploy', ['clean', 'jshint', 'uglify', 'cssmin', 'copy:deploy','copy:html', 'usebanner', 'compress']);

};
