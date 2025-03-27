

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';

const BookList = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const searchBooks = async () => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }

            const data = await response.json();
            setBooks(data.docs || []);

            if (data.docs.length === 0) {
                setError('No books found. Try a different search.');
            }
        } catch (err) {
            setError(err.message);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchBooks();
        }
    };

    const handleBookSelect = (book) => {
        // Extract the work ID from the book key (format: "/works/OL123W")
        const workId = book.key.split('/').pop();
        navigate(`/books/${workId}`);
    };

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Search</h1>
                <p className="text-lg text-gray-600">Find books using the Open Library API</p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
                <div className="flex shadow-sm rounded-md">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search for books..."
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    />
                    <button
                        onClick={searchBooks}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {books.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book.key}
                            book={book}
                            onSelect={handleBookSelect}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default BookList;