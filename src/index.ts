#!/usr/bin/env node
import { Command } from 'commander';
import { showWelcome } from './utils/ui.js';
import { authCommand } from './commands/auth.js';
import { startCommand } from './commands/start.js';
import { profileCommand } from './commands/profile.js';
import { internshipCommand } from './commands/internships.js';
import { programsCommand } from './commands/programs.js';
import { eventsCommand } from './commands/events.js';
import { aboutMeCommand } from './commands/about-me.js';
import { rolesCommand } from './commands/roles.js';
import { studentsCommand } from './commands/students.js';
import { logoutCommand } from './commands/logout.js';

const program = new Command();

program
  .name('zila')
  .description('Zigex Dynamic Intelligent Learning Assistant')
  .version('1.0.0')
  .option('--role', 'Display your current role on Zigex')
  .option('--student', 'Display students you are supervising (for Supervisors)');

// Show welcome message on raw "zila" call or whenever appropriate
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === 'help') {
    showWelcome();
}

program
  .command('auth')
  .description('Authenticate with your Zigex account')
  .action(authCommand);

// Add more commands here later
program
  .command('profile')
  .alias('-profile') // Handle zila -profile
  .description('Display your current user profile')
  .action(profileCommand);

program
  .command('internship')
  .description('Manage or view your internships')
  .option('--info', 'View full details of your internships')
  .action(internshipCommand);

program
  .command('programs')
  .description('Manage or view your programs')
  .option('--info', 'View full details of your programs')
  .action(programsCommand);

program
  .command('events')
  .description('Manage or view your events')
  .option('--info', 'View full details of your events')
  .action(eventsCommand);

program
  .command('about-me')
  .description('Fetch and display your full detailed profile')
  .action(aboutMeCommand);

program
  .command('start')
  .description('Start the ZILA agent session')
  .action(startCommand);

program
  .command('status')
  .description('Check ZILA connection status')
  .action(() => {
      console.log('ZILA is active and monitoring your workspace.');
  });

program
  .command('roles')
  .description('Display your current roles on Zigex')
  .action(rolesCommand);

program
  .command('students')
  .description('Display students you are supervising')
  .action(studentsCommand);

program
  .command('logout')
  .description('Logout and clear your Zigex session')
  .action(logoutCommand);

program.parse(process.argv);

// Handle global flags if no subcommand was called
const options = program.opts();
if (options.role) {
    rolesCommand();
} else if (options.student) {
    studentsCommand();
}
