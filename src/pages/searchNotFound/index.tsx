import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'rsuite'

const SearchNotFound = () => {
    const history = useHistory()
    return (
        <div className="container search-not-found-container">
            <h2>Search Not Found</h2>
            <Button appearance="primary" onClick={() => {history.push(`/`)}}>Back To Home</Button>
        </div>
    )
}

export default SearchNotFound