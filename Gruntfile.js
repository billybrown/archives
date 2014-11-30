/*
 * boilerplate-h5bp
 * https://github.com/assemble/boilerplate-h5bp
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


  // this needs to go at the top - it will print out how long 
  // things took. Helps with debugging
  // @author bill, echo & co.
  require('time-grunt')(grunt);

  // this allows you to remove all the 'loadNPMtasks' calls, and speeds up task running
  // @author bill, echo & co.
  require('jit-grunt')(grunt);  


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('.assemblerc.yml'),
    process: require('./src/sanitize.js'),

    // this task makes sure you are running the right version of node
    node_version: {
      options: {
        alwaysInstall: false,
        errorLevel: 'fatal',
        globals: [],
        maxBuffer: 200*1024,
        nvm: true,
        override: ''
      }
    },

    // this task allows you to publish to github pages
    'gh-pages': {
      options: {
        base: '<%= site.dest %>/'
      },
      src: ['**']
    },

    // this task compiles your sass to css using Libsass, a C++ version of sass
    // LibSass is faster to compile, and frees us from having to use ruby
    // but it lags behind sass in features.
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                '<%= site.dest %>/css/main.css': '<%= site.templates %>/css/main.scss'
            }
        }
    },

    // this task applies vendor prefixes (ie: -webkit, -moz, -o) to your css
    // based on specific browser support defined here
    // @author bill, echo & co.
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version'
        ]
      },
      custom: {
        options: {
          map: true
        },
        src: '<%= site.dest %>/css/main.css'
      }
    },

    // this task optimizes your images
    imagemin: {
      png: {
        files: [{
          expand: true,
          cwd: '<%= site.templates %>/img/',
          src: ['**/*.png', '**/*.jpg', '**/*.gif'],
          dest: '<%= site.templates %>/img/'
        }]
      },
      svg: {
        files: [{
          expand: true,
          cwd: '<%= site.templates %>/img/',
          src: ['**/*.svg'],
          ext: '.svg',
          dest: '<%= site.templates %>/img/'
        }]
      },      
    },

    // this tasks copies stuff over
    copy: {
      main: {
        files: [
          {expand: true, cwd: '<%= site.templates %>/img/', src: ['**/*'], dest: '<%= site.dest %>/img/'}
        ],
      },
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',
        layouts: '<%= site.layouts %>',
        layout: '<%= site.layout %>'
      },
      docs: {
        files: {'<%= site.dest %>/': ['<%= site.templates %>/pages/index.hbs'] }
      }
    },

    // Before generating new files remove files from previous build.
    clean: {
      tmp: ['tmp/**/*', '<%= site.dest %>/**/**'],
      templates: ['<%= site.dest %>/*.html']
    },

    // this task 'watches' files and triggers other grunt tasks when those
    // files are saved.
    watch: {
      sass: {
        files: ['<%= site.templates %>/css/**/**/*.scss'],
        tasks: ['css']
      },
      templates: {
        files: ['<%= site.templates %>/**/*.hbs'],
        tasks: ['templates']
      },
      // this task must come last, and it will refresh your browser (as long
      // as you have the chrome extension) whenever certain files get changed
      livereload: {
        options: { livereload: true },
        files: ['<%= site.dest %>/css/main.css', '<%= site.dest %>/*.html'],
      }
    },

    // this tasks abouts the size of files in your theme directory
    // Helps when your trying to optimize for performance
    size_report: {
        your_target: {
            files: {
                list: ['<%= site.dest %>/**/**']
            },
        },
    },

    // takana allows for live as-you-type style injection. AWESOME for designing
    // in the browser. Its complicated. Ask me if you're curious.
    // @author bill, echo & co.
    takana: {
      options: {
        path: '<%= site.templates %>/css'
      }
    },

  });

  // documentation on how to run different tasks is in the readme
  grunt.registerTask('default', ['node_version']);
  grunt.registerTask('css', ['node_version', 'sass', 'autoprefixer']);
  grunt.registerTask('templates', ['node_version', 'assemble']);
  grunt.registerTask('images', ['node_version', 'imagemin']);
  grunt.registerTask('fast', ['node_version', 'takana']);

  grunt.registerTask('build', [
    'node_version', 
    'clean', 
    'assemble',
    'copy',
    'sass', 
    'autoprefixer', 
    'size_report'
  ]);
  grunt.registerTask('deploy', ['node_version', 'gh-pages']);



};
