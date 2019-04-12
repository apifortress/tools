const fs = require ('fs')
// const AdmZip = require('adm-zip')
const unzip = require ('unzip');
const ramlConverter = require ('oas-raml-converter')
const ramlToOas20 = new ramlConverter.Converter (ramlConverter.Formats.RAML, ramlConverter.Formats.OAS20)

const ramlFlattener = (archive, target) => {
    return new Promise ((resolve, reject) => {
        // const data = fs.readFileSync(archive)
        // const zip = new AdmZip(data)
        // zip.extractAllTo (target)

        let stream = fs.createReadStream (archive);
        stream.pipe (unzip.Extract ({ path: target })
            .on ('close', function () {
                entryFinder (target).then ((entryPoint) => {
                    // console.log ('entryPoint', entryPoint)
                    if (entryPoint)
                        ramlToOas20.convertFile (entryPoint).then ((data) => {
                            resolve (data);
                        })
                    else
                        reject (null);
                })
            })
        )
    })
}

const entryFinder = (dirname) => {
    // let entryPoint
    // const filenames = fs.readdirSync (dirname)
    return new Promise ((resolve, reject) => {
        const entry_routine = (dir, callback) => {
            // console.log ('entry_routine', dir)
            const files = fs.readdirSync (dir);
            
            let completed = 0;
            function evaluator (hit) {
                completed++;
                if (hit !== null)
                    callback (hit);
                else if (completed === files.length)
                    callback (null);
            }
            // console.log ('entry_routine', dir, files)
            for (var j = 0; j < files.length; j++) {
                entry_iterator (dir, files[j], evaluator)
            }
        }

        const entry_iterator = (dirname, filename, evaluator) => {
            const path = dirname + '/' + filename;
            const stats = fs.statSync (path)
            // console.log ('===> entry finder', filename, 'dir?', stats.isDirectory ())
            if (stats.isDirectory ())
                entry_routine (path, (h) => {
                    evaluator (h)
                })
            else {
                const data = fs.readFileSync (path);
                const dutf8 = data.toString('utf-8');
                let hit = null
                if (dutf8.startsWith('#%RAML 1.0\n')||dutf8.startsWith('#%RAML 1.0\r\n')||dutf8.startsWith('#%RAML 0.8\n')||dutf8.startsWith('#%RAML 0.8\r\n')) {
                    hit = path;
                }
                evaluator (hit);
            }
        }

        entry_routine (dirname, (entryPoint) => {
            if (entryPoint)
                resolve (entryPoint);
            else
                reject (null);
        })
    })
}



module.exports = { ramlFlattener }
