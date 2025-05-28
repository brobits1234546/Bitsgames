import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Gamepad2 className="h-20 w-20 text-indigo-500 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;