import dotenv from 'dotenv';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

dotenv.config();
const { TOKEN, APP_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(TOKEN);
const commandData = [];

const loadCommands = () => {
    // Grab all command files from the commands directory
    const commandsPath = pathToFileURL('commands');
    const commandFiles = readdirSync(pathToFileURL('commands'))
        .filter((file) => file.endsWith('.js'));
    const commands = commandFiles.map((file) => path.join(commandsPath.href, file));

    commands.forEach(async(command) => {
        await import(command).then((command) => {
            if (command.default.data && command.default.execute) {
                commandData.push(command.default.data.toJSON());
            }
        });
    });
};

// const commandFilePaths = commandFiles.map((file) => path.join(commandsPath.href, file));

// commandFilePaths.forEach((command) => {
//     import(command).then((command) => {
//         command
//     })
// })
const deploy = async () => {
    try {
        loadCommands();
        console.log(`Started refreshing ${commandData.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commandData },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.log(error);
    }
};

deploy();

//.then(deploy(commandData));
// console.log(commandData);
// deploy(commandData);

// main();

// const wee = async () => {

//     console.log(think);
// };

// wee();

// commandFiles.map(async (file) => {
//     const command = path.join(commandsPath.href, file);

//     await import(command).then((command) => {
//         if (command.data && command.execute) {
//             console.log(command);
//             return command.default.data.toJSON();
//         }
//     });
// });

// .forEach((command) => {
//     import(command).then((command) => {
//         if (command.data && command.execute) {
//             commands.push(command.default.data.toJSON());
//         }
//     });
// });

// const loadCommands = async () => {
//     // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// const commands = commandFiles.map(async(file) => {
//     const commandPath = path.join(commandsPath.href, file);

//     await import(commandPath).then((command) => {
//         if (command.default.data && command.default.execute) {
//             return command.default.data.toJSON();
//         }
//     });

// const FUCK = await import(command).then((command) => {
//     if (command.default.data && command.default.execute) {
//         return command.default.data.toJSON();
//     }
// });
// return FUCK;

// console.log(commands);
// deploy(commands);
// });
// };

// deploy(c);

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// commandFiles.forEach(async(file) => path.join(commandsPath.href, file))
//     .then((commands) => {
//         commands.map((command) => {
//             import(command)
//             if (command.data && command.execute) {
//                 return command.default.data.toJSON();
//             }
//         });

//     })
//     // });

//     if (command.data && command.execute) {
//         return command.default.data.toJSON();
//     }
// }).then((commands) => { console.log(commands); deploy(commands); });
