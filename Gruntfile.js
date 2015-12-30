'use strict';

module.exports = function (grunt) {
   require('time-grunt')(grunt);
   require('jit-grunt')(grunt);

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      jscs: {
         options: {
            config: '.jscsrc',
            fix: true,
            force: true
         },
         dist: '<%= jshint.src %>'
      },

      jshint: {
         options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
         },
         src: [
            'src/*.js'
         ]
      },

      uglify: {
         options: {
            banner: '/* Audero Smoke Effect <%= pkg.version %> | Aurelio De Rosa (@AurelioDeRosa) | MIT/GPL-3.0 Licensed */\n'
         },
         dist: {
            files: {
               'dist/jquery.auderoSmokeEffect.min.js': ['src/jquery.auderoSmokeEffect.js']
            }
         }
      }
   });

   grunt.registerTask('lint', [
      'jshint',
      'jscs'
   ]);

   grunt.registerTask('build', [
      'uglify'
   ]);

   grunt.registerTask('default', [
      'lint',
      'build'
   ]);
};