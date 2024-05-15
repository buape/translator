import {
	type RESTPostAPIGuildForumThreadsJSONBody,
	RouteBases,
	Routes,
	type RESTPostAPIChannelMessageJSONBody,
	type APIThreadChannel,
	type APIDMChannel,
	type APIUser
} from "discord-api-types/v10"
import type { Env } from "."

export const randomString = () => {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	)
}
export class JsonResponse extends Response {
	constructor(body?: unknown, init?: ResponseInit) {
		const jsonBody = JSON.stringify(body)
		super(jsonBody, {
			...init,
			headers: {
				"content-type": "application/json;charset=UTF-8"
			}
		})
	}
}

type CookieOptions = {
	name: string
	value: string
	domain?: string
	path?: string
	expires?: Date
	httpOnly?: boolean
	maxAge?: number
	partitioned?: boolean
	secure?: boolean
	sameSite?: "Strict" | "Lax" | "None"
}

export const setCookies = (
	response: Response,
	...cookies: CookieOptions[]
): Response => {
	for (const options of cookies) {
		response.headers.append(
			"Set-Cookie",
			`${options.name}=${options.value}\
  ${options?.domain ? `; Domain=${options.domain}` : ""}\
  ${options?.path ? `; Path=${options?.path}` : ""}\
  ${options?.httpOnly ? `; HttpOnly` : ""}\
  ${options?.secure ? `; Secure` : ""}\
  ${options?.expires ? `; Expires=${options.expires.toUTCString()}` : ""}\
  ${options?.maxAge ? `; Max-Age=${options.maxAge}` : ""}\
  ${options?.partitioned ? `; Partitioned` : ""}\
  ${options?.sameSite ? `; SameSite=${options.sameSite}` : ""}`
		)
	}
	return response
}

export const parseCookies = (request: Request): Record<string, string> => {
	const cookieHeader = request.headers.get("cookie")
	if (!cookieHeader) return {}
	const cookies = cookieHeader.split(";")
	const cookieMap: Record<string, string> = {}
	for (const cookie of cookies) {
		const [name, value] = cookie.split("=")
		cookieMap[name.trim()] = value
	}
	return cookieMap
}

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))
