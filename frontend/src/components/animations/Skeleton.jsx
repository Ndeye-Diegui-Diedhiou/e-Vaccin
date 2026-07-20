import { motion } from 'framer-motion';

export const SkeletonRow = () => (
  <div className="flex items-center space-x-4 w-full p-4">
    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
    </div>
  </div>
);

const Skeleton = ({ variant = "row" }) => {
  if (variant === "card") return <SkeletonCard />;
  return <SkeletonRow />;
};

export default Skeleton;
