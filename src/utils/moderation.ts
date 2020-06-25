import ValClient from '../ValClient';
import { Snowflake } from 'discord.js';

import { UserModerationOptions } from '../types/interfaces';

import { log, notify } from './general';
import { getMemberObject } from './object';
import { createUserModerationEmbed } from './embed';

export async function mute(client: ValClient, options: UserModerationOptions) {
	const { member, moderator, channel, reason } = options;

	const { ROLE_MUTED } = client.config.ROLES;
	const { CHANNEL_MOD_LOGS } = client.config.CHANNELS;

	const targetMember = getMemberObject(client, member);

	const embed = createUserModerationEmbed({
		title: 'Muted Member',
		member,
		moderator,
		channel,
		reason
	});

	try {
		await targetMember.roles.add(ROLE_MUTED);

		setTimeout(() => {
			unmute(client, {
				member,
				moderator,
				channel,
				reason: 'Mute time expired'
			});
		}, 5 * 60 * 1000);

		notify({
			client,
			notification: `<@${member}>`,
			embed,
			channel: CHANNEL_MOD_LOGS
		});
	} catch (err) {
		log(client, err, 'error');
	}
}

export async function ban(client: ValClient, options: UserModerationOptions) {
	const { member, moderator, channel, reason } = options;
	const { CHANNEL_MOD_LOGS } = client.config.CHANNELS;

	const targetMember = getMemberObject(client, member);

	const embed = createUserModerationEmbed({
		title: 'Banned Member',
		member,
		moderator,
		channel,
		reason
	});

	try {
		await targetMember.ban({ reason });
		notify({
			client,
			notification: `<@${member}>`,
			embed,
			channel: CHANNEL_MOD_LOGS
		});
	} catch (err) {
		log(client, err, 'error');
	}
}

export async function warn(client: ValClient, options: UserModerationOptions) {
	const { member, moderator, channel, reason } = options;
	const { CHANNEL_MOD_LOGS } = client.config.CHANNELS;
	const { ROLE_WARNED } = client.config.ROLES;

	const targetMember = getMemberObject(client, member);

	const embed = createUserModerationEmbed({
		title: 'Warned Member',
		member,
		moderator,
		channel,
		reason
	});

	try {
		await targetMember.roles.add(ROLE_WARNED);
		notify({
			client,
			notification: `<@${member}>`,
			embed,
			channel: CHANNEL_MOD_LOGS
		});
	} catch (err) {
		log(client, err, 'error');
	}
}

export async function unwarn(
	client: ValClient,
	options: UserModerationOptions
) {
	const { member, moderator, channel, reason } = options;
	const { ROLE_WARNED } = client.config.ROLES;
	const { CHANNEL_MOD_LOGS } = client.config.CHANNELS;

	const targetMember = getMemberObject(client, member);

	const embed = createUserModerationEmbed({
		title: 'Forgave Member',
		member,
		moderator,
		channel,
		reason
	});

	try {
		await targetMember.roles.remove(ROLE_WARNED);
		notify({
			client,
			notification: `<@${member}>`,
			embed,
			channel: CHANNEL_MOD_LOGS
		});
	} catch (err) {
		log(client, err, 'error');
	}
}

export async function unmute(
	client: ValClient,
	options: UserModerationOptions
) {
	const { member, moderator, channel, reason } = options;
	const { ROLE_MUTED } = client.config.ROLES;
	const { CHANNEL_MOD_LOGS } = client.config.CHANNELS;

	const targetMember = getMemberObject(client, member);

	const embed = createUserModerationEmbed({
		title: 'Unmuted Member',
		member,
		moderator,
		channel,
		reason
	});

	try {
		await targetMember.roles.remove(ROLE_MUTED);
		notify({
			client,
			notification: `<@${member}>`,
			embed,
			channel: CHANNEL_MOD_LOGS
		});
	} catch (err) {
		log(client, err, 'error');
	}
}

export function isWarned(client: ValClient, member: Snowflake) {
	const { ROLE_WARNED } = client.config.ROLES;
	const targetMember = getMemberObject(client, member);

	return targetMember.roles.cache.some(role => role.id === ROLE_WARNED);
}

export function isMuted(client: ValClient, member: string) {
	const { ROLE_MUTED } = client.config.ROLES;
	const targetMember = getMemberObject(client, member);

	return targetMember.roles.cache.some(role => role.id === ROLE_MUTED);
}
