import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.deleteMany();
	await prisma.session.deleteMany();

	console.log("Seeding...");

	const user1 = await prisma.user.create({
		data: {
			email: "johndoe@demo.com",
			hashedPassword:
				"$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // secret42
			username: "johndoe",
			numberOfGames: 0,
			wins: 0,
			loses: 0,
			draws: 0,
		},
	});
	const user2 = await prisma.user.create({
		data: {
			email: "jamesdoe@demo.com",
			hashedPassword:
				"$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // secret42
			username: "jamesdoe",
			numberOfGames: 0,
			wins: 0,
			loses: 0,
			draws: 0,
		},
	});

	console.log({ user1, user2 });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
