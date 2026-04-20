const LoadingSpinner = ({ modal = false }) => {
  return (
    <div
      className={`${
        modal
          ? "flex justify-center"
          : "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-md">
        <svg
          className="animate-spin h-8 w-8 text-blue-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;
