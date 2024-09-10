const express = require("express");
const {readAllFromDB, writeAllToDB} = require("./helpers");
const {PORT} = require("./constants");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// region validator
const userValidationRules = [
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage('Email must be a valid email address [something]@gmail.com'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
// endregion validator

// region GET /users
app.get('/users', (req, res) => {
    readAllFromDB()
        .then(({users, message, code}) => {
            res.status(code).json({message, data: users});
    })
        .catch(({error, message, users, code}) => {
            console.error(error);
            res.status(code).json({message, data: users});
        });
});
// endregion GET /users

// region POST /users
app.post('/users', userValidationRules, validate, (req, res) => {
    readAllFromDB()
        .then(({users}) => {
            const user = req.body;

            if (users.length) {
                users.push({...user, id: users[users.length - 1].id + 1});
            } else {
                users.push({...user, id: 1});
            }

            return writeAllToDB(JSON.stringify(users));
        })
        .then(({users, message, code}) => {
            res.status(code).json({message, data: users});
        })
        .catch((data, code) => {
            console.error(data.error);
            res.status(code).json({message: data.message, data: data.users});
        });
});
// endregion POST /users

//region PUT /users/:userId
app.put('/users/:userId', userValidationRules, validate, (req, res) => {
    readAllFromDB()
        .then(({users}) => {
            const user = req.body;
            const userId = Number(req.params.userId);

            if (users.length) {
                const userIndex = users.findIndex(user => user.id === userId);

                if (userIndex === -1) {
                    throw {
                        message: 'User not found',
                        code: 404,
                        users,
                        error: new Error('User not found, no users with id' + userId)
                    };
                } else {
                    users[userIndex] = {...user, id: userId}
                }
            } else {
                throw {
                    message: 'Can not access to user, db is empty',
                    code: 404,
                    users,
                    error: new Error('db is empty, impossible to get user')
                };
            }

            return writeAllToDB(JSON.stringify(users));
        })
        .then(({users, code, message}) => {
            res.status(code).json({message, data: users});
        })
        .catch(({users, message, code ,error}) => {
            console.error(error);
            res.status(code).json({message, data: users});
        });
});
// endregion PUT /users/:userId

// region DELETE /users/:userId
app.delete('/users/:userId', (req, res) => {
    readAllFromDB()
        .then(({users}) => {
            const userId = Number(req.params.userId);

            if (users.length) {
                const userIndex = users.findIndex(user => user.id === userId);

                if (userIndex === -1) {
                    throw {
                        message: 'User not found',
                        code: 404,
                        users,
                        error: new Error('User not found, no users with id' + userId)
                    };
                } else {
                    users.splice(userIndex, 1);
                }
            } else {
                throw {
                    message: 'Can not access to user, db is empty',
                    code: 404,
                    users,
                    error: new Error('db is empty, impossible to get user')
                };
            }

            return writeAllToDB(JSON.stringify(users)).then((data) => ({
                ...data,
                // 200, а не 204 для того щоб повідомлення виводило
                code: 200,
                message: 'User was successfully deleted'
            }));
        })
        .then(({users, code, message}) => {
            res.status(code).json({message, data: users});
        })
        .catch(({users, message, code ,error}) => {
            console.error(error);
            res.status(code).json({message, data: users});
        });
});
// endregion

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});