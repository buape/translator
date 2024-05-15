import {
	ApplicationCommandOptionType,
	type APIApplicationCommandSubcommandOption,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10"
import type { AnyCommand, BaseCommand } from "./_BaseCommand"

import Translate from "./Translate"

const commands: AnyCommand[] = [new Translate()]

const getCommand = (name: string): AnyCommand | null => {
	const command = commands.find((command) => command.name === name)
	if (!command) {
		console.error(`Command "${name}" not found`)
		return null
	}
	return command
}

const getRawCommands = () => {
	const rawCommands = commands.map(
		(
			command
		): RESTPostAPIApplicationCommandsJSONBody & {
			integration_types: BaseCommand["integrationTypes"]
			contexts: BaseCommand["contexts"]
		} => {
			return {
				name: command.name,
				description: command.description,
				dm_permission: !command.guildOnly,
				options:
					"subcommands" in command
						? command.subcommands.map(
								(subcommand): APIApplicationCommandSubcommandOption => {
									return {
										type: ApplicationCommandOptionType.Subcommand,
										name: subcommand.name,
										description: subcommand.description,
										options: "options" in subcommand ? subcommand.options : []
									}
								}
							)
						: "options" in command
							? command.options
							: [],
				integration_types: command.integrationTypes,
				contexts: command.contexts
			}
		}
	)
	return rawCommands
}

export { commands, getCommand, getRawCommands }
