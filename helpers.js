const fs = require('node:fs');
const {PATH_TO_DB} = require("./constants");

const readAllFromDB = () => {
    // я піймав себе на думці що наче і знаю теорію про проміси, але написати щось з нуля було б важкуваато
    // тому писав все без async/await - як діди робили
    return new Promise((resolve, reject) => {
        fs.readFile(PATH_TO_DB, 'utf-8', (err, data) => {
            if (err) {
                // отака модель у мене завжди повертається
                // це виглядало для мене доволі зручно, бо
                // в catch у мене помилки з різних місць падають,
                // але при цьому все може оброблятися однаково

                // PS: окрім моментів з валідацією, бо там стороння бібліотека
                reject({
                    error: err,
                    users: [],
                    message: 'Server error! Can not read data from db',
                    code: 500
                });

            } else {
                const validData = data ? JSON.parse(data) : [];

                resolve({
                    error: null,
                    users: validData,
                    message: `Success!${(validData.length ? '' : ' But no data yet')}`,
                    code: 200
                });
            }
        });
    });
}

const writeAllToDB = (users) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(PATH_TO_DB, users, {},err => {
            if (err) {
                reject({
                    error: err,
                    users: [],
                    message: 'Server error! Can not write data to db',
                    code: 500
                });
            } else {
                resolve({
                    error: null,
                    users: JSON.parse(users),
                    message: 'User was successfully created or updated!',
                    code: 201
                });
            }
        });
    });
}

module.exports = {
    readAllFromDB,
    writeAllToDB
}