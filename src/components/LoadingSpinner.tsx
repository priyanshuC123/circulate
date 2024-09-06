const LoadingSpinner: React.FC = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 border-r-blue-600 rounded-full animate-spin delay-150"></div>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  