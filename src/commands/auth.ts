import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import Table from 'cli-table3';
import { requestOTP, verifyOTP } from '../utils/api.js';
import { setToken, setUser } from '../utils/storage.js';
import boxen from 'boxen';
import { boxMsg, errorMsg, successMsg, infoMsg, displayUserProfile } from '../utils/ui.js';

export const authCommand = async () => {
    try {
        const { email } = await inquirer.prompt([
            {
                type: 'input',
                name: 'email',
                message: 'Enter your Zigex email:',
                validate: (input) => {
                    if (!input.includes('@')) return 'Please enter a valid email address';
                    return true;
                }
            }
        ]);

        const spinner = ora('Checking Zila account...').start();

        try {
            await requestOTP(email);
            spinner.succeed(chalk.green('Account found! Verification code sent to your email.'));
        } catch (error: any) {
            spinner.stop();
            if (error.response?.status === 404) {
                boxMsg(
                    `We couldn't find an account for ${chalk.yellow(email)}.\n\nPlease create an account at:\n${chalk.cyan.bold('https://zigexconnect.com/signup')}`,
                    'Account Not Found',
                    'red'
                );
                return;
            }
            errorMsg(error.response?.data?.message || 'Failed to connect to Zila API. Make sure the API is running.');
            return;
        }

        const { otp } = await inquirer.prompt([
            {
                type: 'input',
                name: 'otp',
                message: 'Enter the 6-digit OTP code:',
                validate: (input) => {
                    if (input.length !== 6) return 'OTP must be 6 digits';
                    return true;
                }
            }
        ]);

        const verifySpinner = ora('Verifying code...').start();

        try {
            const response = await verifyOTP(email, otp);
            const { token, user } = response.data;

            setToken(token);
            setUser(user);

            verifySpinner.succeed(chalk.green('Authentication successful!'));

            displayUserProfile(user, email);
            successMsg(`Welcome back, ${chalk.yellow(user.name)}! ZILA is ready to assist you.`);

        } catch (error: any) {
            verifySpinner.fail(chalk.red('Invalid or expired OTP. Please try again.'));
        }

    } catch (error: any) {
        errorMsg('An unexpected error occurred during authentication.');
        console.error(error);
    }
};
