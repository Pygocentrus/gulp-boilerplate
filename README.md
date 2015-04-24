# Gulp workflow boilerplate

### Intro

This is a boilerplate for a simple and complete gulp workflow. The two main tasks are:  
- The live preview, which uses [Browsersync](http://www.browsersync.io/) to develop your application with multi devices at the same time. It will basically reload all the devices connected to the server whenever you save any script, style or html file in the `app/` folder.  
- The build task, which will create a `dist/` folder containing two minified, concatenated and versioned css and js, as well as a minified html file, built to point towards those new rev files.

### Configuration

First of all, edit the `gulp/conf.js` file with your architecture paths and project options. It will tell the gulpfile where to pick and create any file.  

When you'll need to add any js, css or whatever file dependency on your project, add them in this configuration file rather than directly in the html. You can add custom files as well as external [Bower](http://bower.io) dependencies.  

For instance, if you need to add the Normalize.css style dependency, simply run `$ bower install --save normalize.css`, then add the following lines to the `gulp/conf.js` file:  

```javascript
// ... rest of the configuration object
styles: {
  lib: {
    prefix: 'bower_components/',
    files: [
      'normalize.css/normalize.css'
    ]
  },
  custom: {
    prefix: 'app/styles/',
    files: [
      'css/my-scustom-file.css'
    ]
  }
}
// ...
```

### Usage

First, you need to grab the dependencies. Run `$ npm install` to get them. Then, run `$ bower install`.  

- For the live developing task, run `$ gulp serve`, which will start a server and open a browser window. The terminal will give you the public url you can access, so as to have multiple devices connected at the same time.  
- For the build task, simply run `$ gulp build`, which will create a `dist/` (or anything else if you changed it in the `gulp/conf.js` file) with the uglified, concatenated, complied, optimized script, style and html, as well as the optimized images.  

### About

I'm [Pierre Guilhou](http://pierreguilhou.me), a french full stack developer.  

- [LinkedIn](http://linkedin.com/in/pierreguilhou)  
- [Angel List](https://angel.co/pierre-guilhou)  
- [Github](http://github.com/Pygocentrus)