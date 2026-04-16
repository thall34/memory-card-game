function Card({ name, url, onClick }) {
    return (
        <div className='card'>
            <button onClick={onClick}>
                <img src={`${url}`} alt={name}></img>
                <p>{name}</p>
            </button>
        </div>
    )
}

export { Card }