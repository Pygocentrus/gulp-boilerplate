var conf = {
  paths: {
    proxy: 'localhost:8888/pres-gulp',
    app: 'app',
    dist: 'dist',
    scripts: 'app/scripts',
    styles: 'app/styles',
    css: 'app/styles/css',
    sass: 'app/styles/scss',
    images: 'app/img',
    fonts: 'app/fonts'
  },
  autoprefixerConf: {
    browsers: ['last 2 versions']
  },
  sassConf: {
    indentedSyntax: false,
    stylesFormat: '.scss',
    mainSass: 'main',
    includePaths: [
      'app/bower_components/bootstrap-sass-official/assets/stylesheets/', 
      'app/styles/scss/'
    ]
  },
  compassConf: {
    usesCompass: false,
    configRbPath: 'path/to/config.rb'
  },
  styles: {
    lib: {
      prefix: 'app/bower_components/',
      files: [
        'normalize.css/normalize.css',
        'bootstrap/'
      ]
    },
    custom: {
      prefix: 'app/styles/',
      files: []
    }
  },
  scripts: {
    lib: {
      prefix: 'app/bower_components/',
      files: [
        'jquery/dist/jquery.js',
        'handlebars/handlebars.js'
      ]
    },
    custom: {
      prefix: 'app/scripts/',
      files: [
        'controllers/userCtrl.js',
        'app.js'
      ]
    }
  }
};

module.exports = conf;
