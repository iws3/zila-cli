import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { fetchEvents } from '../utils/api.js';
import { getToken, getUser } from '../utils/storage.js';
import { errorMsg, infoMsg, showWelcome } from '../utils/ui.js';

export const eventsCommand = async (options: any) => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        showWelcome();
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    if (!options.info) {
        errorMsg('Please specify an option. Use ' + chalk.cyan('zila events --info') + ' to view event details.');
        return;
    }

    const spinner = ora('Fetching your events...').start();

    try {
        const response = await fetchEvents();
        const eventsData = response.data.events;

        if (!eventsData || eventsData.length === 0) {
            spinner.info(chalk.yellow('No active or previous events found on your profile.'));
            return;
        }

        spinner.succeed(chalk.green('Successfully fetched your event details!\n'));

        const Table = require('cli-table3');

        eventsData.forEach((app: any, index: number) => {
            const ev = app.event || {};
            const comp = ev.company_profiles || {};

            console.log(chalk.bold.blue(`\n  [ Event #${index + 1} ]`));

            const table = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Details')],
                colWidths: [22, 60],
                wordWrap: true
            });

            const startDate = ev.start_date ? new Date(ev.start_date).toLocaleDateString() : 'TBD';
            const endDate = ev.end_date ? new Date(ev.end_date).toLocaleDateString() : '';

            let when = startDate;
            if (endDate && endDate !== startDate) when += ` - ${endDate}`;
            if (ev.start_time) when += ` at ${ev.start_time}`;

            table.push(
                ['Event Title', chalk.white.bold(ev.title || 'N/A')],
                ['Host Company', chalk.yellow(comp.company_name || 'N/A')],
                ['Location', ev.location || 'Remote/Unknown'],
                ['When', when],
                ['Status', formatStatus(app.status)],
                ['Applied On', app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A']
            );

            console.log(table.toString());

            if (ev.description) {
                console.log(boxen(ev.description, {
                    title: 'Event Description',
                    padding: 1,
                    margin: { top: 1, bottom: 2 },
                    borderStyle: 'single',
                    borderColor: 'blue',
                    width: 84
                }));
            }
        });

    } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch events.'));
        if (error.response && error.response.status === 401) {
            errorMsg('Session expired. Please run ' + chalk.cyan('zila auth') + ' again.');
        } else {
            console.error(error.message || error);
        }
    }
};

const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'accepted': 
        case 'rsvp_confirmed': return chalk.green.bold('CONFIRMED');
        case 'rejected': return chalk.red.bold('REJECTED');
        case 'reviewing':
        case 'reviewed': return chalk.yellow.bold('UNDER REVIEW');
        default: return chalk.gray.bold(status?.toUpperCase() || 'PENDING');
    }
};
