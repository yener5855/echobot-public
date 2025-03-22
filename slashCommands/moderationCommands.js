const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = [
    // Moderation Commands
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => option.setName('target').setDescription('User to ban').setRequired(true)),
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server.')
        .addUserOption(option => option.setName('target').setDescription('User to kick').setRequired(true)),
    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user temporarily.')
        .addUserOption(option => option.setName('target').setDescription('User to mute').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true)),
    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => option.setName('target').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(false)),
    new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete messages with filters.')
        .addIntegerOption(option => option.setName('count').setDescription('Number of messages to delete').setRequired(true)),

    // Advanced Auto-Moderation Commands
    new SlashCommandBuilder()
        .setName('spamprotection')
        .setDescription('Enable or disable spam protection.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable spam protection').setRequired(true)),
    new SlashCommandBuilder()
        .setName('contentfiltering')
        .setDescription('Enable or disable content filtering.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable content filtering').setRequired(true)),
    new SlashCommandBuilder()
        .setName('capsprotection')
        .setDescription('Enable or disable caps protection.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable caps protection').setRequired(true)),
    new SlashCommandBuilder()
        .setName('invitelinkcontrol')
        .setDescription('Enable or disable invite link control.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable invite link control').setRequired(true)),
    new SlashCommandBuilder()
        .setName('badwordsfilter')
        .setDescription('Manage custom bad words filtering.')
        .addStringOption(option => option.setName('action').setDescription('Add or remove bad words').setRequired(true))
        .addStringOption(option => option.setName('words').setDescription('Comma-separated list of words').setRequired(true)),
    new SlashCommandBuilder()
        .setName('punishmentsystem')
        .setDescription('Configure the progressive punishment system.')
        .addStringOption(option => option.setName('action').setDescription('Add or remove punishment levels').setRequired(true))
        .addStringOption(option => option.setName('details').setDescription('Details of the punishment level').setRequired(true)),

    // Server Lockdown Command
    new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock down the server.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Enable or disable lockdown').setRequired(true)),

    // Detailed Mod Logs Command
    new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('View detailed moderation logs.')
        .addStringOption(option => option.setName('type').setDescription('Type of logs (e.g., bans, kicks, warnings)').setRequired(true)),

    // Music System Commands
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist.')
        .addStringOption(option => option.setName('query').setDescription('Song or playlist URL').setRequired(true)),
    new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song.'),
    new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),

    // Server Management Commands
    new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Set up welcome messages.')
        .addStringOption(option => option.setName('message').setDescription('Custom welcome message').setRequired(true)),
    new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Set up reaction roles.')
        .addStringOption(option => option.setName('roles').setDescription('Roles to assign').setRequired(true)),

    // Fun & Engagement Commands
    new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway.')
        .addStringOption(option => option.setName('prize').setDescription('Prize for the giveaway').setRequired(true))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true)),
    new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll.')
        .addStringOption(option => option.setName('question').setDescription('Poll question').setRequired(true))
        .addStringOption(option => option.setName('options').setDescription('Comma-separated options').setRequired(true)),

    // Utility Commands
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create a custom embed.')
        .addStringOption(option => option.setName('title').setDescription('Embed title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Embed description').setRequired(true)),
    new SlashCommandBuilder()
        .setName('log')
        .setDescription('View server logs.')
        .addStringOption(option => option.setName('type').setDescription('Type of logs (e.g., messages, mod actions)').setRequired(true)),
];
