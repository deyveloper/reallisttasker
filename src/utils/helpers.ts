import crypto from 'crypto';
import { AuthorInfo, ItemInfo } from '../interfaces/parser';

export const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const hashItem = (itemObj: ItemInfo) => {
    const toStringify = {
        name: itemObj.name,
        description: itemObj.description,
        priceAmount: itemObj.price.priceAmount,
        currency: itemObj.price.currency,
        additionalInfo: itemObj.price.additionalInfo,
        location: itemObj.location.location,
        mapRef: itemObj.location.mapRef,
        top: itemObj.flags.top,
        homepage: itemObj.flags.homepage,
        urgent: itemObj.flags.urgent,
        renewed: itemObj.footer.datePosted,
        categories: itemObj.categories.categories.join(','),
        properties: itemObj.properties,
        images: itemObj.images.join(',')
    };

    const stringified = JSON.stringify(toStringify);
    const hash = crypto.createHash('md5')
        .update(stringified)
        .digest('hex');

    return hash;
};

export const hashAuthor = (itemObj: AuthorInfo) => {
    const toStringify = {
        name: itemObj.name,
        registerSince: itemObj.registerSince,
        avatar: itemObj.avatar,
        phones: itemObj.phones.join(','),
        userUrl: itemObj.userUrl
    };

    const stringified = JSON.stringify(toStringify);
    const hash = crypto.createHash('md5')
        .update(stringified)
        .digest('hex');

    return hash;
};