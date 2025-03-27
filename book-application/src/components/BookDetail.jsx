import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetail = () => {
    const { workId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                setLoading(true);

                // First fetch the work details
                const workResponse = await fetch(`https://openlibrary.org/works/${workId}.json`);
                if (!workResponse.ok) throw new Error('Failed to fetch work details');
                const workData = await workResponse.json();
                setBookDetails(workData);

                // Then try to find the edition details (for cover image and other metadata)
                if (workData.covers?.[0]) {
                    const coverId = workData.covers[0];
                    setBook({
                        ...workData,
                        cover_i: coverId,
                        key: `/works/${workId}`
                    });
                } else {
                    // If no cover in work data, try to get an edition
                    const editionResponse = await fetch(`https://openlibrary.org/works/${workId}/editions.json?limit=1`);
                    if (!editionResponse.ok) throw new Error('Failed to fetch edition data');
                    const editionData = await editionResponse.json();

                    if (editionData.entries?.length > 0) {
                        const firstEdition = editionData.entries[0];
                        setBook({
                            ...workData,
                            ...firstEdition,
                            key: `/works/${workId}`
                        });
                    } else {
                        setBook({
                            ...workData,
                            key: `/works/${workId}`
                        });
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookData();
    }, [workId]);

    const coverUrl = book?.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null;

    const authors = bookDetails?.authors?.map(a => a.author?.name).join(', ') || 'Unknown Author';
    const publishYear = book?.publish_date || book?.first_publish_year || 'Unknown';
    const isbn = book?.isbn_10?.[0] || book?.isbn_13?.[0] || 'Not available';
    const pageCount = book?.number_of_pages || bookDetails?.number_of_pages || 'Unknown';
    const subjects = book?.subjects || bookDetails?.subjects?.slice(0, 5) || ['Not available'];
    const description = typeof bookDetails?.description === 'string'
        ? bookDetails.description
        : bookDetails?.description?.value || 'No description available';

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
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
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                    Back to search
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to results
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center h-96">
                        {coverUrl ? (
                            <img
                                src={coverUrl}
                                alt={book?.title}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                                }}
                            />
                        ) : (
                            <div className="text-gray-400 text-center p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="mt-2">No cover available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:w-2/3 lg:w-3/4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {book?.title || 'Untitled'}
                    </h1>

                    <p className="text-xl text-gray-600 mb-6">
                        By {authors}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Published</h3>
                            <p className="mt-1 text-sm text-gray-900">{publishYear}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                            <p className="mt-1 text-sm text-gray-900">{isbn}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Pages</h3>
                            <p className="mt-1 text-sm text-gray-900">{pageCount}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                            <p className="mt-1 text-sm text-gray-900">
                                {book?.publishers?.[0] || 'Not available'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">
                            {description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Subjects</h2>
                        <div className="flex flex-wrap gap-2">
                            {subjects.slice(0, 5).map((subject, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                >
                                    {typeof subject === 'string' ? subject : subject.name || subject}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;