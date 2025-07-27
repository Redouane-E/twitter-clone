import { motion } from 'framer-motion';

const PostSkeleton = () => {
  return (
    <motion.div 
      className="card"
      style={{ paddingBottom: '12px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <motion.div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-color)',
          }}
          animate={{
            backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="flex-1">
          {/* Header skeleton */}
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              style={{
                height: '16px',
                width: '120px',
                borderRadius: '4px',
                backgroundColor: 'var(--border-color)',
              }}
              animate={{
                backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1
              }}
            />
            <motion.div
              style={{
                height: '14px',
                width: '80px',
                borderRadius: '4px',
                backgroundColor: 'var(--border-color)',
              }}
              animate={{
                backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </div>
          
          {/* Content skeleton */}
          <div style={{ marginBottom: '12px' }}>
            <motion.div
              style={{
                height: '16px',
                width: '100%',
                borderRadius: '4px',
                backgroundColor: 'var(--border-color)',
                marginBottom: '8px'
              }}
              animate={{
                backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            />
            <motion.div
              style={{
                height: '16px',
                width: '80%',
                borderRadius: '4px',
                backgroundColor: 'var(--border-color)',
                marginBottom: '8px'
              }}
              animate={{
                backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            <motion.div
              style={{
                height: '16px',
                width: '60%',
                borderRadius: '4px',
                backgroundColor: 'var(--border-color)',
              }}
              animate={{
                backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
          
          {/* Actions skeleton */}
          <div className="flex items-center gap-6" style={{ maxWidth: '300px' }}>
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex items-center gap-2">
                <motion.div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-color)',
                  }}
                  animate={{
                    backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6 + index * 0.1
                  }}
                />
                <motion.div
                  style={{
                    height: '12px',
                    width: '20px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--border-color)',
                  }}
                  animate={{
                    backgroundColor: ['var(--border-color)', 'var(--background-hover)', 'var(--border-color)']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7 + index * 0.1
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostSkeleton;