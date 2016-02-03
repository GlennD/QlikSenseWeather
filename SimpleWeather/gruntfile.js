'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    less: {
    bootstrap: {
      files: {
      "./output/scoped-bootstrap.css": "./bower_components/less/_root.less"
      } 
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['less']);

};
