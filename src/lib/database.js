import prisma from "@src/lib/prisma";

/**
 * @param {string} userId
 * @throws {Error} If database operation fails
 */
export const getUserWishlist = async (userId) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: "asc" },
  });

  return {
    items: items.map((item) => ({
      id: item.itemId,
      name: item.name,
      imgSrc: item.imgSrc,
      releaseDate: item.releaseDate,
      addedAt: item.addedAt,
    })),
    updatedAt: items.at(-1)?.addedAt ?? new Date(),
  };
};

/**
 * @param {string} userId
 * @param {{ items: Array<{id: string|number}>, updatedAt: number|null }} wishlistData
 * @throws {Error} If database operation fails
 */
export const updateUserWishlist = async (userId, wishlistData) => {
  await prisma.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({ where: { userId } });

    if (wishlistData.items.length) {
      await tx.wishlistItem.createMany({
        data: wishlistData.items.map((item) => ({
          userId,
          itemId: String(item.id),
          name: item.name ?? null,
          imgSrc: item.imgSrc ?? null,
          releaseDate: item.releaseDate ?? null,
        })),
      });
    }
  });
};

/**
 * @throws {Error} If database operation fails
 */
export const getRankings = async () => {
  const rankings = await prisma.ranking.findMany({
    take: 10,
    orderBy: [{ streakRecord: "desc" }, { curStreak: "desc" }],
    include: { user: { select: { name: true, email: true } } },
  });

  return rankings.map((r) => ({
    id: r.userId,
    name: r.user.name,
    email: r.user.email,
    streakRecord: r.streakRecord,
    curStreak: r.curStreak,
    updatedAt: r.updatedAt,
  }));
};

/**
 * @param {string} userId
 * @param {{ name: string, email: string, victory: boolean }} rankingData
 * @returns {Promise<{created: boolean, userId: string, curStreak: number, streakRecord: number}>}
 * @throws {Error} If database operation fails
 */
export const upsertRanking = async (userId, rankingData) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.ranking.findUnique({ where: { userId } });
    let created = false;
    let curStreak = 0;
    let streakRecord = 0;

    if (!existing) {
      created = true;
      curStreak = rankingData.victory ? 1 : 0;
      streakRecord = rankingData.victory ? 1 : 0;
      await tx.ranking.create({ data: { userId, curStreak, streakRecord } });
    } else {
      curStreak = rankingData.victory ? existing.curStreak + 1 : 0;
      streakRecord = Math.max(existing.streakRecord, curStreak);
      await tx.ranking.update({
        where: { userId },
        data: { curStreak, streakRecord },
      });
    }

    return { created, userId, curStreak, streakRecord };
  });
};
