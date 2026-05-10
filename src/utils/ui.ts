import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';

export const showWelcome = () => {
    const welcomeText = figlet.textSync('ZILA', {
        font: 'ANSI Shadow',
        horizontalLayout: 'full',
        width: process.stdout.columns || 120,
    });

    console.log(chalk.blue.bold(welcomeText));
    console.log(chalk.blue.bold('\n  Zigex Dynamic Intelligent Learning Assistant (ZILA)'));
    console.log(chalk.gray('  Empowering students with AI-driven career guidance.\n'));
};

export const boxMsg = (msg: string, title?: string, color: string = 'blue') => {
    console.log(boxen(msg, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: color,
        title: title,
        titleAlignment: 'center'
    }));
};

export const errorMsg = (msg: string) => {
    console.log(chalk.red.bold('\n✖ Error: ') + chalk.red(msg));
};

export const infoMsg = (msg: string) => {
    console.log(chalk.cyan.bold('\nℹ Info: ') + chalk.white(msg));
};

export const successMsg = (msg: string) => {
    console.log(chalk.green.bold('\n✔ Success: ') + chalk.white(msg));
};

export const displayUserProfile = (user: any, email: string) => {
    // We import cli-table3 here to avoid circular dependencies or keep ui.ts light if not used, 
    // but the best is to import at the top of the file, however I will just require it for now 
    // or better just add it to top imports. I will do require here to be safe with the edit.
    const Table = require('cli-table3');
    
    const table = new Table({
        head: [chalk.cyan('Attribute'), chalk.cyan('Value')],
        colWidths: [20, 50],
        wordWrap: true
    });

    const roleName = user.role ? String(user.role).toUpperCase() : 'UNKNOWN';

    table.push(
        ['Role', chalk.yellow(roleName)],
        ['Full Name', user.name],
        ['Email', email]
    );

    if (user.role === 'student' && user.details) {
        table.push(
            ['University', user.details.university || 'Not set'],
            ['Field', user.details.field || 'Not set'],
            ['Location', user.details.location || 'Not set'],
            ['Skills', user.details.skills || 'Not set']
        );
    } else if (user.role === 'company' && user.details) {
        table.push(
            ['Industry', user.details.industry || 'Not set'],
            ['Website', user.details.website || 'Not set'],
            ['Location', user.details.location || 'Not set']
        );
    }

    console.log('\n' + chalk.bold.underline('  --- USER PROFILE ---'));
    console.log(table.toString());

    if (user.details?.bio || user.details?.description) {
        console.log(boxen(user.details.bio || user.details.description, {
            title: 'Bio / Description',
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderStyle: 'single',
            borderColor: 'cyan',
            width: 73
        }));
    }
};
