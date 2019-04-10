const fs = require('fs')
const AdmZip = require('adm-zip')
const uuid = require('uuid/v4')
const ramlConverter = require('oas-raml-converter')
const del = require('del')

const ramlToOas20 = new ramlConverter.Converter(ramlConverter.Formats.RAML, ramlConverter.Formats.OAS20)

const ramlFlattener = async (archive, target, orig_filename) => {
    const id = uuid ()
    try {
        const data = fs.readFileSync(archive)
        const zip = new AdmZip(data)
        zip.extractAllTo (target)

        let entryPoint = null;

        console.log ('target', target, 'orig_filename', orig_filename, 'can access', fs.existsSync (target))
        if (fs.existsSync (target + '/' + orig_filename)) {
            entryPoint = entryFinder (target + '/' + orig_filename);
        } else {
            entryPoint = entryFinder (target);
        }
        // console.log ('archive', archive, 'target', target)
         

        return entryPoint ? await ramlToOas20.convertFile (entryPoint) : null

        // return {
        //     "filename": `${target}/${id}.json`,
        //     "data": swagger
        // }
        


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

const nameRetrieve = (name) => {
    let phase1 = name.split('/')[1]
    let phase2 = phase1.split('.')[0]
    return phase2
}

module.exports = { ramlFlattener }



