import { useEffect } from "react"
import toast from "react-hot-toast"

const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({isError, error, fallback}) => {
            if(isError) {
                if(fallback) fallback()
                else toast.error(error?.data?.message || "Something went wrong")
            }
        })
    }, [errors])
}

const useSocketEvents = (socket,handlers) => {
    useEffect(() => {
        Object.entries(handlers).map(([event, handler]  ) => {
            socket.on(event,handler)
        })

        return () => {
            Object.entries(handlers).map(([event, handler]) => {
                socket.off(event,handler)
            })
        }
    }, [socket,handlers])
}

export {
    useErrors,
    useSocketEvents
}