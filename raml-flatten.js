const fs = require('fs')
const AdmZip = require('adm-zip')
const ramlConverter = require('oas-raml-converter')

const ramlToOas20 = new ramlConverter.Converter(ramlConverter.Formats.RAML, ramlConverter.Formats.OAS20)

const ramlFlattener = async (archive, target, orig_filename) => {
    try {
        const data = fs.readFileSync(archive)
        const zip = new AdmZip(data)
        zip.extractAllTo (target)

        let entryPoint  = null,
            dir_name    = null;

        
        fs.readdirSync (target, { withFileTypes: true }).forEach (it => {
            if (it.isDirectory () && it.name !== '__MACOSX')
                dir_name = it.name;
        });

        // console.log ('dirname', dir_name, target + '/' + dir_name);
        
        if (dir_name)
            entryPoint = entryFinder (target + '/' + dir_name);
        else
            entryPoint = entryFinder (target);
         

        return entryPoint ? await ramlToOas20.convertFile (entryPoint) : null;
    } catch (err){
        console.error (err)
    }
}

const entryFinder = (dirname) => {
    let entryPoint
    const filenames = fs.readdirSync(dirname)
    filenames.forEach(filename => {
        const stats = fs.statSync(`${dirname}/${filename}`)
        if(stats.isDirectory()){
            return entryFinder(`${dirname}/${filename}`)
        } else {
            const data = fs.readFileSync(`${dirname}/${filename}`)
            if (data.toString('utf-8').includes('title')) {
                entryPoint = `${dirname}/${filename}`
            }
        }
    })
    return entryPoint
}

module.exports = { ramlFlattener }



