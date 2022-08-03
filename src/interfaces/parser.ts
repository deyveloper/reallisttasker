import { Moment } from 'moment';

export interface ItemInfo {
    name: string,
    description: string,
    price: {
        priceAmount?: string,
        currency?: string,
        additionalInfo?: string
    },
    location: {
        location?: string,
        mapRef?: string
    },
    flags: { top: boolean, homepage: boolean, urgent: boolean },
    footer: {
        datePosted: Moment
        renewed?: Moment
    },
    categories
    : { categories: string[] },
    properties: { [key: string]: string },
    images: string[]
}

export interface AuthorInfo {
    name: string,
    registerSince: Moment,
    avatar: string,
    phones: string[],
    userUrl: string
}