import {
	type APIInteractionResponse,
	InteractionResponseType,
	ApplicationCommandOptionType,
	type APIApplicationCommandBasicOption,
	type APIChatInputApplicationCommandInteraction,
	type APIApplicationCommandInteractionDataStringOption
} from "discord-api-types/v10"
import type { CommandWithOptions } from "./_BaseCommand"
import type { Env } from "../.."
import { ApplicationIntegrationType, InteractionContextType } from "../../types"
import {
	pirate,
	kenny,
	LOLCAT,
	scottish,
	spammer,
	upsidedown,
	cockney,
	newspeak
} from "talk-like-a"

const styles = [
	{
		name: "Pirate",
		value: "pirate"
	},
	{
		name: "Kenny from South Park",
		value: "kenny"
	},
	{
		name: "LOLCAT",
		value: "LOLCAT"
	},
	{
		name: "Scottish",
		value: "scottish"
	},
	{
		name: "Spambot",
		value: "spammer"
	},
	{
		name: "Upside Down",
		value: "upsidedown"
	},
	{
		name: "Cockney",
		value: "cockney"
	},
	{
		name: "Newspeak, like its 1984",
		value: "newspeak"
	}
] as const

export default class Translate implements CommandWithOptions {
	integrationTypes = [
		ApplicationIntegrationType.GuildInstall,
		ApplicationIntegrationType.UserInstall
	]
	contexts = [
		InteractionContextType.Guild,
		InteractionContextType.BotDM,
		InteractionContextType.PrivateChannel
	]
	name = "translate"
	description = "Translate anything you want"

	options = [
		{
			type: ApplicationCommandOptionType.String,
			name: "style",
			description: "The style you want to translate to",
			required: true,
			choices: styles
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "message",
			description: "The message you want to translate",
			required: true
		}
	] as APIApplicationCommandBasicOption[]

	async run(
		interaction: APIChatInputApplicationCommandInteraction,
		_env: Env
	): Promise<APIInteractionResponse | undefined> {
		// b-ignore lint/suspicious/noExplicitAny: <explanation>
		// const isGuildInstall = !!(interaction as any)
		// 	.authorizing_integration_owners[0]

		const style = (
			interaction.data.options?.find(
				(x) => x.name === "style"
			) as APIApplicationCommandInteractionDataStringOption
		).value
		const message = (
			interaction.data.options?.find(
				(x) => x.name === "message"
			) as APIApplicationCommandInteractionDataStringOption
		).value

		if (!style || !message)
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: { content: "Missing options" }
			}

		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: translateMessage(
					style as (typeof styles)[number]["value"],
					message
				)
				// flags: isGuildInstall ? MessageFlags.Ephemeral : undefined
			}
		}
	}
}

export const translateMessage = (
	style: (typeof styles)[number]["value"],
	originalString: string
) => {
	switch (style) {
		case "pirate":
			return pirate(originalString)
		case "kenny":
			return kenny(originalString)
		case "LOLCAT":
			return LOLCAT(originalString)
		case "scottish":
			return scottish(originalString)
		case "spammer":
			return spammer(originalString)
		case "upsidedown":
			return upsidedown(originalString)
		case "cockney":
			return cockney(originalString)
		case "newspeak":
			return newspeak(originalString)
	}
}
