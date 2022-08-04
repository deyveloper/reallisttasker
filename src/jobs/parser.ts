import moment from 'moment';
import Parser from "reallistparser";
import { PrismaClient } from ".prisma/client";
import { RedisMainClient } from '../interfaces/redis';
import _categories from './categories.json';
import { delay, hashAuthor, hashItem } from '../utils';

const categories: {
    [key: string]: string
} = _categories;

export async function CategoryItemLinksParse(this: {
    prisma: PrismaClient,
    parser: Parser
}) {
    const newJob = await this.prisma.jobInfo.create({
        data: {
            type: 'CategoryItemLinksParse',
        },
    });
    console.info(`CategoryItemLinksParse - started. [${newJob.id}]`);
    let allItemsData: {
        [key: string]: {
            name: string
        }
    } = {};
    for (let categoryId in categories) {
        let allCategoryItemsIds: string[] = [];
        let data: {
            [key: string]: {
                name: string
            }
        } = {};
        let toInsert: {
            categoryId: string,
            listId: string,
        }[] = [];

        let lastCountOfItems = 0;
        let page = 0;
        do {
            lastCountOfItems = Object.keys(data).length;
            let currentParsed;
            try {
                currentParsed = await this.parser.getCategoryLinks({
                    categoryId,
                    page: page.toString()
                });
            } catch (e) {
                console.error(e);
                continue;
            }

            data = {
                ...currentParsed, ...data
            };

            allItemsData = {
                ...allItemsData,
                ...currentParsed
            };

            page++;

            if (lastCountOfItems === Object.keys(data).length)
                continue;

            toInsert = [
                ...toInsert,
                ...Object.keys(currentParsed)
                    .map((e) => {
                        const id = e.split('/').slice(-1)[0];
                        allCategoryItemsIds.push(id);
                        return {
                            categoryId,
                            listId: id
                        };
                    })
            ];

            const pageLastItemInfo: {
                categoryId: string,
                listId: string,
            } | undefined = toInsert.slice(-1)[0];

            if (!pageLastItemInfo)
                continue;
        } while (lastCountOfItems !== Object.keys(data).length)

        (async () => {
            let lastIndex = 0;
            for (let currIndex = 0; currIndex < toInsert.length + 100; currIndex += 100) {
                await this.prisma.item.createMany({
                    data: toInsert.slice(lastIndex, currIndex),
                    skipDuplicates: true
                });
                lastIndex = currIndex;
            }
            await this.prisma.item.updateMany({
                data: {
                    updatedAt: {
                        set: new Date()
                    }
                },
                where: {
                    listId: {
                        in: allCategoryItemsIds
                    }
                }
            })
        })();

        console.info(`[result] CategoryId: ${categoryId},`
            + ` Category: ${categories[categoryId]},`
            + ` foundPages: ${page}, foundItems: ${Object.keys(data).length}. [${newJob.id}]`);
    }

    await this.prisma.jobInfo.update({
        where: {
            id: newJob.id
        },
        data: {
            done: true,
            finishedAt: new Date(),
            additionalInfo: JSON.stringify({
                numberOfParsed: Object.keys(allItemsData).length
            })
        }
    });

    console.info(`CategoryItemLinksParse - finished, [${newJob.id}]`);
};


export async function ItemDetailsParse(this: {
    prisma: PrismaClient,
    parser: Parser,
    redis: RedisMainClient
}) {
    const newJob = await this.prisma.jobInfo.create({
        data: {
            type: 'ItemDetailsParse',
        },
    });

    console.info(`${moment().unix()} ItemDetailsParse - started. [${newJob.id}]`);

    const itemsToPrepare = await this.prisma.item.findMany({
        where: {
            OR: [
                { lastFoundInfo: null },
                {
                    lastFoundInfo: {
                        gte: moment().subtract(30, 'd').toDate()
                    }
                }
            ]
        }
    });

    const promises: Promise<unknown>[] = [];

    let currCount = 0;
    for (let item of itemsToPrepare) {
        promises.push((async () => {
            while (currCount >= 20) {
                await delay(1000);
            }

            currCount++;
            let index = 0;
            try {
                const itemParsed = await this.parser
                    .getItemInfo({ itemId: item.listId });

                const itemHash = hashItem(itemParsed);

                const lastItemUpdate = await this.prisma.itemUpdated.findFirst({
                    where: {
                        itemId: item.id
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                if (!lastItemUpdate
                    || lastItemUpdate.hash !== itemHash) {
                    /**
                     * Case when item update doesn't exists or
                     * last existing update hash is not equal to current hasb.
                     */
                    const itemUpdateCreationData = {
                        itemId: item.id,
                        name: itemParsed.name || null,
                        priceAmount: parseFloat
                            (itemParsed.price.priceAmount || '')
                            || null,
                        currency: itemParsed.price.currency,
                        priceAdditionalInfo: itemParsed
                            .price.additionalInfo,
                        location: itemParsed.location.location,
                        locationMapRef: itemParsed
                            .location.mapRef,
                        flagTop: itemParsed.flags.top,
                        flagHome: itemParsed.flags.homepage,
                        flagUrgent: itemParsed.flags.urgent,
                        datePosted: itemParsed?.footer
                            ?.datePosted?.toDate(),
                        dateRenewed: itemParsed?.footer
                            ?.renewed?.toDate(),
                        categories: itemParsed.categories.categories,
                        properties: JSON
                            .stringify(itemParsed.properties),
                        images: itemParsed.images,
                        hash: itemHash
                    };

                    await this.prisma.itemUpdated.create({
                        data: itemUpdateCreationData
                    });
                }

                const userListId = itemParsed.author
                    .userUrl.split('/').reverse()[0];

                let postUser = await this.prisma.user.findFirst({
                    where: {
                        listId: userListId
                    }
                });

                if (!postUser) {
                    postUser = await this.prisma.user.create({
                        data: {
                            listId: userListId
                        }
                    });
                }

                const authorHash = hashAuthor(itemParsed.author);
                const lastAuthorInfo = await this.prisma.itemUpdated.findFirst({
                    where: {
                        hash: authorHash
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });


                if (!lastAuthorInfo
                    || lastAuthorInfo.hash !== authorHash) {
                    await this.prisma.authorInfo.createMany({
                        data: [{
                            itemId: item.id,
                            name: itemParsed.author.name,
                            avatar: itemParsed.author.avatar,
                            phones: itemParsed.author.phones,
                            userUrl: itemParsed.author.userUrl,
                            hash: authorHash,
                            userId: postUser.id,
                            jobHash: `${newJob.id}_${authorHash}`
                        }],
                        skipDuplicates: true
                    });
                }
                
                index++;
                console.info(`[${index}], post: ${itemHash}, author: ${authorHash}, ${moment().unix()}`)
            } catch (e) {
                // console.error(e);
            }
            currCount--;
        })());
    }

    await Promise.all(promises);

    await this.prisma.jobInfo.update({
        where: {
            id: newJob.id
        },
        data: {
            done: true,
            finishedAt: new Date()
        }
    });

    console.info(`ItemDetailsParse - finished. [${newJob.id}]`);
};