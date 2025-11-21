import * as z from "zod/mini"

const settingsParser = z.object({
    currency: z.string(),
    hourly_rate: z.number(),
    use_rate: z.boolean()
})

export type settings = z.infer<typeof settingsParser>

const defaultSettings: settings = {
    currency: "EUR",
    hourly_rate: 95.0,
    use_rate: false
}

export function loadSettings(): settings {
    const loaded = localStorage.getItem("taximeter")
    if (loaded) {
        try {
            const parsed = JSON.parse(loaded)
            return settingsParser.parse(parsed)
        } catch {
            return defaultSettings
        }
    } else {
        return defaultSettings
    }
}

export function saveSettings(settings: settings): void {
    localStorage.setItem("taximeter", JSON.stringify(settings))
}
