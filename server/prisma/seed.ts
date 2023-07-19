import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Fulano',
            email: 'fulano.cicrano@gmail.com',
            avatarUrl: 'https://github.com/weversonDev.png',
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Bolão do Fulano',
            code: 'BOL123',
            ownerId: user.id,

            //alem do usuário ser dono do bolão ele esta participando do bolão
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        
        //sempre salvar datas como timestamp no banco de dados
        data: {
            date: '2022-11-10T12:00:10.010Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR',
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-13T12:00:10.010Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id,
                            }
                        }
                    }
                }
            }
        },
    })
}

main()