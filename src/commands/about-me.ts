import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import { fetchProfile } from '../utils/api.js';
import { getToken, getUser } from '../utils/storage.js';
import { errorMsg, infoMsg, showWelcome } from '../utils/ui.js';

export const aboutMeCommand = async () => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
        showWelcome();
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    const spinner = ora('Fetching your full profile details...').start();

    try {
        const response = await fetchProfile();
        const profile = response.data.profile;
        const type = response.data.type; // 'student' or 'company'

        if (!profile) {
            spinner.info(chalk.yellow('No complete profile data found.'));
            return;
        }

        spinner.succeed(chalk.green('Successfully fetched your profile!\n'));

        const Table = require('cli-table3');

        console.log(chalk.bold.blue(`  [ ${profile.full_name || profile.company_name || 'Profile'} ]`));

        const table = new Table({
            head: [chalk.cyan('Attribute'), chalk.cyan('Details')],
            colWidths: [22, 60],
            wordWrap: true
        });

        if (type === 'student') {
            table.push(
                ['Full Name', chalk.white.bold(profile.full_name || 'N/A')],
                ['Email', profile.email || 'N/A'],
                ['Phone', profile.phone || 'N/A'],
                ['Location', profile.location || 'N/A'],
                ['University', chalk.yellow(profile.university || 'N/A')],
                ['Field of Study', profile.field_of_study || 'N/A'],
                ['Degree', profile.degree || 'N/A'],
                ['Graduation Year', profile.graduation_year || 'N/A'],
                ['GPA', profile.gpa || 'N/A'],
                ['Hard Skills', (profile.hard_skills || []).join(', ') || 'N/A'],
                ['Soft Skills', (profile.soft_skills || []).join(', ') || 'N/A'],
                ['Languages', (profile.languages || []).join(', ') || 'N/A'],
                ['LinkedIn', profile.linkedin_url ? chalk.blue.underline(profile.linkedin_url) : 'N/A'],
                ['GitHub', profile.github_url ? chalk.gray.underline(profile.github_url) : 'N/A'],
                ['Portfolio', profile.portfolio_url ? chalk.green.underline(profile.portfolio_url) : 'N/A'],
                ['Preferred Roles', (profile.preferred_roles || []).join(', ') || 'N/A'],
                ['Expected Stipend', profile.expected_stipend || 'N/A'],
                ['Work Mode', profile.work_mode || 'N/A'],
                ['Availability', profile.availability || 'N/A']
            );
        } else if (type === 'company') {
            table.push(
                ['Company Name', chalk.white.bold(profile.company_name || 'N/A')],
                ['Email', profile.email || 'N/A'],
                ['Industry', profile.industry || 'N/A'],
                ['Location', profile.location || 'N/A'],
                ['Website', profile.website_url ? chalk.blue.underline(profile.website_url) : 'N/A'],
                ['Company Size', profile.company_size || 'N/A'],
                ['Founded Year', profile.founded_year || 'N/A'],
                ['Verification Status', profile.verification_status || 'N/A']
            );
        }

        console.log(table.toString());

        const bioOrAbout = profile.about || profile.description;
        if (bioOrAbout) {
            console.log(boxen(bioOrAbout, {
                title: type === 'student' ? 'About Me' : 'Company Description',
                padding: 1,
                margin: { top: 1, bottom: 2 },
                borderStyle: 'round',
                borderColor: 'cyan',
                width: 84
            }));
        }

        if (profile.achievements) {
            const achievementsText = Array.isArray(profile.achievements) 
                ? profile.achievements.map((a: any) => `• ${a}`).join('\n')
                : String(profile.achievements);
                
            console.log(boxen(achievementsText, {
                title: 'Achievements & Extracurriculars',
                padding: 1,
                margin: { top: 0, bottom: 2 },
                borderStyle: 'single',
                borderColor: 'magenta',
                width: 84
            }));
        }

    } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch profile details.'));
        if (error.response && error.response.status === 401) {
            errorMsg('Session expired. Please run ' + chalk.cyan('zila auth') + ' again.');
        } else {
            console.error(error.message || error);
        }
    }
};
