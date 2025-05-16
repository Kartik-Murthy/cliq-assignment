'use client';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Home, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white/70 shadow-xl backdrop-blur-sm">
        <div className="p-8">
          <div className="space-y-8">
            {/* Error Icon and Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 animate-pulse rounded-full bg-red-100" />
                <AlertCircle className="relative h-24 w-24 animate-bounce text-red-500" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4 text-center">
              <h1 className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
              <p className="mx-auto max-w-md text-gray-600">
                Oops! The page you&apos;re looking for seems to have wandered off into the digital
                wilderness. Let&apos;s get you back on track.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-4 opacity-10">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300" />
              <div className="h-16 w-16 animate-ping rounded-full border-4 border-gray-300" />
              <div className="h-16 w-16 animate-pulse rounded-full border-4 border-gray-300" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="default"
                size="lg"
                className="group w-full transition-all duration-300 hover:shadow-lg sm:w-auto"
                onClick={handleGoHome}
              >
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Back to Home
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group w-full transition-all duration-300 sm:w-auto"
                onClick={handleGoBack}
              >
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Go Back
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="group w-full transition-all duration-300 sm:w-auto"
                onClick={handleRetry}
              >
                <RefreshCcw className="mr-2 h-5 w-5 transition-transform group-hover:rotate-180" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
