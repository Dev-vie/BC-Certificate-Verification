import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between w-full max-w-80 text-slate-500 font-medium">

      <button
        type="button"
        aria-label="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`rounded-full bg-slate-100 hover:bg-slate-200 transition-colors p-1 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
            fill="#475569"
            stroke="#475569"
            strokeWidth=".078"
          />
        </svg>
      </button>

      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {pageNumbers.map((number) => {
          const isActive = number === currentPage;
          return (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`h-8 w-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/10'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {number}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`rounded-full bg-slate-100 hover:bg-slate-200 transition-colors p-1 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <svg className="rotate-180" width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066a.9.9 0 0 1-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z"
            fill="#475569"
            stroke="#475569"
            strokeWidth=".078"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
