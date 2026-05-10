import Conf from 'conf';

const schema = {
	token: {
		type: 'string',
	},
	user: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			email: { type: 'string' },
			name: { type: 'string' },
            role: { type: 'string' },
            details: { type: 'object' }
		}
	}
};

const config = new Conf({ 
    projectName: 'zila-agent',
    // @ts-ignore
    schema 
});

export const setToken = (token: string) => config.set('token', token);
export const getToken = () => config.get('token') as string | undefined;

export const setUser = (user: any) => config.set('user', user);
export const getUser = () => config.get('user');

export const clearAuth = () => {
    config.delete('token');
    config.delete('user');
};
