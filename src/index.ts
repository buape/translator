import type { ExecutionContext } from "@cloudflare/workers-types/2023-07-01"
export interface Env {
	PUBLIC_KEY: string
	CLIENT_ID: string
	CLIENT_SECRET: string
	TOKEN: string
}
import { isValidRequest, PlatformAlgorithm } from "discord-verify"
import { Router } from "itty-router"
import { InteractionRouter } from "./bot/bot"
import { deployCommands } from "./deploy"
import { JsonResponse } from "./utils"
import {
	type APIInteraction,
	InteractionResponseType,
	InteractionType
} from "discord-api-types/v10"

const router = Router()

router.get("/", () => {
	return Response.redirect("https://buape.com", 302)
})

router.get("/deploy/urmom", async (_req, { env }) => {
	const deployed = await deployCommands(env)
	if (!deployed) {
		return new Response(`Failed to deploy commands`, {
			status: 500
		})
	}
	return new Response("Deployed commands")
})

router.all("/interaction", (req, { env }) =>
	InteractionRouter.fetch(req, { env })
)

router.all("*", () => new Response("Not found", { status: 404 }))

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		if (request.method === "POST" && request.url.includes("/interaction")) {
			const isValid = await isValidRequest(
				request,
				env.PUBLIC_KEY,
				PlatformAlgorithm.Cloudflare
			)
			if (!isValid) {
				return new Response("Invalid request signature", { status: 401 })
			}

			const reqData = (await request.clone().json()) as APIInteraction
			if (reqData.type === InteractionType.Ping) {
				return new Response(
					JSON.stringify({ type: InteractionResponseType.Pong })
				)
			}
		}
		return router.fetch(request, { env, ctx })
	}
}
