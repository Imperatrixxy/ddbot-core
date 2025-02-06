import fs from 'fs';
import path from 'path';

function getFiles(srcPath, foldersOnly = false) {
    const files = fs.readdirSync(srcPath, {
        withFileTypes: true,
    });

    let theFiles = [];

    for(const file of files) {
        const filePath = path.join(srcPath, file.name);
        
        if (file.isDirectory()) {
            if (foldersOnly) {
                theFiles.push(filePath);
            } else {
                theFiles = theFiles.concat(getFiles(filePath));
            }
            continue;
        } 
        
        theFiles.push(filePath);
    }

    return theFiles;
}

export default getFiles;