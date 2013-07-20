module.exports = function (grunt) {
   var bannerContent = '/* Audero Smoke Effect <%= pkg.version%> | <%= pkg.author%> | <%= pkg.license%> Licensed */\n';
   var name = '<%= pkg.name %>';

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      jshint: {
         options: {
            eqeqeq: true,
            trailing: true,
            bitwise: true,
            camelcase: true,
            curly: true,
            forin: true,
            noarg: true,
            noempty: true,
            nonew: true,
            undef: true,
            unused: true,
            indent: 3,
            browser: true,
            jquery: true
         },
         target: {
            src: ['src/jquery.' + name + '.js']
         }
      },
      uglify: {
         options: {
            banner: bannerContent
         },
         target: {
            src: ['src/jquery.' + name + '.js'],
            dest: 'src/jquery.' + name + '.min.js'
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');

   grunt.registerTask('default', ['jshint', 'uglify']);
};