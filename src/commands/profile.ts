import chalk from 'chalk';
import { getToken, getUser } from '../utils/storage.js';
import { displayUserProfile, errorMsg, infoMsg } from '../utils/ui.js';

export const profileCommand = async () => {
    const token = getToken();
    const user: any = getUser();

    if (!token || !user) {
        errorMsg('No active session found.');
        infoMsg('Please authenticate first by running: ' + chalk.cyan.bold('zila auth'));
        return;
    }

    displayUserProfile(user, user.email);
};
