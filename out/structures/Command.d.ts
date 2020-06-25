import CommandContext from './CommandContext';
import ValClient from '../ValClient';
import { CommandOptions, ICommand } from '../types/interfaces';
import { Message } from 'discord.js';
export default class Command implements ICommand {
    private client;
    private ready;
    private cooldownTimer;
    options: CommandOptions;
    constructor(client: ValClient, options: CommandOptions);
    run: (message: Message) => void;
    private isAllowed;
    private isDevCommand;
    private isAllowedRoles;
    private enforceCooldown;
    private enforceParams;
    _run: (context: CommandContext) => void;
    stop: (context: CommandContext, isGraceful: boolean, error: Error) => void;
    help: (message: Message) => void;
}
