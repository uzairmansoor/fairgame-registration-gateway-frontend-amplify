import { baseModelConfigKey } from '@app/app.config';

export interface IBaseModel<T> {
    [baseModelConfigKey]: T;
}
