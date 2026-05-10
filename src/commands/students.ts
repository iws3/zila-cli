import chalk from 'chalk';
import ora from 'ora';
import { fetchSupervisedStudents } from '../utils/api.js';
import { getToken } from '../utils/storage.js';
import { errorMsg } from '../utils/ui.js';

export const studentsCommand = async () => {
    const token = getToken();
    if (!token) {
        errorMsg('No active session. Please authenticate first.');
        return;
    }

    const spinner = ora('Fetching students you are supervising...').start();

    try {
        const response = await fetchSupervisedStudents();
        const students = response.data.students;

        spinner.stop();

        if (!students || students.length === 0) {
            console.log(chalk.yellow('\n  You are not currently supervising any students.'));
            return;
        }

        const Table = require('cli-table3');
        const table = new Table({
            head: [chalk.cyan('Student Name'), chalk.cyan('Domain/Dept'), chalk.cyan('Status'), chalk.cyan('Joined At')],
            colWidths: [25, 20, 15, 20],
            wordWrap: true
        });

        students.forEach((s: any) => {
            table.push([
                chalk.white.bold(s.name),
                s.domain || 'N/A',
                s.status === 'accepted' ? chalk.green(s.status) : s.status,
                new Date(s.joined_at).toLocaleDateString()
            ]);
        });

        console.log(chalk.bold.green('\n  --- SUPERVISED STUDENTS ---'));
        console.log(table.toString());
        console.log(chalk.gray(`  Total: ${students.length} students supervised.\n`));

    } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch supervised students.'));
        if (error.response && error.response.status === 403) {
            console.log(chalk.red('  Error: This command is only available for supervisors.'));
        } else {
            console.error(error.message || error);
        }
    }
};
