import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { fetchRoles } from '../utils/api.js';
import { getToken } from '../utils/storage.js';
import { errorMsg, infoMsg } from '../utils/ui.js';

export const rolesCommand = async () => {
    const token = getToken();
    if (!token) {
        errorMsg('No active session. Please authenticate first.');
        return;
    }

    const spinner = ora('Checking your Zigex roles...').start();

    try {
        const response = await fetchRoles();
        const roles = response.data.roles;

        spinner.stop();

        if (!roles || roles.length === 0) {
            infoMsg('You currently have no active roles on Zigex.');
            return;
        }

        console.log(chalk.bold.blue('\n  --- YOUR ZIGEX ROLES ---'));
        
        const roleList = roles.map((role: string) => {
            if (role === 'supervisor') return chalk.green('• Supervisor');
            if (role === 'student') return chalk.cyan('• Student');
            if (role === 'intern') return chalk.yellow('• Intern');
            if (role.startsWith('attending program')) return chalk.magenta(`• ${role}`);
            return `• ${role}`;
        }).join('\n');

        console.log(boxen(roleList, {
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderStyle: 'round',
            borderColor: 'blue',
            title: 'Active Roles',
            titleAlignment: 'center'
        }));

        if (roles.includes('supervisor')) {
            console.log(chalk.gray('  (Hint: Use ') + chalk.cyan('zila students') + chalk.gray(' to see students you supervise)\n'));
        }

    } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch roles.'));
        console.error(error.message || error);
    }
};
