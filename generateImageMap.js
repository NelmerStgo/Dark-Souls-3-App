/* 
    Este script genera un archivo ".js" que exporta un objeto 
    con las rutas de las imágenes.

    COMO USARLO:
    1. Coloca las imágenes en la carpeta "assets/images/...".
    2. Ejecuta este script con Node.js: `node generateImageMap.js`
*/

const fs = require('fs');
const path = require('path');

// Carpeta origen y archivo destino
const category = 'miracles'; // <-- cambiar "gestures" por la categoría que quieras
const folder = path.join(__dirname, `assets/images/${category}`);
const outFile = path.join(__dirname, `assets/images/imgMap/image${capitalize(category)}Map.js`);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

fs.readdir(folder, (err, files) => {
  if (err) throw err;

  const imageFiles = files.filter(f =>
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
  );

  // Nombre de la constante exportada (ej: imagesGestures)
  const constName = `images${capitalize(category)}`;

  // Generar las entradas del objeto
  const entries = imageFiles
    .map(file => {
      const name = path.basename(file, path.extname(file));
      return `  "${name}": require('../${category}/${file}')`;
    })
    .join(',\n');

  // Contenido del archivo final
  const content = `const ${constName} = {\n${entries}\n};\n\nexport default ${constName};\n`;

  // Guardar archivo
  fs.writeFileSync(outFile, content, 'utf8');
  console.log(`✅ Archivo generado: ${outFile}`);
});

