import * as shell from "shelljs";

shell.cp("-R", "src/public/js/lib", "dist/public/js/");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "node_modules/jquery/dist/jquery.min.js", "dist/public/js/lib/");
shell.cp("-R", "node_modules/bootstrap/dist/js/bootstrap.min.js", "dist/public/js/lib/");
