import fs from "fs-extra";

fs.copySync('src/public/css/','dist/public/css', {recursive: true})
fs.copySync('src/public/js/lib/','dist/public/js', {recursive: true})
fs.copySync('src/public/fonts/','dist/public/', {recursive: true})
fs.copySync('src/public/images/','dist/public/', {recursive: true})
fs.copySync('node_modules/jquery/dist/jquery.min.js','dist/public/js/lib/jquery.min.js')
fs.copySync('node_modules/bootstrap/dist/js/bootstrap.min.js','dist/public/js/lib/bootstrap.min.js')
fs.copySync('node_modules/bootstrap/dist/css/bootstrap.min.css','dist/public/css/bootstrap.min.css')
