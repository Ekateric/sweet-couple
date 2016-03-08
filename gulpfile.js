var gulp = require('gulp'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	sprite = require('gulp-sprite-generator'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	newer = require('gulp-newer'),
	watch = require('gulp-watch'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	autoprefix = new LessPluginAutoPrefix({browsers: ["> 5%"]}),

	src = {
		css: '_src/css/**/*',
		less: '_src/css/style.less',
		js: ['_src/js/modules/*',
			'_src/js/main.js'],
		img: '_src/img/**/*',
		sprite: '_src/css/sprite.less'
	};

//Compile Less
gulp.task('less', function () {
	return gulp.src(src.less)
		.pipe(less({
			plugins: [autoprefix]
		}))
		.pipe(gulp.dest('build/css'));
});

//Minify Css
gulp.task('minCss', function () {
	return gulp.src('build/css/style.css')
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('build/css'));
});

//Concat js
gulp.task('js', function() {
	return gulp.src(src.js)
		.pipe(newer('js/main.js'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('build/js'))
});

//Minify & uglify Js
gulp.task('minJs', function() {
	return gulp.src('js/main.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

//Compress images
gulp.task('imagemin', function () {
	return gulp.src(src.img)
		.pipe(newer('build/img'))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('build/img'));
});

//Generate sprite
gulp.task('sprite', function() {
	var spriteOutput = gulp.src(src.sprite)
		.pipe(sprite({
			baseUrl:         './',
			spriteSheetName: "sprite.png",
			spriteSheetPath: "../img/icons/sprite",
			styleSheetName:  "sprite.less",
			padding: 5
		}));
	spriteOutput.css.pipe(gulp.dest("_src/css/less"));
	spriteOutput.img.pipe(gulp.dest("_src/img/icons/sprite"));
});

// Clean destination folders
gulp.task('clean', function() {
	return gulp.src(['build/css', 'build/js', 'build/img'], {read: false})
		.pipe(clean());
});


// Default task
gulp.task('default', /*['clean'],*/ function() {
	gulp.start('sprite', 'less', 'imagemin', 'js');

	gulp.watch(src.js, ['js']);
	gulp.watch(src.css, ['less']);
	gulp.watch(src.img, ['imagemin']);
	gulp.watch(src.sprite, ['sprite']);
});