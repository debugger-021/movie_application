import React from 'react'

const Search = ({ search, setSearch }) => {
  
  return (
    <>
      <div className='search'>
        <img src="./search.svg" alt="" />
        <input
          type="text"
          placeholder='Search a movie of your choice'
          value={search}
          onChange={e => { setSearch(e.target.value) }}
        />
      </div>
    </>
  )
}

export default Search
