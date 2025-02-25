/* eslint-disable prefer-rest-params */
import {
	AlertLevel,
	NotificationOptions,
	ReminderSubscription,
} from "../types/interfaces";
import { QueueController } from "../controllers";
import ValClient from "../ValClient";

import { getChannelObject } from "./object";
import { TextChannel, GuildMember, Message, Permissions } from "discord.js";
import { ParsedResult } from "chrono-node";

const { ROLE_DEVELOPER, MODE } = process.env;

export function createAlertMessage(message: string, alertLevel: AlertLevel) {
	const notification = `[${alertLevel}] ${message}`;

	if (alertLevel === "info") return notification;
	else return `${notification} <@&${ROLE_DEVELOPER}>`;
}

/**
 * Logs events to client and console
 */
export async function log(
	client: ValClient,
	notification: string | Error,
	alertLevel: AlertLevel,
) {
	const queue = <QueueController>client.controllers.get("queue");
	console.log(`[${alertLevel}]`, notification); // need console regardless

	if (MODE !== "PRODUCTION" || alertLevel === "info") return;

	if (!client.ready) {
		if (queue) queue.enqueue({ func: log, args: [...arguments] });
		return;
	}

	const { CHANNEL_BOT_STATUS } = client.config;

	try {
		const channel = <TextChannel>getChannelObject(client, CHANNEL_BOT_STATUS);
		const message = createAlertMessage(String(notification), alertLevel);

		if (typeof notification === "object")
			await channel.send(
				`${message}\n\n**Stack trace**\n${notification.stack}`,
			);
		else await channel.send(`${message}`);
	} catch (error) {
		console.log(error);
	}
}

/**
 * Sends notification to specified channel or to notifications channel
 */
export async function notify(options: NotificationOptions) {
	const { client, notification, embed, channel } = options;
	const queue = <QueueController>client.controllers.get("queue");

	if (!client.ready)
		return queue.enqueue({ func: notify, args: [...arguments] });

	const { CHANNEL_NOTIFICATIONS } = client.config;

	const target = getChannelObject(client, channel || CHANNEL_NOTIFICATIONS);

	if (!target) throw Error("Channel unavailable");

	await target.send({ content: notification, embed });
}

/**
 * Calculates the number of unique words in a sentence
 */
export function calculateUniqueWords(message: string) {
	const unique: { [index: string]: number } = {};

	return message.split(" ").filter(word => {
		if (unique[word] > 3) return false;

		if (unique[word] === undefined) {
			unique[word] = 0;
			return true;
		}

		unique[word] += 1;
		return false;
	}).length;
}

export function calculateNextLevel(exp: number) {
	const level = Math.floor((exp - 60) / 6);
	return level <= 0 ? 1 : level;
}

export function levelToExp(level: number) {
	return level * 6 + 60;
}

export function capitalise(str: string) {
	return str.replace(
		/\w\S*/g,
		txt => txt.charAt(0).toUpperCase() + txt.substr(1),
	);
}

// Transforms an object to include only keys available in another object. Flat objects only.
export function transformObject<T>(
	first: Record<string, unknown>,
	second: Record<string, unknown>,
): T {
	const x1 = { ...first };
	const x2 = { ...second };

	Object.keys(x2).forEach(key => {
		if (!x1[key]) {
			x1[key] = x2[key];
		}
	});

	Object.keys(x1).forEach(key => {
		if (typeof x2[key] === "undefined") {
			delete x1[key];
		}
	});

	return <T>(<Record<string, unknown>>x1);
}

export async function awaitMessages(channel: TextChannel, member: GuildMember) {
	const filter = ({ author }: Message) => author.id === member.id;
	const options = {
		max: 1,
		time: 60 * 1000,
		errors: ["time"],
	};

	return (await channel.awaitMessages(filter, options)).first().content;
}

export function reminderSubsToString(subs: ReminderSubscription[]) {
	return subs
		.map(sub => `<@${sub.member}>: ${sub.description}`)
		.reduce((final, curr) => `${final}\n${curr}`, "");
}

/**
 * Compiles a handlebars template (dumb)
 * Uses new RegExp to create keys, make sure to handle that in your code.
 */
export function compileTemplate(
	data: Record<string, unknown>,
	template: string,
) {
	let temp = template;

	Object.keys(data).forEach(key => {
		temp = temp.replace(new RegExp(`${key}`, "g"), <string>data[key]);
	});

	return temp;
}

export const isAdmin = (member: GuildMember) =>
	member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

export const isDev = () => process.env.MODE === "DEVELOPMENT";

export const chronoResultToObject = (result: ParsedResult) => ({
	year: result.start.get("year"),
	month: result.start.get("month"),
	day: result.start.get("day"),
	hour: result.start.get("hour"),
	minute: result.start.get("minute"),
	second: result.start.get("second"),
});
