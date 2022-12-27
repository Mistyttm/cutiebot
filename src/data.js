const { writeFileSync, readFileSync, existsSync } = require('node:fs');

const dataFile = 'database.json';

let codes = [];

// Load the codes from the database
const loadVerificationCodes = async () => {
    console.log('loading codes...');
    // If database doesn't already exist, create new file with empty array
    if (!existsSync(dataFile)) {
        writeFileSync(dataFile, '[]');
    }

    try {
        const data = readFileSync(dataFile);

        if (data.length > 0) {
            codes = await JSON.parse(data);
            console.log('codes loaded successfully.');
        }

        if (data.length <= 0) {
            console.log('no codes found, using empty database.');
        }
    } catch (err) {
        console.log(err);
    }
};

loadVerificationCodes();

// Write verification codes (called on exit from index.js)
const writeVerificationCodes = () => {
    const data = JSON.stringify(codes);
    console.log('\nwriting codes...');
    writeFileSync(dataFile, data);
    console.log('codes written successfully.');
};

const saveVerificationCode = (id, code, user) => {
    const data = {
        id: id, // Submitted QUT id
        user: user, // Discord user id snowflake
        verificationCode: code,
    };
    codes.push(data);
    console.log(data);
};

module.exports = { saveVerificationCode, writeVerificationCodes };
