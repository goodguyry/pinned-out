'use strict';
module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ['src/**/*.js'],
      options: {
        expr: true,
        globals: {
          jQuery: false,
          console: true,
          module: true
        }
      }
    }

  });

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);

};
