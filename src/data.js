const { writeFileSync, readFileSync, existsSync } = require('node:fs');

const dataFile = 'database.json';

let data = [];

// Load the data from the database
// TODO: move/rewrite/parameterise this so that codes/verification data is located with 
// verification code
const loadVerificationCodes = async () => {
    console.log('loading data...');
    // If database doesn't already exist, create new file with empty array
    if (!existsSync(dataFile)) {
        writeFileSync(dataFile, '[]');
    }

    try {
        const loaded = readFileSync(dataFile, 'utf-8');

        if (loaded.length > 0) {
            data = await JSON.parse(loaded);
            console.log('data loaded successfully.');
        }

        if (loaded.length <= 0) {
            console.log('no data found, using empty database.');
        }
    } catch (err) {
        console.log(err);
    }
};

loadVerificationCodes();

// Write verification data (called on exit from index.js)
const writeVerificationCodes = () => {
    const stringData = JSON.stringify(data);
    console.log('\nwriting data...');
    writeFileSync(dataFile, stringData);
    console.log('data written successfully.');
};

const saveVerificationCode = (id, code, user) => {
    const newUser = {
        id: id, // Submitted QUT id
        user: user, // Discord user id snowflake
        verificationCode: code,
    };

    if (data.some((obj) => obj.user === user)) {
        data.filter((obj) => obj.user === user).map((obj) => {
            obj.verificationCode = code;
            obj.id = id;
        });
        console.log(`Updated existing user: ${newUser.user}`);
    } else {
        data.push(newUser);
        console.log(`Added new user: ${newUser.user}`);
    }
};

/**
 * Search for user by Discord ID
 * @param {string} user The Discord ID to search for
 * @returns {Object} Returns the matching user object
 */
const findUser = (user) => {
    return data.find((obj) => (obj.user === user));
};

/**
 * Search for user by supplied QUT ID
 * @param {string} user The QUT ID to search for
 * @returns {Object} Returns the matching user object
 */
const findQutId = (id) => {
    return data.find((obj) => obj.id === id);
};

module.exports = { saveVerificationCode, writeVerificationCodes, findUser, findQutId };
