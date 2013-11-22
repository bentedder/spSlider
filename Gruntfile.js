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
      libs: {
        src: [
              "src/js/jquery-1.10.2.js",
              "src/js/idangerous.swiper-2.3.js",
              "src/js/jquery.SPServices-0.7.2.js"       		 	
            ],
        dest: "dist/js/<%= pkg.name %>-libs.js"
      },
      slider: {
        src: "src/js/spSlider.js",
        dest: "dist/js/spSlider.js"
      },
	  sliderpackage: {
        src: [
              "src/js/jquery-1.10.2.js",
              "src/js/idangerous.swiper-2.3.js",
              "src/js/jquery.SPServices-0.7.2.js",		 	
              "src/js/spSlider.js"       		 	
            ],
        dest: "dist/js/<%= pkg.name %>-pkg.js"	  },
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
          "dist/js/<%= pkg.name %>-libs.min.js": ["<%= concat.libs.dest %>"],
          "dist/js/spSlider.min.js": ["<%= concat.slider.dest %>"],
          "dist/js/spSlider-pkg.min.js": ["<%= concat.sliderpackage.dest %>"]
        }
      }
    },
    cssmin: {
      css:{
        src: "<%= concat.css.dest %>",
        dest: "dist/css/spSlider.min.css"
      }
    },
    copy: {
      images: {
        files: [
          {expand: true, flatten: true, src: ['src/img/**'], dest: 'dist/img/', filter: 'isFile'}
        ]

      }
    },
    pandoc: {
      toHtml: {
        configs: {
          "publish": "HTML"
        },
        files: {
          "from": [
            "tutorial.md"
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");  
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-pandoc");
  
  // Template mutlitask
  
  // Default task(s).
  grunt.registerTask("default", ["concat","uglify","cssmin","copy"]);

};