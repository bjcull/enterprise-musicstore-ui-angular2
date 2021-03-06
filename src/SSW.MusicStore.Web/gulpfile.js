/// <binding BeforeBuild='tsc' />
var gulp = require('gulp');
var ts = require('gulp-typescript');
var path = require('path');
var Builder = require('systemjs-builder')
var inlineNg2Template = require('gulp-inline-ng2-template')
var merge = require('merge-stream');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var project = ts.createProject('tsconfig.json');

gulp.task('tsc', () => {
    return project.src()
        .pipe(ts(project))
        .pipe(gulp.dest('.'));
});

gulp.task('stage-inline', ['tsc'], () => {
    return gulp.src('./app/**/*.js')
        .pipe(inlineNg2Template({
            base: '.',
            target: 'es5'
        }))
        .pipe(gulp.dest('./staging'));
})

gulp.task('bundle-staging', ['stage-inline'], cb => {
    var builder = new Builder('.', 'system.js');

    builder.config({
        defaultJSExtensions: 'js',
        map: {
            'angular2': 'node_modules/angular2',
            'rxjs': 'node_modules/rxjs'
        },
    });

    builder.buildStatic('staging/main', './staging/bundled.js')
        .then(output => cb())
        .catch(err => console.log('Build error: ' + err));
});

gulp.task('build', ['bundle-staging'], () => {
    var js = gulp.src([
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'staging/bundled.js'
    ]).pipe(concat('script.js'));

    var html = gulp.src(['./index-dist.html'])
        .pipe(rename('index.html'));

    var css = gulp.src('assets/**/*.css')
        .pipe(concat('styles.css'));
    
    gulp.src(['assets/img/**/*'])
        .pipe(gulp.dest('./wwwroot/assets/img/'));
        
    return merge(js, css, html)
        .pipe(gulp.dest('./wwwroot'));
});