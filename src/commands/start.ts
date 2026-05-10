import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { getToken, getUser } from '../utils/storage.js';
import { errorMsg, infoMsg, showWelcome, successMsg, boxMsg } from '../utils/ui.js';
import { profileCommand } from './profile.js';
import { internshipCommand } from './internships.js';
import { programsCommand } from './programs.js';
import { eventsCommand } from './events.js';
import { aboutMeCommand } from './about-me.js';
import { rolesCommand } from './roles.js';
import { studentsCommand } from './students.js';
import { logoutCommand } from './logout.js';

export const startCommand = async () => {
    const token = getToken();
    const user: any = getUser();

    if (!token || !user) {
        showWelcome();
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    showWelcome();
    
    const spinner = ora('Initializing ZILA Core...').start();

    // Await artificial initialization
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    spinner.succeed(chalk.green('ZILA Agent initialized and ready.'));
    
    const normalizedRole = user.role ? user.role.toLowerCase() : 'student';
    const roleDisplay = normalizedRole.toUpperCase();
    
    boxMsg(
        `${chalk.bold('Active User:')} ${user.name}\n${chalk.bold('Role:')} ${roleDisplay}\n${chalk.bold('Status:')} ${chalk.green('Online')}`,
        'ZILA AGENT ACTIVE',
        'green'
    );

    console.log(chalk.gray('  Type "help" to see available agent capabilities, or "-stop" to exit.'));
    console.log(chalk.gray('  ZILA is now monitoring your development environment...\n'));

    // Helper for artificial delay to smooth the experience
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // --- System Diagnostics ---
    const checkTool = async (name: string, command: string, fallback?: string) => {
        const spinner = ora({
            text: `Scanning for ${chalk.cyan(name)}...`,
            color: 'blue'
        }).start();

        // Artificial "processing" time for smooth experience
        await delay(3500);

        try {
            execSync(command, { stdio: 'ignore' });
            spinner.succeed(`${chalk.bold(name)} verified ${chalk.green('✔')}`);
            return true;
        } catch (e) {
            if (fallback) {
                try {
                    execSync(fallback, { stdio: 'ignore' });
                    spinner.succeed(`${chalk.bold(name)} verified (via fallback) ${chalk.green('✔')}`);
                    return true;
                } catch (err) {
                    // Fallback also failed
                }
            }
            spinner.fail(`${chalk.bold(name)} not found ${chalk.red('✘')}`);
            return false;
        }
    };

    const verifyZigexStatus = async (user: any) => {
        const spinner = ora({
            text: `Confirming ${chalk.cyan('Zigex Registration')}...`,
            color: 'blue'
        }).start();

        await delay(3500);
        
        if (user && user.email) {
            spinner.succeed(`${chalk.bold('Zigex Account')} verified ${chalk.green('✔')}`);
            return true;
        }
        spinner.fail(`${chalk.bold('Zigex Account')} not found ${chalk.red('✘')}`);
        return false;
    };

    const verifyInternshipStatus = async (role: string) => {
        const spinner = ora({
            text: `Verifying ${chalk.cyan('Internship Status')}...`,
            color: 'blue'
        }).start();

        await delay(3500);

        if (role === 'student' || role === 'intern') {
            spinner.succeed(`${chalk.bold('Intern Status')} verified ${chalk.green('✔')}`);
            return true;
        }
        spinner.warn(`${chalk.bold('Role:')} ${role.toUpperCase()} (Not an Intern)`);
        return false;
    };

    console.log(chalk.bold('🔍 INITIALIZING DEEP SYSTEM SCAN:'));
    
    // Step 1: Identity & Role
    const accountOk = await verifyZigexStatus(user);
    const isIntern = await verifyInternshipStatus(normalizedRole);
    
    // Step 2: Local Tools
    const hasNode = await checkTool('Node.js', 'node -v');
    const hasPython = await checkTool('Python', 'python --version', 'python3 --version');
    const hasGit = await checkTool('Git', 'git --version');
    console.log('');

    const allToolsPresent = hasNode && hasPython && hasGit;

    // --- Dynamic Contextual Intelligence Greeting ---
    if (normalizedRole === 'student' || normalizedRole === 'intern') {
        const skills = user.details?.skills?.join(', ') || 'your tech stack';
        const field = user.details?.field || 'Tech';
        
        console.log(chalk.blue(`🤖 ZILA: Hello ${user.name}! I see you're an ambitious intern studying ${chalk.cyan(field)}.`));
        
        if (allToolsPresent) {
            console.log(chalk.green(`         🚀 All systems go! You have the necessary tools installed and are ready to start.`));
        } else {
            const missing = [];
            if (!hasNode) missing.push(chalk.bold('Node.js'));
            if (!hasPython) missing.push(chalk.bold('Python'));
            if (!hasGit) missing.push(chalk.bold('Git'));
            console.log(chalk.yellow(`         ⚠️  Some tools are missing. Please install ${missing.join(', ')} to get the full ZILA experience.`));
        }

        console.log(chalk.blue(`         I've tailored my analysis towards helping you grow your skills in ${chalk.cyan(skills)}.`));
        console.log(chalk.blue(`         Remember, every line of code is a learning opportunity. Take your time, and don't hesitate to ask for help!`));
        console.log('');
    } else if (normalizedRole === 'company' || normalizedRole === 'supervisor') {
        const industry = user.details?.industry || 'your industry';
        console.log(chalk.magenta(`🤖 ZILA: Welcome back, Supervisor (${user.name}).`));
        
        if (allToolsPresent) {
            console.log(chalk.green(`         ✅ Environment verified. Your workspace is ready for talent management.`));
        }

        console.log(chalk.magenta(`         Ready to review internship candidates and manage your projects in the ${chalk.cyan(industry)} sector.`));
        console.log(chalk.magenta(`         Let's find the best talent and ensure a smooth workflow today.`));
        console.log('');
    }

    // The REPL Loop
    let running = true;
    while (running) {
        const { command } = await inquirer.prompt([
            {
                type: 'input',
                name: 'command',
                message: chalk.cyan.bold('zila>'),
                prefix: '' // Remove the default inquirer question mark
            }
        ]);

        const cmd = command.trim().toLowerCase();

        switch (cmd) {
            case '-stop':
            case 'stop':
            case 'exit':
                running = false;
                successMsg('ZILA Agent offline. Goodbye!');
                break;
            case 'profile':
            case '-profile':
                await profileCommand();
                break;
            case 'internship --info':
            case 'internhips --info':
                await internshipCommand({ info: true });
                break;
            case 'programs --info':
                await programsCommand({ info: true });
                break;
            case 'events --info':
                await eventsCommand({ info: true });
                break;
            case 'about-me':
                await aboutMeCommand();
                break;
            case 'roles':
                await rolesCommand();
                break;
            case 'students':
                await studentsCommand();
                break;
            case 'status':
                infoMsg('ZILA is active and monitoring your workspace.');
                break;
            case 'logout':
                await logoutCommand();
                running = false;
                break;
            case 'help':
                console.log(chalk.white('\nAvailable Interactive Commands:'));
                console.log(`  ${chalk.cyan('profile')} / ${chalk.cyan('-profile')}  - View your short profile summary`);
                console.log(`  ${chalk.cyan('about-me')}             - Fetch your full detailed profile and skills`);
                console.log(`  ${chalk.cyan('roles')}                - See all your roles on Zigex`);
                console.log(`  ${chalk.cyan('students')}             - See students you are supervising`);
                console.log(`  ${chalk.cyan('internship --info')}    - View details about your internships`);
                console.log(`  ${chalk.cyan('programs --info')}      - View details about your programs`);
                console.log(`  ${chalk.cyan('events --info')}        - View details about your events`);
                console.log(`  ${chalk.cyan('status')}               - Check agent connection`);
                console.log(`  ${chalk.cyan('logout')}               - Logout and exit`);
                console.log(`  ${chalk.cyan('-stop')} / ${chalk.cyan('exit')}       - Shut down ZILA agent\n`);
                break;
            case '':
                // Ignore empty enter strokes
                break;
            default:
                errorMsg(`Command not recognized: ${chalk.yellow(cmd)}. Type "help" for a list of commands.`);
                break;
        }
    }
};
