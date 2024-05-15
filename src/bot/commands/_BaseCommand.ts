import type {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandAutocompleteResponse,
	APIApplicationCommandBasicOption,
	APIApplicationCommandInteraction,
	APIApplicationCommandOption,
	APIInteractionResponse
} from "discord-api-types/v10"
import type { Env } from "../.."
import { ApplicationIntegrationType, InteractionContextType } from "../../types"

export type AnyCommand =
	| Command
	| CommandWithOptions
	| CommandWithAutocomplete
	| CommandWithSubcommands

export type RunnableCommand = Exclude<AnyCommand, CommandWithSubcommands>

export abstract class BaseCommand {
	abstract name: string
	abstract description: string
	abstract guildOnly?: boolean
	abstract defer?: boolean
	/**
	 * The places this command can be used in
	 * @beta API types are not finalized
	 */
	integrationTypes: ApplicationIntegrationType[] = [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	]
	/**
	 * The contexts this command can be used in
	 * @beta API types are not finalized
	 */
	contexts: InteractionContextType[] = [
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	]
}

export abstract class Command extends BaseCommand {
	abstract run(
		interaction: APIApplicationCommandInteraction,
		env: Env
	): Promise<APIInteractionResponse | undefined>
}

export abstract class CommandWithOptions extends Command {
	abstract options: APIApplicationCommandBasicOption[]
}

export abstract class CommandWithAutocomplete extends CommandWithOptions {
	abstract autocomplete(
		interaction: APIApplicationCommandAutocompleteInteraction,
		env: Env
	): Promise<APIApplicationCommandAutocompleteResponse | undefined>
}

export abstract class CommandWithSubcommands extends BaseCommand {
	abstract subcommands: RunnableCommand[]
}
