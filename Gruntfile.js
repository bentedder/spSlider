module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concat: {
      options: {
        banner: '/*!\n <%= pkg.name %> Build version <%= pkg.version %>, <%= grunt.template.today("mm-dd-yyyy, h:MM:ss TT") %>\n*/\n',
        separator: ";"
      },
      slider: {
        src: [
              "src/js/jquery-1.10.2.js",
              "src/js/idangerous.swiper-2.3.js",
              "src/js/slider.js"
       		 	
            ],
        dest: "dist/js/<%= pkg.name %>.js"
      },
	    css: {
        src: [
            "src/css/idangerous.swiper.css",
            "src/css/style.css"
        ],
        dest: "dist/css/<%= pkg.name %>.css",
		options: {
			separator: ""
      	}
      }
    },
    uglify: {
      options: {
        banner: '/*!\n <%= pkg.name %> Build version <%= pkg.version %>, <%= grunt.template.today("mm-dd-yyyy, h:MM:ss TT") %>\n*/\n',
        report: 'gzip'
      },
      dist: {
        files: {
          "dist/js/<%= pkg.name %>.min.js": ["<%= concat.slider.dest %>"]
        }
      }
    },
    cssmin: {
      css:{
        src: "<%= concat.css.dest %>",
        dest: "dist/css/screen.min.css"
      }
    },
    copy: {
      images: {
        files: [
          {expand: true, flatten: true, src: ['src/img/**'], dest: 'dist/img/', filter: 'isFile'}
        ]

      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");  
  grunt.loadNpmTasks("grunt-contrib-copy");
  
  // Template mutlitask
  
  // Default task(s).
  grunt.registerTask("default", ["concat","uglify","cssmin","copy"]);

};