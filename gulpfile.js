
const {src, dest, watch, series, parallel} = require('gulp'); // Estamos extrayendo el gulp que instalamos en el package.json, entonces estamos importando esas dependencias para poder usarlas aquí en el gulpfile.js 

// El src es para poder identificar el archivo, osea la ubicación, el dest es para darle un destino a ese archivo, osea guardarlo, y el watch es para que



// Dependencias de CSS Y SASS
const sass = require('gulp-sass')(require('sass')); // La única función que hace ese gulp-sass es ejecutar la hoja de estilos de sass, el require de al lado, sirve para ejecutar el sass que es el que conoce todo lo relacionado de sass, la que nos permite escribir ese código sass y poder usarlo, se coloca todo en un mismo const ya que trata de sass

// Cuando hay un const sin llaves quiere decir que solo exporta una función de ese gulp, cuando tiene las llaves, como en este caso son src, dest, quiere decir que hay múltiples funciones que exporta ese gulp 
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps'); // Esta dependencia nos dice en que archivo se encuentra un elemento especificamenre.
const cssnano = require('cssnano'); // Es una dependencia que nos sirve para optimizar nuestro código css, lo que hace será eliminar esos espacios en blanco en el archivo build/css/app.css


// Dependencias de Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css(done) { // Creamos nuestra tarea para poder ejecutarla con gulp

    // Compilar SASS
    // Pasos: 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css


    // Paso 1 - Identificar archivo
    src('src/scss/app.scss') // src sirve para identificar archivos, le damos la ubicación del archivo donde estamos compilando nuestro código scss 

        .pipe( sourcemaps.init() )

    // Paso 2 - Compilar hoja de estilos sass 
        .pipe( sass() ) // Es lo que se va a ejecutar después de que se cumpla el src, entonces mandamos a llamar ese sass, que sería el segundo paso, el outputStyle compressed sirve para minificar la hoja de estilos y que pese menos, es importante saber esto por si en una empresa nos piden minificar el peso de nuestra hoja de estilos, con este simple código lo hacemos. 

        .pipe( postcss ( [autoprefixer(), cssnano() ] ) ) // Con postcss y autoprefixer podemos crear código que sea soportado por varios navegadores

        .pipe( sourcemaps.write('.')) // Le decimos donde queremos que se guarde el sourcemaps, con esas '.' le decimos que se guarde en el build.css

        // Paso 3 - Guardar la hoja de estilos
        .pipe( dest('build/css') ) // Le damos la ubicación donde queremos que se guarde

        done(); // Ese done es para poder darle fin a la ejecución de la tarea de gulp, osea finalizarla

}

function imagenes() {
    return src('src/img/**/*') // Le decimos carga todos los archivos de esa carpeta, no le especificamos una extensión ya que tenemos varias imágenes en diferentes formatos,
    // Con ese return ya no es necesario colocar el done() acá en esta función
        .pipe( imagemin({ optimizationLevel: 3 }) ) // De esta forma minificamos el tamaño de las imágenes para ahorrar tamaño
        .pipe( dest('build/img') )
}

function versionWebp() {
    const opciones = { // Con esto creamos una versión todavía más ligera de las imágenes, para que pesen menos
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}') // De esa forma solo va a convertir las imagenes que sean en formato png o jpg a webp
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
}

function versionavif() {

    const opciones = { // Con esto creamos una versión todavía más ligera de las imágenes, para que pesen menos
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
}

function dev() { 
    watch('src/scss/**/*.scss', css) // De esta forma le pedimos que compile todos los archivos que finalicen con la extensión .scss, y le colocamos el css después de la , para que nos retorne nuevamente esa función
    watch('src/img/**/*', imagenes) // De esta forma le pedimos que compile todas las imagenes, y le colocamos imagenes después de la , para que nos retorne nuevamente esa función en caso de que haya una nueva imagen
}

// Siempre se debe usar exports para poder hacer disponible la función y poder ejecutarla con gulp
exports.css = css; // Le ponemos exports.css, ese css es el nombre que llamaremos en la terminal para mandar a llamar la función de arriba que es css, por eso luego colocamos = css;  que sería la función que declaramos arriba

exports.dev = dev;

exports.imagenes = imagenes;

exports.versionWebp = versionWebp;

exports.versionavif = versionavif;

exports.default = series(imagenes, versionWebp, versionavif, css, dev); //Con esto, basta con poner gulp en la terminal para compilar todos


// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente


//parallel - Todas inician al mismo tiempo