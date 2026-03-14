import { useEffect, useState } from "react"

interface Countdown {
    days: number
    hours: number
    minutes: number
    seconds: number
}

export function useCountdown(targetDate?: string) {
    const [timeLeft, setTimeLeft] = useState<Countdown>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        if (!targetDate) return

        const target = new Date(targetDate).getTime()

        const updateCountdown = () => {
            const diff = target - Date.now()

            if (diff <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                })
                return
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            })
        }

        updateCountdown() // run once immediately

        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)

    }, [targetDate])

    return timeLeft
}