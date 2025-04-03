interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const half = Math.floor(maxVisiblePages / 2);
        let start = currentPage - half;
        let end = currentPage + half;
        
        if (start < 1) {
          start = 1;
          end = maxVisiblePages;
        }
        
        if (end > totalPages) {
          end = totalPages;
          start = totalPages - maxVisiblePages + 1;
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };
  
    return (
      <div className="flex-1 flex justify-between sm:justify-center items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Previous</span>
          &larr; Previous
        </button>
  
        <nav className="hidden sm:flex">
          <ul className="flex">
            {getPageNumbers().map((page) => (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'bg-[#8B4513] text-white border-[#8B4513]'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
  
        <span className="text-sm text-gray-700 mx-2 sm:hidden">
          Page {currentPage} of {totalPages}
        </span>
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <span className="sr-only">Next</span>
          Next &rarr;
        </button>
      </div>
    );
  };
  
  export default Pagination;