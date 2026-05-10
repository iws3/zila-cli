import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { fetchPrograms } from '../utils/api.js';
import { getToken, getUser } from '../utils/storage.js';
import { errorMsg, infoMsg, showWelcome } from '../utils/ui.js';

export const programsCommand = async (options: any) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        showWelcome();
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    if (!options.info) {
        errorMsg('Please specify an option. Use ' + chalk.cyan('zila programs --info') + ' to view program details.');
        return;
    }

    const spinner = ora('Fetching your programs...').start();

    try {
        const response = await fetchPrograms();
        const programsData = response.data.programs;

        if (!programsData || programsData.length === 0) {
            spinner.info(chalk.yellow('No active or previous programs found on your profile.'));
            return;
        }

        spinner.succeed(chalk.green('Successfully fetched your program details!\n'));

        const Table = require('cli-table3');

        programsData.forEach((app: any, index: number) => {
            const prog = app.programs || {};
            const comp = prog.company_profiles || {};

            console.log(chalk.bold.blue(`\n  [ Program #${index + 1} ]`));

            const table = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Details')],
                colWidths: [22, 60],
                wordWrap: true
            });

            const startDate = prog.start_date ? new Date(prog.start_date).toLocaleDateString() : 'TBD';
            const endDate = prog.end_date ? new Date(prog.end_date).toLocaleDateString() : 'TBD';

            table.push(
                ['Program Title', chalk.white.bold(prog.title || 'N/A')],
                ['Company', chalk.yellow(comp.company_name || 'N/A')],
                ['Category', prog.program_category ? prog.program_category.toUpperCase() : 'N/A'],
                ['Location', prog.location || 'Remote/Unknown'],
                ['Type', prog.type || 'N/A'],
                ['Dates', `${startDate} - ${endDate}`],
                ['Paid Status', prog.is_paid ? chalk.green('Paid') : chalk.gray('Unpaid')],
                ['Application Status', formatStatus(app.status)],
                ['Applied On', app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A']
            );

            console.log(table.toString());

            if (prog.description) {
                console.log(boxen(prog.description, {
                    title: 'Program Description',
                    padding: 1,
                    margin: { top: 1, bottom: 2 },
                    borderStyle: 'single',
                    borderColor: 'blue',
                    width: 84
                }));
            }
        });

    } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch programs.'));
        if (error.response && error.response.status === 401) {
            errorMsg('Session expired. Please run ' + chalk.cyan('zila auth') + ' again.');
        } else {
            console.error(error.message || error);
        }
    }
};

const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'accepted': return chalk.green.bold('ACCEPTED');
        case 'rejected': return chalk.red.bold('REJECTED');
        case 'reviewing':
        case 'reviewed': return chalk.yellow.bold('UNDER REVIEW');
        default: return chalk.gray.bold(status?.toUpperCase() || 'PENDING');
    }
};
