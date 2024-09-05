// ДЗ:
//     Створити папку "baseFolder". В ній створити 5 папок, в кожній з яких створити по 5 файлів з розширенням txt.
//     Вивести в консоль шляхи до кожного файлу чи папки, також вивести поряд інформацію про те, чи є це файл чи папка.

// стягування потрібьних модулів
const fs = require('node:fs/promises');
const path = require('node:path');

// імітація енамів за 3гривні
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

// ліміт для циклів
const LIMIT = 5;

const commonDirsPaths = [];
const commonFilesPaths = [];

// основна ідея в тому щоб динамічно формувати назви,
// бо в теорії можна було бб завести масиви і зробити через Promise.allSettled
// але я люблю енами і звичайний цикл for, тому коли після реакту з безкінечними методами масивів
// є нагода його заюзати, то чому б і ні
const main = async () => {
    // на початку забув огорнути все в трайкетч
    // бо помилки явно можуть з більшості рядків вилізти
    try {
        // baseFolder
        // створюю шлях до pathToBaseFolder
        const pathToBaseFolder = path.join(__dirname, FoldersNames.baseFolderName);

        // створюю саму директорію на основі шляху
        await fs.mkdir(pathToBaseFolder);

        // 5 інших
        for (let i = 0; i < LIMIT; ++i) {
            // ну тут все те саме що й вище було
            const pathToCommonFolder = path.join(pathToBaseFolder, FoldersNames.commonFolderName + (i + 1));

            await fs.mkdir(pathToCommonFolder);

            for (let j = 0; j < LIMIT; ++j) {
                // і тут те саме, тільки пишу вже файл
                const pathToCommonFile = path.join(pathToCommonFolder, FilesNames.commonFileName + (j + 1) + Exts.txt);

                await fs.writeFile(pathToCommonFile, i.toString());

                commonFilesPaths.push(pathToCommonFile);
            }

            commonDirsPaths.push(pathToCommonFolder);
        }

        const elements = await fs.readdir(pathToBaseFolder);

        for (let i = 0; i < elements.length; ++i) {
            console.log('\n' + Separators.folder);

            const dirCounter = elements[i].split('folder')[1];
            console.log('Common folder #' + dirCounter + ':');

            console.log('Path => ' + commonDirsPaths[i]);
            // створюю об'єкт типу Stats в якого вже беру необхідні методи для перевірки
            console.log('isDirectory => ' + (await fs.stat(commonDirsPaths[i])).isDirectory());
            console.log('isFile => ' + (await fs.stat(commonDirsPaths[i])).isFile());

            const items = await fs.readdir(commonDirsPaths[i]);

            for (let j = 0; j < items.length; ++j) {
                console.log(Separators.file);
                console.log('\tCommon file #' + (items[j].split('file')[1][0]) + ' from folder #' + dirCounter + ':');

                console.log('\tPath => ' + commonFilesPaths[j]);
                console.log('\tisDirectory => ' + (await fs.stat(commonFilesPaths[j])).isDirectory());
                console.log('\tisFile => ' + (await fs.stat(commonFilesPaths[j])).isFile());
                console.log(Separators.file);
            }

            console.log(Separators.folder);
        }
    } catch (e) {
        console.error('1000-7');
        console.log(e);
    }
}

// void ігнорує повертаєме значення з виклику функції
void main();