import { Routes } from "discord-api-types/v10"
import { getRawCommands } from "./bot/commands"
import type { Env } from "."

const baseUrl = "https://discord.com/api/v9"

const deployCommands = async (env: Env) => {
	const commands = getRawCommands()
	console.log(commands)
	const response = await fetch(
		baseUrl + Routes.applicationCommands(env.CLIENT_ID),
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${env.TOKEN}`
			},
			method: "PUT",
			body: JSON.stringify(commands)
		}
	).catch((e) => {
		console.error(e)
	})
	if (!response) {
		console.error(commands)
	}
	return response
}

export { deployCommands }
