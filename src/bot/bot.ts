import { Router } from "itty-router"
import {
	InteractionType,
	type APIInteraction,
	ApplicationCommandOptionType,
	type APIInteractionResponseChannelMessageWithSource,
	type RESTPostAPIWebhookWithTokenJSONBody
} from "discord-api-types/v10"
import { getCommand } from "./commands"
import { JsonResponse } from "../utils"
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10"
import type { Env } from ".."
import type { ExecutionContext } from "@cloudflare/workers-types/2023-07-01"

const router = Router({ base: "/interaction" })

router.post("/", async (request, data: { env: Env; ctx: ExecutionContext }) => {
	const reqData = (await request.json()) as APIInteraction

	// Application Command
	if (reqData.type === InteractionType.ApplicationCommand) {
		if (isChatInputApplicationCommandInteraction(reqData)) {
			const name = reqData.data.name
			const cmd = getCommand(name)
			if (!cmd) {
				return new Response("Not found", { status: 404 })
			}

			if ("subcommands" in cmd) {
				const subName = reqData.data.options?.find(
					(option) => option.type === ApplicationCommandOptionType.Subcommand
				)?.name
				if (!subName) {
					return new Response("Not found", { status: 404 })
				}
				const subCmd = cmd.subcommands.find((subCmd) => subCmd.name === subName)
				if (!subCmd) {
					return new Response("Not found", { status: 404 })
				}
				const result = (await subCmd.run(
					reqData,
					data.env
				)) as APIInteractionResponseChannelMessageWithSource
				if (result) {
					if (subCmd.defer) {
						return await fetch(
							`https://discord.com/api/v9/webhooks/${reqData.application_id}/${reqData.token}/messages/@original`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json"
								},
								body: JSON.stringify({
									...result.data
								} satisfies RESTPostAPIWebhookWithTokenJSONBody)
							}
						)
					}
					return new JsonResponse(result)
				}
			} else {
				const result = (await cmd.run(
					reqData,
					data.env
				)) as APIInteractionResponseChannelMessageWithSource

				if (result) {
					if (cmd.defer) {
						return await fetch(
							`https://discord.com/api/v9/webhooks/${reqData.application_id}/${reqData.token}/messages/@original`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json"
								},
								body: JSON.stringify({
									...result.data
								} satisfies RESTPostAPIWebhookWithTokenJSONBody)
							}
						)
					}
					return new JsonResponse(result)
				}
			}
		}
	}

	// if (reqData.type === InteractionType.MessageComponent) {
	// 	const component = getComponent(
	// 		reqData.data.custom_id,
	// 		reqData.data.component_type
	// 	)
	// 	if (!component) {
	// 		return new Response("Not found", { status: 404 })
	// 	}
	// 	const [_, ...options] = reqData.data.custom_id.split(":")
	// 	const result = (await component.run(
	// 		reqData,
	// 		options,
	// 		data.env
	// 	)) as APIInteractionResponseChannelMessageWithSource
	// 	if (result) {
	// 		if (component.defer) {
	// 			return await fetch(
	// 				`https://discord.com/api/v9/webhooks/${reqData.application_id}/${reqData.token}/messages/@original`,
	// 				{
	// 					method: "PATCH",
	// 					headers: {
	// 						"Content-Type": "application/json"
	// 					},
	// 					body: JSON.stringify({
	// 						...result.data
	// 					} satisfies RESTPostAPIWebhookWithTokenJSONBody)
	// 				}
	// 			)
	// 		}
	// 		return new JsonResponse(result)
	// 	}
	// }

	// if (reqData.type === InteractionType.ModalSubmit) {
	// 	const modal = getModal(reqData.data.custom_id)
	// 	if (!modal) {
	// 		return new Response("Not found", { status: 404 })
	// 	}
	// 	const result = (await modal.run(
	// 		reqData,
	// 		data.env
	// 	)) as APIInteractionResponseChannelMessageWithSource
	// 	if (result) {
	// 		if (modal.followUp) {
	// 			return await fetch(
	// 				`https://discord.com/api/v9/webhooks/${reqData.application_id}/${reqData.token}`,
	// 				{
	// 					method: "POST",
	// 					headers: {
	// 						"Content-Type": "application/json"
	// 					},
	// 					body: JSON.stringify({
	// 						...result.data
	// 					})
	// 				}
	// 			)
	// 		}
	// 		if (modal.defer) {
	// 			return await fetch(
	// 				`https://discord.com/api/v9/webhooks/${reqData.application_id}/${reqData.token}/messages/@original`,
	// 				{
	// 					method: "PATCH",
	// 					headers: {
	// 						"Content-Type": "application/json"
	// 					},
	// 					body: JSON.stringify({
	// 						...result.data
	// 					} satisfies RESTPostAPIWebhookWithTokenJSONBody)
	// 				}
	// 			)
	// 		}

	// 		return new JsonResponse(result)
	// 	}
	// }

	// Autocomplete
	if (reqData.type === InteractionType.ApplicationCommandAutocomplete) {
		const name = reqData.data.name
		const cmd = getCommand(name)
		if (!cmd) {
			return new Response("Not found", { status: 404 })
		}

		if ("subcommands" in cmd) {
			const subName = reqData.data.options?.find(
				(option) => option.type === ApplicationCommandOptionType.Subcommand
			)?.name
			if (!subName) {
				return new Response("Not found", { status: 404 })
			}
			const subCmd = cmd.subcommands.find((subCmd) => subCmd.name === subName)
			if (!subCmd) {
				return new Response("Not found", { status: 404 })
			}
			if ("autocomplete" in subCmd) {
				const result = await subCmd.autocomplete(reqData, data.env)
				if (result) {
					return new JsonResponse(result)
				}
			} else {
				return new Response("Not found", { status: 404 })
			}
		}

		if ("autocomplete" in cmd) {
			const result = await cmd.autocomplete(reqData, data.env)
			if (result) {
				return new JsonResponse(result)
			}
		} else {
			return new Response("Not found", { status: 404 })
		}
	}

	return new Response("Not found", { status: 404 })
})

router.all("*", () => new Response("Not found", { status: 404 }))

export { router as InteractionRouter }
