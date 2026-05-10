import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { fetchInternships } from '../utils/api.js';
import { getToken, getUser } from '../utils/storage.js';
import { errorMsg, infoMsg, showWelcome } from '../utils/ui.js';

export const internshipCommand = async (options: any) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        showWelcome();
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    if (!options.info) {
        errorMsg('Please specify an option. Use ' + chalk.cyan('zila internship --info') + ' to view internship details.');
        return;
    }

    const spinner = ora('Fetching your internship records...').start();

    try {
        const response = await fetchInternships();
        const internships = response.data.internships;

        if (!internships || internships.length === 0) {
            spinner.info(chalk.yellow('No active or previous internships found on your profile.'));
            return;
        }

        spinner.succeed(chalk.green('Successfully fetched your internship details!\n'));

        // Since we import cli-table3 dynamically here to avoid clutter
        const Table = require('cli-table3');

        internships.forEach((app: any, index: number) => {
            const internData = app.internships || {};
            const compData = internData.company_profiles || {};
            const supData = app.supervisor_profiles || {};

            console.log(chalk.bold.blue(`\n  [ Internship #${index + 1} ]`));

            const table = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Details')],
                colWidths: [22, 60],
                wordWrap: true
            });

            table.push(
                ['Internship Name', chalk.white.bold(internData.title || 'N/A')],
                ['Company', chalk.yellow(compData.company_name || 'Not assigned')],
                ['Industry', compData.industry || 'N/A'],
                ['Location', internData.location || 'Remote/Unknown'],
                ['Paid Status', internData.is_paid ? chalk.green('Paid') : chalk.gray('Unpaid')],
                ['Application Status', formatStatus(app.status)],
                ['Applied On', app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A']
            );

            // Supervisor info
            if (supData && supData.full_name) {
                table.push(
                    ['Supervisor', chalk.magenta(supData.full_name)],
                    ['Supervisor Email', supData.email || 'N/A'],
                    ['Department', supData.department || 'N/A']
                );
            } else {
                table.push(['Supervisor', chalk.gray('Not yet assigned')]);
            }

            console.log(table.toString());

            if (internData.description) {
                console.log(boxen(internData.description, {
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
        spinner.fail(chalk.red('Failed to fetch internships.'));
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
