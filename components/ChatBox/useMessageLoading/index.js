import { useEffect, useState } from "react"
import { getChatPaging } from "../../../client/presentation"

export default function useMessageLoading(pageNumber, presentationId) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)
    const [results, setIsResults] = useState([])

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)
        setError({})

        getChatPaging(pageNumber, presentationId)
            .then(data => {
                setIsResults(prev => [... new Set([...data.message.map(mess => JSON.parse(mess)), ...prev])])
                setHasNextPage(Boolean(data.message.length))
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
                setIsError(true)
                setError({ message: e.message })
            })

    }, [pageNumber, presentationId])

    return { isLoading, isError, error, results, hasNextPage }
}
