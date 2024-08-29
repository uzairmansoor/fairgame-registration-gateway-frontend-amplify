import { getUrls } from './default';

export const environment = {
    production: true,
    ...getUrls(),
};
