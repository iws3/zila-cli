import chalk from 'chalk';
import ora from 'ora';
import { logout as apiLogout } from '../utils/api.js';
import { clearAuth } from '../utils/storage.js';

export const logoutCommand = async () => {
    const spinner = ora('Logging out of Zila...').start();

    try {
        // Optional: Call backend to log the logout event
        await apiLogout();
        
        // Clear local storage
        clearAuth();

        spinner.succeed(chalk.green('Successfully logged out of Zila.'));
        console.log(chalk.cyan('Run "zila auth" to log back in.'));
    } catch (error: any) {
        // Even if the API call fails, we should clear the local session
        clearAuth();
        
        spinner.warn(chalk.yellow('Logged out locally, but could not notify the server.'));
        console.log(chalk.cyan('Session cleared. Run "zila auth" to log back in.'));
    }
};
