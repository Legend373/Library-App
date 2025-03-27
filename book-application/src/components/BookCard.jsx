import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    // Extract the work ID from the book key (format: "/works/OL123W")
    const workId = book.key.split('/').pop();

    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null;

    const authors = book.author_name?.join(', ') || 'Unknown Author';

    return (
        <Link
            to={`/books/${workId}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={book.title}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
                        }}
                    />
                ) : (
                    <div className="text-gray-400 text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p>No cover available</p>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {book.title || 'Untitled'}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-1">
                    <span className="font-medium">By:</span> {authors}
                </p>
            </div>
        </Link>
    );
};

export default BookCard;