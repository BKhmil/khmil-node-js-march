// ДЗ:
//     Створити папку "baseFolder". В ній створити 5 папок, в кожній з яких створити по 5 файлів з розширенням txt.
//     Вивести в консоль шляхи до кожного файлу чи папки, також вивести поряд інформацію про те, чи є це файл чи папка.
const fs = require('node:fs/promises');
const path = require('node:path');

const FoldersNames = {
    baseFolderName: 'baseFolder',
    commonFolderName: 'common_folder'
}

const FilesNames = {
    commonFileName: 'common-file'
}

const Exts = {
    txt: '.txt'
}

const Separators = {
    folder: '#############################################################################################',
    file: '----------------------------------------------------------------------------------------------'
};

const LIMIT = 5;

const main = async () => {
    // baseFolder
    const pathToBaseFolder = path.join(__dirname, FoldersNames.baseFolderName);

    await fs.mkdir(pathToBaseFolder);

    // 5 інших
    for (let i = 0; i < LIMIT; ++i) {
        const pathToCommonFolder = path.join(pathToBaseFolder, FoldersNames.commonFolderName + (i + 1));

        console.log('\n' + Separators.folder);
        console.log('Common folder #' + (i + 1) + ':');

        await fs.mkdir(pathToCommonFolder);

        console.log('Path => ' + pathToCommonFolder);
        console.log('isDirectory => ' + (await fs.stat(pathToCommonFolder)).isDirectory());
        console.log('isFile => ' + (await fs.stat(pathToCommonFolder)).isFile());

        for (let j = 0; j < LIMIT; ++j) {
            const pathToCommonFile = path.join(pathToCommonFolder, FilesNames.commonFileName + (j + 1) + Exts.txt);

            console.log(Separators.file);
            console.log('\tCommon file #' + (j + 1) + ' from folder #' + (i + 1) + ':');

            await fs.writeFile(pathToCommonFile, i.toString());

            console.log('\tPath => ' + pathToCommonFile);
            console.log('\tisDirectory => ' + (await fs.stat(pathToCommonFile)).isDirectory());
            console.log('\tisFile => ' + (await fs.stat(pathToCommonFile)).isFile());
            console.log(Separators.file);
        }

        console.log(Separators.folder);
    }
}

void main();