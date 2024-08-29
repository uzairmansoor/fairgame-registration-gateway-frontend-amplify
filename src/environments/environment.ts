import { getUrls } from './default';

export const environment = {
    production: false,
    ...getUrls(),
};
